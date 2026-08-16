from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cart, name='get_cart'),
    path('add/', views.add_to_cart, name='add_to_cart'),
    path('items/<int:pk>/update/', views.update_cart_item, name='update_cart_item'),
    path('items/<int:pk>/delete/', views.delete_cart_item, name='delete_cart_item'),
    path('clear/', views.clear_cart, name='clear_cart'),
    path('merge/', views.merge_cart, name='merge_cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/success/', views.checkout_success, name='checkout_success'),
    path('checkout/failed/', views.checkout_failed, name='checkout_failed'),
    path('checkout/pending/', views.checkout_pending, name='checkout_pending'),
]
