from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
import uuid

from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product


def get_or_create_cart(request):
    """Helper: get or create the cart for the given user or session."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    session_id = request.headers.get('X-Session-ID')
    if session_id:
        cart, _ = Cart.objects.get_or_create(session_id=session_id, user__isnull=True)
        return cart

    # If no session ID, generate one and create a cart
    new_session_id = str(uuid.uuid4())
    cart = Cart.objects.create(session_id=new_session_id)
    return cart


@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    """
    Get the current user's or guest's cart with all items.
    """
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_to_cart(request):
    """
    Add a product to the cart. If already in cart, increments quantity.
    Request body: { "product_id": 1, "quantity": 2 }
    """
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)

    if not product_id:
        return Response(
            {"error": "product_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return Response(
            {"error": "quantity must be a positive integer."},
            status=status.HTTP_400_BAD_REQUEST
        )

    product = get_object_or_404(Product, pk=product_id, is_available=True)

    # Validate stock
    if quantity > product.stock:
        return Response(
            {"error": f"Only {product.stock} unit(s) available in stock."},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart = get_or_create_cart(request)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        # Product already in cart — add to existing quantity
        new_quantity = cart_item.quantity + quantity
        if new_quantity > product.stock:
            return Response(
                {"error": f"Cannot add {quantity} more. Only {product.stock - cart_item.quantity} unit(s) left."},
                status=status.HTTP_400_BAD_REQUEST
            )
        cart_item.quantity = new_quantity
        cart_item.save()
    else:
        cart_item.quantity = quantity
        cart_item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_cart_item(request, pk):
    """
    Update the quantity of a specific cart item.
    Request body: { "quantity": 3 }
    """
    quantity = request.data.get('quantity')

    if quantity is None:
        return Response(
            {"error": "quantity is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        quantity = int(quantity)
        if quantity < 1:
            raise ValueError
    except (ValueError, TypeError):
        return Response(
            {"error": "quantity must be a positive integer."},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, pk=pk, cart=cart)

    # Validate stock
    if quantity > cart_item.product.stock:
        return Response(
            {"error": f"Only {cart_item.product.stock} unit(s) available in stock."},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_item.quantity = quantity
    cart_item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_cart_item(request, pk):
    """
    Remove a specific item from the cart.
    """
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, pk=pk, cart=cart)
    cart_item.delete()
    return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_cart(request):
    """
    Remove all items from the cart.
    """
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    return Response({"message": "Cart cleared."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_cart(request):
    """
    Merge a guest cart into the authenticated user's cart.
    Request body: { "session_id": "uuid-string" }
    """
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({"message": "No session_id provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        guest_cart = Cart.objects.get(session_id=session_id, user__isnull=True)
    except Cart.DoesNotExist:
        return Response({"message": "Guest cart not found."}, status=status.HTTP_404_NOT_FOUND)

    user_cart, created = Cart.objects.get_or_create(user=request.user)

    if guest_cart.id == user_cart.id:
         return Response({"message": "Cart already merged."}, status=status.HTTP_200_OK)

    # Merge items
    for guest_item in guest_cart.items.all():
        user_item, created = CartItem.objects.get_or_create(
            cart=user_cart,
            product=guest_item.product,
            defaults={'quantity': guest_item.quantity}
        )
        if not created:
            # If the product already exists in the user cart, add quantities but limit to stock
            new_quantity = user_item.quantity + guest_item.quantity
            user_item.quantity = min(new_quantity, user_item.product.stock)
            user_item.save()

    # Delete the guest cart after successful merge
    guest_cart.delete()

    serializer = CartSerializer(user_cart)
    return Response(serializer.data, status=status.HTTP_200_OK)
