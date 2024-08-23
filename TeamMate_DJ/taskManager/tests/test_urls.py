from django.test import TestCase
from django.urls import reverse, resolve
from taskManager.views import (
    health_check, 
    get_all_tasks, get_task_by_id, add_new_task, update_task_by_id, delete_task_by_id, 
    add_user_to_task, remove_user_from_task
)

from django.test import TestCase
from django.urls import resolve, reverse

class URLTests(TestCase):

    def test_health_check(self):
        url = reverse('health_check')
        found = resolve(url)
        self.assertEqual(found.func, health_check)

    def test_get_all_tasks(self):
        url = reverse('get_all_tasks')
        found = resolve(url)
        self.assertEqual(found.func, get_all_tasks)

    def test_add_new_task(self):
        url = reverse('add_new_task')
        found = resolve(url)
        self.assertEqual(found.func, add_new_task)

    def test_get_task_by_id(self):
        url = reverse('get_task_by_id', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, get_task_by_id)

    def test_update_task_by_id(self):
        url = reverse('update_task_by_id', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, update_task_by_id)

    def test_delete_task_by_id(self):
        url = reverse('delete_task_by_id', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, delete_task_by_id)
    
    def test_add_user_to_task(self):
        url = reverse('add_user_to_task', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, add_user_to_task)

    def test_remove_user_from_task(self):
        url = reverse('remove_user_from_task', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, remove_user_from_task)