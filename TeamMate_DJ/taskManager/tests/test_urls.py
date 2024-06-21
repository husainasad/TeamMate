from django.test import TestCase
from django.urls import reverse, resolve
from taskManager.views import (
    display_tasks, add_task, 
    task_details, update_task, delete_task
)

from django.test import TestCase
from django.urls import resolve, reverse

class URLTests(TestCase):

    def test_display_tasks(self):
        url = reverse('display_tasks')
        found = resolve(url)
        self.assertEqual(found.func, display_tasks)

    def test_add_task(self):
        url = reverse('add_task')
        found = resolve(url)
        self.assertEqual(found.func, add_task)

    def test_task_details(self):
        url = reverse('task_details', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, task_details)

    def test_update_task(self):
        url = reverse('update_task', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, update_task)

    def test_delete_task(self):
        url = reverse('delete_task', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, delete_task)