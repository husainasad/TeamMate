from django.test import TestCase
from django.urls import resolve, reverse
from userManager.views import (
    user_login, user_logout, user_signup
)

class URLTests(TestCase):

    def test_login(self):
        url = reverse('login')
        found = resolve(url)
        self.assertEqual(found.func, user_login)

    def test_logout(self):
        url = reverse('logout')
        found = resolve(url)
        self.assertEqual(found.func, user_logout)

    def test_signup(self):
        url = reverse('signup')
        found = resolve(url)
        self.assertEqual(found.func, user_signup)