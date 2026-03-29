from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
]
