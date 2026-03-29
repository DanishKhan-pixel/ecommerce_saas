from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/update/', views.update_review, name='update_review'),
    path('<int:pk>/delete/', views.delete_review, name='delete_review'),
]
