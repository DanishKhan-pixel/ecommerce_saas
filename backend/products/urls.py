from django.urls import path
from . import views
from reviews import views as review_views

# Public product URLs: /api/products/
public_urlpatterns = [
    path('', views.list_products, name='list_products'),
    path('search/', views.search_products, name='search_products'),
    path('<str:slug>/', views.get_product, name='get_product'),
    path('<int:product_id>/reviews/', review_views.list_product_reviews, name='list_product_reviews'),
    path('<int:product_id>/reviews/create/', review_views.create_review, name='create_review'),
]

homepage_urlpatterns = [
    path('featured/', views.list_featured_products, name='list_featured_products'),
    path('new-arrivals/', views.list_new_arrivals, name='list_new_arrivals'),
]

# Vendor product URLs: /api/vendor/products/
vendor_urlpatterns = [
    path('', views.list_vendor_products, name='list_vendor_products'),
    path('create/', views.create_product, name='create_product'),
    path('generate-description/', views.generate_description, name='generate_description'),
    path('<int:pk>/update/', views.update_product, name='update_product'),
    path('<int:pk>/delete/', views.delete_product, name='delete_product'),
    path('categories/', views.list_categories, name='list_categories'),
   
]


# Admin product URLs: /api/admin/products/
admin_urlpatterns = [
    path('', views.admin_list_products, name='admin_list_products'),
    path('<int:pk>/toggle-featured/', views.admin_toggle_featured, name='admin_toggle_featured'),
]