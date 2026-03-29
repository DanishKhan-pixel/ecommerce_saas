from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'role': {'read_only': True}  # Role defaults to customer, cannot be set via standard registration yet 
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('email', ''),
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            # role defaults to 'customer' in the model
        )
        return user

from .models import ShippingAddress

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'user', 'full_name', 'phone', 'address_line', 'city', 'state', 'country', 'is_default', 'created_at']
        read_only_fields = ['user']
