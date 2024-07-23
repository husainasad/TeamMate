from django.urls import path
from userManager import views

urlpatterns = [
    path('users/', views.user_list, name='user_list'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
    path('register/', views.register_user, name='register_user'),
]