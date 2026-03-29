from django.urls import path
from . import admin_views

urlpatterns = [
    path('', admin_views.admin_list_vendors, name='admin_list_vendors'),
    path('<int:pk>/', admin_views.admin_get_vendor, name='admin_get_vendor'),
    path('<int:pk>/approve/', admin_views.admin_approve_vendor, name='admin_approve_vendor'),
    path('<int:pk>/reject/', admin_views.admin_reject_vendor, name='admin_reject_vendor'),
    path('<int:pk>/suspend/', admin_views.admin_suspend_vendor, name='admin_suspend_vendor'),
    path('<int:pk>/toggle-featured/', admin_views.admin_toggle_featured_vendor, name='admin_toggle_featured_vendor'),
]
