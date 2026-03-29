from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from products.models import Product
from orders.models import OrderItem

@api_view(['GET'])
@permission_classes([AllowAny])
def list_product_reviews(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    reviews = Review.objects.filter(product=product).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user = request.user
    
    # Check if user has already reviewed this product
    if Review.objects.filter(product=product, customer=user).exists():
        return Response(
            {"error": "You have already reviewed this product."},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    # Check if user has purchased this product and the order is paid
    has_purchased = OrderItem.objects.filter(
        order__customer=user,
        product=product,
        order__is_paid=True
    ).exists()
    
    if not has_purchased:
        return Response(
            {"error": "You can only review products you have purchased."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(product=product, customer=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_review(request, pk):
    review = get_object_or_404(Review, pk=pk)
    
    if review.customer != request.user:
        return Response(
            {"error": "You can only update your own reviews."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    serializer = ReviewSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, pk):
    review = get_object_or_404(Review, pk=pk)
    
    if review.customer != request.user:
        return Response(
            {"error": "You can only delete your own reviews."},
            status=status.HTTP_403_FORBIDDEN
        )
        
    review.delete()
    return Response(
        {"message": "Review deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )
