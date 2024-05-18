from django.urls import path
from . import views

urlpatterns = [
    path('', views.display_hello),
    path('testing', views.testing),
]