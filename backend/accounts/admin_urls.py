from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
    path('manage-users/', views.manage_users, name='manage_users'),
]
