from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'category', 'price', 'stock', 'is_available')
    list_filter = ('is_available', 'category', 'vendor')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
