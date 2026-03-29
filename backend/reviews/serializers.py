from rest_framework import serializers
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class ReviewSerializer(serializers.ModelSerializer):
    customer = CustomerReviewSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'customer', 'rating', 'comment', 'created_at']
        read_only_fields = ['product', 'customer']
