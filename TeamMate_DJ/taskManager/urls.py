from django.urls import path
from . import views

urlpatterns = [
    path('', views.display_hello, name='default'),
    path('testing/', views.testing, name='testing'),
    path('tasks/', views.display_tasks, name='tasks_list'),
    path('tasks/add/', views.add_task, name='add_task'),
    path('completed-tasks/', views.completed_tasks, name='completed_tasks'),
    path('tasks/<int:id>', views.tasks_details, name='task_details'),
    path('tasks/<int:id>/update', views.update_task, name='update_task'),
    path('tasks/<int:id>/delete', views.delete_task, name='delete_task'),
]