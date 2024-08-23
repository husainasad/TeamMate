from django.test import TestCase
from django.urls import resolve, reverse
from userManager.views import (
    user_list, user_detail, register_user
)

class URLTests(TestCase):

    def test_user_list(self):
        url = reverse('user_list')
        found = resolve(url)
        self.assertEqual(found.func, user_list)

    def test_user_detail(self):
        url = reverse('user_detail', args=[1])
        found = resolve(url)
        self.assertEqual(found.func, user_detail)

    def test_user_registration(self):
        url = reverse('register_user')
        found = resolve(url)
        self.assertEqual(found.func, register_user)