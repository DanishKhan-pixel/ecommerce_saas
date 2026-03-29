from django.db import models
from django.conf import settings
from products.models import Product

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart', null=True, blank=True)
    session_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return f"Cart of {self.user.username}"
        return f"Guest Cart {self.session_id}"

    def get_total(self):
        return sum(item.get_subtotal() for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def get_subtotal(self):
        return self.product.price * self.quantity
