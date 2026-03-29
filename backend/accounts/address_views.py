from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import ShippingAddress
from .serializers import ShippingAddressSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_addresses(request):
    """
    List all shipping addresses for the authenticated user.
    """
    addresses = ShippingAddress.objects.filter(user=request.user).order_by('-is_default', '-created_at')
    serializer = ShippingAddressSerializer(addresses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_address(request):
    """
    Create a new shipping address.
    """
    serializer = ShippingAddressSerializer(data=request.data)
    if serializer.is_valid():
        # If this is the user's first address, make it default automatically
        if not ShippingAddress.objects.filter(user=request.user).exists():
            serializer.validated_data['is_default'] = True
            
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_address(request, pk):

    address = get_object_or_404(ShippingAddress, pk=pk, user=request.user)
    serializer = ShippingAddressSerializer(address)
    return Response(serializer.data, status=status.HTTP_200_OK) 
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_address(request, pk):
    """
    Update an existing shipping address.
    """
    address = get_object_or_404(ShippingAddress, pk=pk, user=request.user)
    serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request, pk):
    """
    Delete a shipping address.
    """
    address = get_object_or_404(ShippingAddress, pk=pk, user=request.user)
    address.delete()
    return Response({"message": "Address deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
