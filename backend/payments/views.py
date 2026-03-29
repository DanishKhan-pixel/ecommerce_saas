import hmac
import hashlib
import json
import requests
from decimal import Decimal
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order


PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize"
PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/"


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initialize_payment(request):
    """
    Customer initializes payment for unpaid orders.
    Expects { "order_ids": [1, 2] }
    """
    order_ids = request.data.get('order_ids', [])
    if not order_ids or not isinstance(order_ids, list):
        return Response(
            {"error": "Please provide a valid list of order_ids."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Fetch unpaid orders belonging to the customer
    orders = Order.objects.filter(id__in=order_ids, customer=request.user, is_paid=False)

    if not orders.exists():
        return Response(
            {"error": "No valid unpaid orders found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate total amount to pay across all selected orders
    total_amount = sum(order.total_price for order in orders)
    
    # Paystack requires amount in kobo (base currency * 100)
    amount_in_kobo = int(total_amount * 100)
    email = request.user.email

    if not email:
        return Response(
            {"error": "User email is required for Paystack checkout."},
            status=status.HTTP_400_BAD_REQUEST
        )

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    
    callback_url = request.data.get('callback_url')

    payload = {
        "email": email,
        "amount": amount_in_kobo,
    }
    if callback_url:
        payload["callback_url"] = callback_url

    try:
        res = requests.post(PAYSTACK_INITIALIZE_URL, json=payload, headers=headers)
        res_data = res.json()

        if res.status_code == 200 and res_data.get('status'):
            data = res_data['data']
            reference = data['reference']
            authorization_url = data['authorization_url']

            # Create internal Payment record
            payment = Payment.objects.create(
                user=request.user,
                amount=total_amount,
                reference=reference,
                status='pending'
            )
            
            # Link to the orders
            payment.orders.set(orders)

            return Response({
                "authorization_url": authorization_url,
                "reference": reference,
                "amount": total_amount
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Paystack Error", "details": res_data.get('message', 'Unknown Error')},
            status=status.HTTP_400_BAD_REQUEST
        )

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Failed to connect to payment gateway."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify payment from frontend after user returns from Paystack checkout.
    Expects { "reference": "tx_ref_abc123" }
    """
    reference = request.data.get('reference')
    if not reference:
        return Response(
            {"error": "reference is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Must find the pending payment for safety
    payment = get_object_or_404(Payment, reference=reference, user=request.user, status='pending')

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    try:
        res = requests.get(f"{PAYSTACK_VERIFY_URL}{reference}", headers=headers)
        res_data = res.json()

        if res.status_code == 200 and res_data.get('status'):
            verify_data = res_data['data']
            
            # Ensure payment was truly successful on Paystack's end
            if verify_data.get('status') == 'success':
                payment.status = 'success'
                payment.paystack_response = verify_data
                payment.save(update_fields=['status', 'paystack_response'])

                # Mark related orders as paid, update status, and decrement stock
                for order in payment.orders.all():
                    order.is_paid = True
                    order.status = 'processing'
                    order.save(update_fields=['is_paid', 'status'])
                    
                    for item in order.items.all():
                        item.product.stock -= item.quantity
                        item.product.save(update_fields=['stock'])

                return Response({"message": "Payment verified successfully."}, status=status.HTTP_200_OK)
            else:
                payment.status = 'failed'
                payment.paystack_response = verify_data
                payment.save(update_fields=['status', 'paystack_response'])
                return Response({"error": "Payment was not successful."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"error": "Paystack verification failed", "details": res_data.get('message', 'Unknown error')},
            status=status.HTTP_400_BAD_REQUEST
        )

    except requests.exceptions.RequestException:
        return Response(
            {"error": "Failed to connect to Paystack for verification."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def payment_webhook(request):
    """
    Receive background Webhook events directly from Paystack.
    Verifies the HMAC signature to ensure authenticity.
    """
    # Paystack sends signature in header
    paystack_signature = request.headers.get("X-Paystack-Signature")
    
    if not paystack_signature:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Verify signature
    computed_signature = hmac.new(
        PAYSTACK_SECRET_KEY.encode('utf-8'),
        request.body,
        hashlib.sha512
    ).hexdigest()

    if not hmac.compare_digest(computed_signature, paystack_signature):
        return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

    # Parse payload
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    event = payload.get('event')

    if event == 'charge.success':
        data = payload.get('data', {})
        reference = data.get('reference')

        # Find payment (might be pending or already processed by verify_payment)
        # Avoid user auth scoping here since webhooks come from server
        try:
            payment = Payment.objects.get(reference=reference)
            if payment.status == 'pending':
                payment.status = 'success'
                payment.paystack_response = data
                payment.save(update_fields=['status', 'paystack_response'])

                # Mark related orders as paid, update status, and decrement stock
                for order in payment.orders.all():
                    order.is_paid = True
                    order.status = 'processing'
                    order.save(update_fields=['is_paid', 'status'])
                    
                    for item in order.items.all():
                        item.product.stock -= item.quantity
                        item.product.save(update_fields=['stock'])

        except Payment.DoesNotExist:
            pass  # Could log unexpected reference

    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """
    Get all payments made by the current user.
    """
    payments = Payment.objects.filter(user=request.user).order_by('-created_at')
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
