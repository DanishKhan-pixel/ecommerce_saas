from django.urls import path
from . import address_views

urlpatterns = [
    path('', address_views.list_addresses, name='list_addresses'),
    path('create/', address_views.create_address, name='create_address'),
    path('<int:pk>/update/', address_views.update_address, name='update_address'),
    path('<int:pk>/delete/', address_views.delete_address, name='delete_address'),
    path('<int:pk>/get/', address_views.get_address, name='get_address'),
]
