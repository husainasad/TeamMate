from django.test import TestCase, Client
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from taskManager.models import Task, Tag
from taskManager.views import (
    display_hello, testing, display_tasks, add_task, 
    task_details, update_task, delete_task
)

class URLTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword'
        )
        self.task = Task.objects.create(
            owner=self.user,
            title="Sample Task", 
            description="Sample Description",
        )

    def test_display_tasks(self):
        found = resolve('/')
        self.assertEqual(found.func, display_hello)

    def test_testing(self):
        found = resolve('/testing/')
        self.assertEqual(found.func, testing)

    def test_display_tasks(self):
        found = resolve('/tasks/')
        self.assertEqual(found.func, display_tasks)

    def test_reverse_display_tasks(self):
        url = reverse('display_tasks')
        self.assertEqual(url, '/tasks/')

    def test_add_task(self):
        found = resolve('/tasks/add/')
        self.assertEqual(found.func, add_task)

    def test_reverse_add_task(self):
        url = reverse('add_task')
        self.assertEqual(url, '/tasks/add/')

    def test_task_details(self):
        found = resolve(f'/tasks/{self.task.id}/')
        self.assertEqual(found.func, task_details)

    def test_reverse_task_details(self):
        url = reverse('task_details', args=[self.task.id])
        self.assertEqual(url, f'/tasks/{self.task.id}/')

    def test_update_task(self):
        found = resolve(f'/tasks/{self.task.id}/update/')
        self.assertEqual(found.func, update_task)

    def test_reverse_update_task(self):
        url = reverse('update_task', args=[self.task.id])
        self.assertEqual(url, f'/tasks/{self.task.id}/update/')

    def test_delete_task(self):
        found = resolve(f'/tasks/{self.task.id}/delete/')
        self.assertEqual(found.func, delete_task)

    def test_reverse_delete_task(self):
        url = reverse('delete_task', args=[self.task.id])
        self.assertEqual(url, f'/tasks/{self.task.id}/delete/')