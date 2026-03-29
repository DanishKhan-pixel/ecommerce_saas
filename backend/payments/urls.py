from django.urls import path
from . import views

urlpatterns = [
    path('initialize/', views.initialize_payment, name='initialize_payment'),
    path('verify/', views.verify_payment, name='verify_payment'),
    path('webhook/', views.payment_webhook, name='payment_webhook'),
    path('history/', views.payment_history, name='payment_history'),
]
