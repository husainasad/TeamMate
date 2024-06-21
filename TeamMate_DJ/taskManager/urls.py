from django.urls import path
from taskManager import views

urlpatterns = [
    path('tasks/', views.display_tasks, name='display_tasks'),
    path('tasks/add/', views.add_task, name='add_task'),
    path('tasks/<int:id>/', views.task_details, name='task_details'),
    path('tasks/<int:id>/update/', views.update_task, name='update_task'),
    path('tasks/<int:id>/delete/', views.delete_task, name='delete_task'),
]