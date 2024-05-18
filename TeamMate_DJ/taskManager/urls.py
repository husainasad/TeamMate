from django.urls import path
from . import views

urlpatterns = [
    path('', views.display_hello),
    path('testing', views.testing),
    path('tasks', views.display_tasks),
    path('addTask', views.add_task),
]