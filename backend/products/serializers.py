from rest_framework import serializers
from .models import Product
from vendors.serializers import VendorSerializer
from categories.serializers import CategorySerializer

class ProductSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'vendor', 'category', 'name', 'slug',
            'description', 'price', 'stock', 'image', 'featured',
            'is_available', 'created_at'
        )
        read_only_fields = ('id', 'slug', 'created_at', 'vendor')



class ProductDetailSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    similar_products = serializers.SerializerMethodField()
    

    class Meta:
        model = Product
        fields = (
            'id', 'vendor', 'category', 'name', 'slug',
            'description', 'price', 'stock', 'image', 'featured', 'similar_products',
            'is_available', 'created_at'
        )
        read_only_fields = ('id', 'slug', 'created_at', 'vendor')
    
    def get_similar_products(self, obj):
        return ProductSerializer(Product.objects.filter(category=obj.category).exclude(id=obj.id)[:4], many=True).data  



class ProductWriteSerializer(serializers.ModelSerializer):
    """Used for creating and updating products (write operations)."""
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'description', 'price',
            'stock', 'image', 'is_available', 'category_id'
        )
