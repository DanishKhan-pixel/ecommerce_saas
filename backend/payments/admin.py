from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'user', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('reference', 'user__email')
    readonly_fields = ('paystack_response',)
