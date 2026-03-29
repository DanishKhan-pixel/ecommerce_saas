from products.models import Product
from rest_framework import serializers
from .models import Vendor
from accounts.serializers import UserSerializer


class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'price', 'image')




class VendorDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    products = SimpleProductSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Vendor
        fields = ('id', 'user', 'store_name', 'slug', 'description', 'banner', 'location', 'is_approved', 'featured', 'created_at', 'product_count', 'products')
        read_only_fields = ('is_approved', 'slug')
    
    def get_product_count(self, obj):
        return obj.products.count()


class VendorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Vendor
        fields = ('id', 'user', 'store_name', 'slug', 'description', 'banner', 'location', 'is_approved', 'featured', 'product_count', 'created_at')
        read_only_fields = ('is_approved', 'slug')
    
    def get_product_count(self, obj):
        return obj.products.count()
    

        
class VendorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ('store_name', 'description', 'banner', 'location')
