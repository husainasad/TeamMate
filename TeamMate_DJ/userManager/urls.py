from django.urls import path
from userManager import views

urlpatterns = [
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('signup/', views.user_signup, name='signup'),
    path('dashboard/', views.dashboard, name='dashboard'),
]