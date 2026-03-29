from django.urls import path
from . import views


urlpatterns = [
    path('', views.list_vendors, name='list_vendors'),
    path('apply/', views.apply_vendor, name='apply_vendor'),
    path('my-store/', views.my_store, name='my_store'),
    path('my-store/update/', views.update_store, name='update_store'),
    path('<int:pk>/', views.get_vendor, name='get_vendor'),
    path('dashboard/', views.vendor_dashboard, name='vendor_dashboard'),
    path('dashboard/recent-orders/', views.vendor_recent_orders, name='vendor_recent_orders'),
    path('featured/', views.list_featured_vendors, name='list_featured_vendors'),
]
