from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from collections import defaultdict

from .models import Order, OrderItem
from .serializers import OrderSerializer, VendorOrderSerializer
from cart.models import Cart


# ─── Customer Endpoints ───────────────────────────────────────────────────────


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Checkout: convert the cart into one order per vendor.
    Cart items are split by vendor. Stock is decremented after order creation.
    """
    try:
        cart = request.user.cart
    except Cart.DoesNotExist:
        return Response(
            {"error": "Your cart is empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_items = cart.items.select_related('product__vendor').all()

    if not cart_items.exists():
        return Response(
            {"error": "Your cart is empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate stock for all items before creating any order
    for item in cart_items:
        if item.quantity > item.product.stock:
            return Response(
                {"error": f"Insufficient stock for '{item.product.name}'. Only {item.product.stock} left."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Split cart items by vendor
    items_by_vendor = defaultdict(list)
    for item in cart_items:
        items_by_vendor[item.product.vendor].append(item)

    created_orders = []

    for vendor, items in items_by_vendor.items():
        # Calculate total for this vendor's order
        total = sum(item.product.price * item.quantity for item in items)

        order = Order.objects.create(
            customer=request.user,
            vendor=vendor,
            total_price=total
        )

        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price  # snapshot price at time of order
            )

        created_orders.append(order)

    # Clear the cart after successful checkout
    cart.items.all().delete()

    serializer = OrderSerializer(created_orders, many=True)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    """
    Get all orders placed by the current customer.
    """
    from django.core.paginator import Paginator

    orders = Order.objects.filter(customer=request.user).order_by('-created_at')
    paginator = Paginator(orders, 3)
    page_number = request.query_params.get('page', 1)
    page_obj = paginator.get_page(page_number)

    serializer = OrderSerializer(page_obj.object_list, many=True)
    return Response({
        "results": serializer.data,
        "count": paginator.count,
        "num_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, pk):
    """
    Get a specific order belonging to the current customer.
    """
    order = get_object_or_404(Order, pk=pk, customer=request.user)
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─── Vendor Endpoints ─────────────────────────────────────────────────────────

def get_approved_vendor(user):
    """Helper: return vendor profile if user is an approved vendor, else None."""
    if hasattr(user, 'vendor_profile') and user.vendor_profile.is_approved:
        return user.vendor_profile
    return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_list_orders(request):
    """
    Get all orders for the current vendor's store.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can access this."},
            status=status.HTTP_403_FORBIDDEN
        )

    customer_name = request.query_params.get('customer_name', '')

    from django.core.paginator import Paginator

    orders = Order.objects.filter(vendor=vendor).order_by('-created_at')

    if customer_name:
        orders = orders.filter(customer__first_name__icontains=customer_name) | orders.filter(customer__last_name__icontains=customer_name)

    paginator = Paginator(orders, 10)
    page_number = request.query_params.get('page', 1)
    page_obj = paginator.get_page(page_number)

    serializer = VendorOrderSerializer(page_obj.object_list, many=True)
    return Response({
        "results": serializer.data,
        "count": paginator.count,
        "num_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_get_order(request, pk):
    """
    Get the details of a specific order for the current vendor.
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can access this."},
            status=status.HTTP_403_FORBIDDEN
        )

    order = get_object_or_404(Order, pk=pk, vendor=vendor)
    serializer = VendorOrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def vendor_update_order_status(request, pk):
    """
    Vendor can update the status of one of their orders.
    Request body: { "status": "shipped" }
    """
    vendor = get_approved_vendor(request.user)
    if not vendor:
        return Response(
            {"error": "Only approved vendors can update order status."},
            status=status.HTTP_403_FORBIDDEN
        )

    order = get_object_or_404(Order, pk=pk, vendor=vendor)

    new_status = request.data.get('status')
    valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]

    if not new_status:
        return Response(
            {"error": "status is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_status not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Choose from: {', '.join(valid_statuses)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = new_status
    order.save(update_fields=['status'])

    serializer = VendorOrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)
