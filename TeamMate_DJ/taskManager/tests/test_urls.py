from django.test import TestCase, Client
from django.urls import reverse, resolve
from taskManager.models import Task, Tag
from taskManager.views import (
    display_hello, testing, display_tasks, add_task, 
    tasks_details, update_task, delete_task
)

class URLTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.task = Task.objects.create(
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

    def test_add_task(self):
        found = resolve('/tasks/add/')
        self.assertEqual(found.func, add_task)

    def test_task_details(self):
        found = resolve(f'/tasks/{self.task.id}')
        self.assertEqual(found.func, tasks_details)

    def test_update_task(self):
        found = resolve(f'/tasks/{self.task.id}/update')
        self.assertEqual(found.func, update_task)

    def test_delete_task(self):
        found = resolve(f'/tasks/{self.task.id}/delete')
        self.assertEqual(found.func, delete_task)