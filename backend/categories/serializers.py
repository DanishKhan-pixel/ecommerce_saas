from rest_framework import serializers
from .models import Category
from products.models import Product

class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'price', 'image')   




class CategoryDetailSerializer(serializers.ModelSerializer):
    products = SimpleProductSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'products', 'product_count', 'created_at')
        read_only_fields = ('id', 'slug', 'created_at')


    def get_product_count(self, obj):
        return obj.products.count()



class CategorySerializer(serializers.ModelSerializer):
    
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'product_count', 'created_at')
        read_only_fields = ('id', 'slug', 'created_at')
    
    def get_product_count(self, obj):
        return obj.products.count()



