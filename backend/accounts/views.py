from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user (defaults to customer)
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens for the new user immediately to allow instant usage
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint which returns JWT access and refresh tokens
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Please provide both email and password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "user": UserSerializer(user).data, 
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Get current logged-in user profile
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


from .permissions import IsAdminUser
from django.db.models import Sum, Count
from django.db import models

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """
    Get aggregated statistics for the admin dashboard.
    """
    from vendors.models import Vendor
    from products.models import Product, Category
    from orders.models import Order, OrderItem
    
    total_vendors = Vendor.objects.filter(is_approved=True).count()
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    
    revenue_agg = Order.objects.filter(is_paid=True).aggregate(total=Sum('total_price'))
    total_revenue = revenue_agg['total'] or 0.00
    
    # Best selling vendors
    best_vendors = Vendor.objects.annotate(
        orders_count=Count('orders', filter=models.Q(orders__is_paid=True))
    ).order_by('-orders_count')[:5]
    top_vendors_data = [{"name": v.store_name, "value": v.orders_count} for v in best_vendors if v.orders_count > 0]
    
    # Best selling products
    best_products = Product.objects.annotate(
        units_sold=Sum('order_items__quantity', filter=models.Q(order_items__order__is_paid=True))
    ).order_by('-units_sold')[:5]
    top_products_data = [{"name": p.name[:25] + '...' if len(p.name) > 25 else p.name, "value": p.units_sold or 0} for p in best_products if p.units_sold and p.units_sold > 0]
    
    # Best selling categories
    best_categories = Category.objects.annotate(
        units_sold=Sum('products__order_items__quantity', filter=models.Q(products__order_items__order__is_paid=True))
    ).order_by('-units_sold')[:5]
    top_categories_data = [{"name": c.name, "value": c.units_sold or 0} for c in best_categories if c.units_sold and c.units_sold > 0]
    
    return Response({
        "metrics": {
            "total_vendors": total_vendors,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
        },
        "charts": {
            "top_vendors": top_vendors_data,
            "top_products": top_products_data,
            "top_categories": top_categories_data
        }
    }, status=status.HTTP_200_OK)
