from django.test import TestCase
from django.urls import resolve, reverse
from userManager.views import (
    dashboard, register
)

class URLTests(TestCase):

    def test_display_dashboard(self):
        found = resolve('/')
        self.assertEqual(found.func, dashboard)

    def test_reverse_display_dashboard(self):
        url = reverse('dashboard')
        self.assertEqual(url, '/')

    def test_registration(self):
        found = resolve('/register/')
        self.assertEqual(found.func, register)

    def test_reverse_registration(self):
        url = reverse('register')
        self.assertEqual(url, '/register/')