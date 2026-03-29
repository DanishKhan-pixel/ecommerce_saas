from django.db import models
from django.conf import settings
from vendors.models import Vendor
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_paid = models.BooleanField(default=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Order #{self.id} by {self.customer.username} from {self.vendor.store_name}"

    def calculate_total(self):
        return sum(item.get_subtotal() for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot of price at order time

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Deleted Product'}"

    def get_subtotal(self):
        return self.price * self.quantity
