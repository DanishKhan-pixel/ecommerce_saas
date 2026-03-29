from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'amount', 'reference', 'status', 'created_at')
        read_only_fields = ('id', 'amount', 'reference', 'status', 'created_at')
