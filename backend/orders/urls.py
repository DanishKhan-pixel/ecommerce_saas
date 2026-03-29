from django.urls import path
from . import views

# Customer order URLs: /api/orders/
customer_urlpatterns = [
    path('', views.list_orders, name='list_orders'),
    path('create/', views.create_order, name='create_order'),
    path('<int:pk>/', views.get_order, name='get_order'),
]

# Vendor order URLs: /api/vendor/orders/
vendor_urlpatterns = [
    path('', views.vendor_list_orders, name='vendor_list_orders'),
    path('<int:pk>/', views.vendor_get_order, name='vendor_get_order'),
    path('<int:pk>/update-status/', views.vendor_update_order_status, name='vendor_update_order_status'),
]
