from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Vendor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_profile')
    store_name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    banner = models.ImageField(upload_to='vendor_banners/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.store_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.store_name
