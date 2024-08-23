from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from taskManager.models import Task, Tag, TaskMember

class TaskManagerViewTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin', 
            password='adminpassword', 
            email='admin@example.com'
        )

        self.user1 = User.objects.create_user(
            username='user1', 
            password='password1', 
            email='user1@example.com'
        )

        self.user2 = User.objects.create_user(
            username='user2', 
            password='password2', 
            email='user2@example.com'
        )

        self.task = Task.objects.create(
            title="Test Task", 
            description="Test Description", 
            owner=self.user1
        )

        self.tag = Tag.objects.create(name="Test Tag")
        self.task.tags.add(self.tag)
        self.task_member = TaskMember.objects.create(task=self.task, user=self.user1, is_owner=True)

    def test_health_check(self):
        url = reverse('health_check')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'status': 'ok', 'message': 'Service is healthy'})

    def test_admin_can_get_all_tasks(self):
        self.client.force_authenticate(user=self.admin_user)

        url = reverse('get_all_tasks')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Task.objects.count())

    def test_non_admin_cannot_get_all_tasks(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('get_all_tasks')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_task_by_id(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('get_task_by_id', args=[self.task.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.task.title)

    def test_get_task_by_id_not_found(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('get_task_by_id', args=[999])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_new_task(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('add_new_task')
        data = {
            'title': 'New Task', 
            'description': 'New Task Description', 
            'tags': ['New Tag']
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_add_new_task_invalid_data(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('add_new_task')
        data = {
            'description': 'No Title'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_task_by_id(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('update_task_by_id', args=[self.task.id])
        data = {
            'title': 'Updated Task'
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Task')

    def test_update_task_by_id_as_member(self):
        self.client.force_authenticate(user=self.user2)

        TaskMember.objects.create(task=self.task, user=self.user2)
        url = reverse('update_task_by_id', args=[self.task.id])
        data = {
            'title': 'Member Update'
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Member Update')

    def test_update_task_by_id_no_permission(self):
        self.client.force_authenticate(user=self.user2)

        url = reverse('update_task_by_id', args=[self.task.id])
        data = {
            'title': 'Unauthorized Update'
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_task_by_id(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('delete_task_by_id', args=[self.task.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

    def test_delete_task_by_id_as_member(self):
        self.client.force_authenticate(user=self.user2)

        TaskMember.objects.create(task=self.task, user=self.user2)
        url = reverse('delete_task_by_id', args=[self.task.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_task_by_id_no_permission(self):
        self.client.force_authenticate(user=self.user2)

        url = reverse('delete_task_by_id', args=[self.task.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_user_to_task(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('add_user_to_task', args=[self.task.id])
        data = {
            'username': 'user2'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TaskMember.objects.filter(task=self.task, user=self.user2).count(), 1)

    def test_add_user_to_task_no_permission(self):
        self.client.force_authenticate(user=self.user2)

        url = reverse('add_user_to_task', args=[self.task.id])
        data = {'username': 'user2'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_user_from_task(self):
        self.client.force_authenticate(user=self.user1)

        TaskMember.objects.create(task=self.task, user=self.user2)

        url = reverse('remove_user_from_task', args=[self.task.id])
        data = {'username': 'user2'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TaskMember.objects.filter(task=self.task, user=self.user2).count(), 0)

    def test_remove_user_from_task_no_permission(self):
        self.client.force_authenticate(user=self.user2)

        url = reverse('remove_user_from_task', args=[self.task.id])
        data = {'username': 'admin'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_owner_from_task(self):
        self.client.force_authenticate(user=self.user2)

        TaskMember.objects.create(task=self.task, user=self.user2)

        url = reverse('remove_user_from_task', args=[self.task.id])
        data = {'username': 'user1'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_owner_from_task_as_owner(self):
        self.client.force_authenticate(user=self.user1)

        url = reverse('remove_user_from_task', args=[self.task.id])
        data = {'username': 'user1'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_self_from_task(self):
        self.client.force_authenticate(user=self.user2)

        TaskMember.objects.create(task=self.task, user=self.user2)

        url = reverse('remove_user_from_task', args=[self.task.id])
        data = {'username': 'user2'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)