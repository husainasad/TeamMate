from django.urls import path
from . import views

urlpatterns = [
    path('', views.display_hello, name='default'),
    path('testing/', views.testing, name='testing'),
    path('tasks/', views.display_tasks, name='pending tasks'),
    path('addTask/', views.add_task, name='add task'),
    path('completedTasks/', views.completed_tasks, name='completed tasks'),
    path('taskDetails/<int:id>', views.tasks_details, name='task details'),
]