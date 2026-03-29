from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Vendor
from .serializers import VendorDetailSerializer, VendorSerializer, VendorUpdateSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_vendor(request):
    """
    Authenticated user applies to become a vendor
    """
    if hasattr(request.user, 'vendor_profile'):
        return Response(
            {"error": "You have already applied or registered as a vendor."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = VendorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        # Assuming we don't automatically change user role to 'vendor' until admin approves.
        # But if we did want instant vendor access, we'd update request.user.role here.
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_vendors(request):
    """
    Get all approved vendors publicly
    """
    vendors = Vendor.objects.filter(is_approved=True).order_by('-created_at')
    serializer = VendorSerializer(vendors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_vendor(request, pk):
    """
    Get a specific vendor details
    """
    vendor = get_object_or_404(Vendor, pk=pk, is_approved=True)
    serializer = VendorDetailSerializer(vendor)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_store(request):
    """
    Get the authenticated user's store
    """
    if not hasattr(request.user, 'vendor_profile'):
        return Response(
            {"error": "You do not own a store."},
            status=status.HTTP_404_NOT_FOUND
        )
        
    serializer = VendorSerializer(request.user.vendor_profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_store(request):
    """
    Update the authenticated user's store
    """
    if not hasattr(request.user, 'vendor_profile'):
        return Response(
            {"error": "You do not own a store to update."},
            status=status.HTTP_404_NOT_FOUND
        )
        
    vendor = request.user.vendor_profile
    serializer = VendorUpdateSerializer(vendor, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        
        # update slug if store_name was updated
        if 'store_name' in request.data:
            from django.utils.text import slugify
            vendor.slug = slugify(serializer.validated_data.get('store_name', vendor.store_name))
            vendor.save(update_fields=['slug'])
            
        # Return full updated vendor data via standard serializer
        return Response(VendorSerializer(vendor).data, status=status.HTTP_200_OK)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_dashboard(request):
    """
    Get vendor dashboard summary data
    """
    if not hasattr(request.user, 'vendor_profile') or not request.user.vendor_profile.is_approved:
        return Response(
            {"error": "Only approved vendors can access the dashboard."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    vendor = request.user.vendor_profile
    
    from products.models import Product
    from orders.models import Order
    from django.db.models import Sum
    
    total_products = Product.objects.filter(vendor=vendor).count()
    total_orders = Order.objects.filter(vendor=vendor).count()
    pending_orders = Order.objects.filter(vendor=vendor, status='pending').count()
    processed_orders = Order.objects.filter(vendor=vendor, status__in=['processing', 'shipped', 'delivered']).count()
    
    earnings_agg = Order.objects.filter(vendor=vendor, is_paid=True).aggregate(Sum('total_price'))
    total_earnings = earnings_agg['total_price__sum'] or 0.00
    
    return Response({
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "processed_orders": processed_orders,
        "total_earnings": round(total_earnings, 2)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_featured_vendors(request):
    """
    Get all featured vendors publicly
    """
    vendors = Vendor.objects.filter(is_approved=True, featured=True).order_by('-created_at')
    serializer = VendorSerializer(vendors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_recent_orders(request):
    """
    Get vendor recent orders
    """
    if not hasattr(request.user, 'vendor_profile') or not request.user.vendor_profile.is_approved:
        return Response(
            {"error": "Only approved vendors can access the dashboard."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    vendor = request.user.vendor_profile
    
    from orders.models import Order
    from orders.serializers import OrderSerializer
    
    recent_orders = Order.objects.filter(vendor=vendor).order_by('-created_at')[:5]
    serializer = OrderSerializer(recent_orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) 