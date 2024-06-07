from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class AuthViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword',
            email='test@example.com'
        )

    def test_login_page(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/login.html')

    def test_password_change_form_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(reverse('password_change'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/password_change_form.html')

    def test_password_change_done_page(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(reverse('password_change_done'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/password_change_done.html')
