from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import Category
from .serializers import CategoryDetailSerializer, CategorySerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    """
    Get all categories publicly
    """
    categories = Category.objects.all().order_by('-created_at')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories_homepage(request):
    """
    Get all categories publicly
    """
    categories = Category.objects.all().order_by('-created_at')[:4]
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_category(request, pk):
    """
    Get a specific category
    """
    category = get_object_or_404(Category, pk=pk)
    serializer = CategoryDetailSerializer(category)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request):
    """
    Create a new category. Only Admin/staff can do this
    """
    # Assuming only admin or staff should create categories
    if request.user.role != 'admin' and not request.user.is_staff:
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_category(request, pk):
    """
    Update a specific category. Only Admin/staff can do this
    """
    if request.user.role != 'admin' and not request.user.is_staff:
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )

    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        
        # update slug if name was updated
        if 'name' in request.data:
            category.slug = slugify(serializer.validated_data.get('name', category.name))
            category.save(update_fields=['slug'])
            
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_category(request, pk):
    """
    Delete a specific category. Only Admin/staff can do this
    """
    if request.user.role != 'admin' and not request.user.is_staff:
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )

    category = get_object_or_404(Category, pk=pk)
    category.delete()
    return Response({"message": "Category deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
