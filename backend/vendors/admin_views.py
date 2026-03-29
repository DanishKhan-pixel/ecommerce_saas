from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from accounts.permissions import IsAdminUser
from .models import Vendor
from .serializers import VendorSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_vendors(request):
    """
    List all vendors (approved and unapproved).
    """
    search = request.query_params.get('search', '')
    vendors = Vendor.objects.all().order_by('-created_at')

    if search:
        vendors = vendors.filter(store_name__icontains=search)
    
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(vendors, request)
    
    serializer = VendorSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_vendor(request, pk):
    """
    Get details of a specific vendor.
    """
    vendor = get_object_or_404(Vendor, pk=pk)
    serializer = VendorSerializer(vendor)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_approve_vendor(request, pk):
    """
    Approve a vendor.
    """
    vendor = get_object_or_404(Vendor, pk=pk)
    if vendor.is_approved:
        return Response({"message": "Vendor is already approved."}, status=status.HTTP_200_OK)
        
    vendor.is_approved = True
    vendor.save(update_fields=['is_approved'])
    
    # Optionally update the user's role to vendor if not already
    if vendor.user.role != 'vendor':
        vendor.user.role = 'vendor'
        vendor.user.save(update_fields=['role'])
        
    return Response({"message": "Vendor approved successfully."}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_reject_vendor(request, pk):
    """
    Reject a vendor application.
    """
    vendor = get_object_or_404(Vendor, pk=pk)
    if not vendor.is_approved:
        return Response({"message": "Vendor is already not approved."}, status=status.HTTP_200_OK)
        
    vendor.is_approved = False
    vendor.save(update_fields=['is_approved'])
    return Response({"message": "Vendor rejected successfully."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_suspend_vendor(request, pk):
    """
    Suspend an existing vendor.
    """
    vendor = get_object_or_404(Vendor, pk=pk)
    if not vendor.is_approved:
        return Response({"message": "Vendor is already suspended or not approved."}, status=status.HTTP_200_OK)
        
    vendor.is_approved = False
    vendor.save(update_fields=['is_approved'])
    return Response({"message": "Vendor suspended successfully."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_toggle_featured_vendor(request, pk):
    """
    Toggle a vendor's featured status.
    """
    vendor = get_object_or_404(Vendor, pk=pk)
    vendor.featured = not vendor.featured
    vendor.save(update_fields=['featured'])
    return Response(
        {
            "message": f"Vendor {'featured' if vendor.featured else 'unfeatured'} successfully.",
            "id": vendor.id,
            "featured": vendor.featured,
        },
        status=status.HTTP_200_OK,
    )
