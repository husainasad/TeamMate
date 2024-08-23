from django.urls import path
from taskManager import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('tasks/member/', views.get_tasks_as_member, name='get_tasks_as_member'),
    path('tasks/add/', views.add_new_task, name='add_new_task'),
    path('tasks/<int:task_id>/', views.get_task_by_id, name='get_task_by_id'),
    path('tasks/<int:task_id>/update/', views.update_task_by_id, name='update_task_by_id'),
    path('tasks/<int:task_id>/delete/', views.delete_task_by_id, name='delete_task_by_id'),
    path('tasks/<int:task_id>/addMember/', views.add_user_to_task, name='add_user_to_task'),
    path('tasks/<int:task_id>/removeMember/', views.remove_user_from_task, name='remove_user_from_task'),
]