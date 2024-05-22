from django.urls import path
from . import views

urlpatterns = [
    path('', views.display_hello, name='default'),
    path('testing/', views.testing, name='testing'),
    path('tasks/', views.display_tasks, name='pending tasks'),
    path('tasks/new/', views.add_task, name='add task'),
    path('tasks/completed/', views.completed_tasks, name='completed tasks'),
    path('tasks/<int:id>', views.tasks_details, name='task details'),
    path('tasks/update/<int:id>', views.update_task, name='update task'),
]