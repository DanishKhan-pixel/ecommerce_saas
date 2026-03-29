from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from vendors.serializers import VendorSerializer
from accounts.models import ShippingAddress

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price', 'subtotal')

    def get_subtotal(self, obj):
        return obj.get_subtotal()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'vendor', 'status', 'is_paid', 'total_price', 'items', 'created_at')



class SimpleShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ('id', 'address_line', 'city', 'state', 'country', 'is_default', 'full_name', 'phone')



class VendorOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    vendor = VendorSerializer(read_only=True)
    customer_fullname = serializers.SerializerMethodField()
    customer_address = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ('id', 'vendor', 'status', 'is_paid', 'total_price', 'items', 'created_at', 'customer_fullname', 'customer_address')

    
    def get_customer_address(self, obj):
        address = ShippingAddress.objects.filter(user=obj.customer, is_default=True).first()
        serializer = SimpleShippingAddressSerializer(address)
        return serializer.data

    def get_customer_fullname(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"
        