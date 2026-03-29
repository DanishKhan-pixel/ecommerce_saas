from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from products.urls import homepage_urlpatterns, public_urlpatterns, admin_urlpatterns, vendor_urlpatterns as product_vendor_urlpatterns
from orders.urls import customer_urlpatterns as order_customer_urlpatterns, vendor_urlpatterns as order_vendor_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/addresses/', include('accounts.address_urls')),
    path('api/admin/', include('accounts.admin_urls')),
    path('api/admin/vendors/', include('vendors.admin_urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/products/', include((public_urlpatterns, 'products'))),
    path('api/homepage/products/', include((homepage_urlpatterns, 'homepage_products'))),
    path('api/vendor/products/', include((product_vendor_urlpatterns, 'vendor_products'))),
    path('api/admin/products/', include((admin_urlpatterns, 'admin_products'))),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include((order_customer_urlpatterns, 'orders'))),
    path('api/vendor/orders/', include((order_vendor_urlpatterns, 'vendor_orders'))),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
