from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token

class AuthViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword',
            email='test@example.com'
        )

        self.token, _ = Token.objects.get_or_create(user=self.user)

    def test_user_signup(self):
        url = reverse('signup')
        data = {
            'username':'sampleUser',
            'email': 'sampleEmail@example.com',
            'password1':'samplePassword',
            'password2':'samplePassword'
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json().get('username'), 'sampleUser')
        self.assertIn('token', response.json())

    def test_user_signup_password_mismatch(self):
        url = reverse('signup')
        data = {
            'username':'sampleUser',
            'email': 'sampleEmail@example.com',
            'password1':'samplePassword1',
            'password2':'samplePassword2'
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password2', response.json())

    def test_user_signup_missing_fields(self):
        url = reverse('signup')
        data = {
            'username':'sampleUser',
            'email': 'sampleEmail@example.com'
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password1', response.json())
        self.assertIn('password2', response.json())

    def test_user_signup_duplicate_user(self):
        url = reverse('signup')
        data = {
            'username':'testuser',
            'email': 'sampleEmail@example.com',
            'password1':'samplePassword1',
            'password2':'samplePassword2'
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.json())

    def test_user_login(self):
        url = reverse('login')
        data = {
            'username':'testuser', 
            'password':'testpassword',
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('username'), 'testuser')
        self.assertIn('token', response.json())

    def test_user_login_missing_fields(self):
        url = reverse('login')
        data = {
            'username': 'testuser'
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.json())

    def test_user_login_invalid_credentials(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password':'wrongpassword',
        }

        response = self.client.post(url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.json())

    def test_user_logout(self):
        url = reverse('logout')
        # self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Token {self.token.key}'

        response = self.client.post(url, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    def test_user_logout_no_token(self):
        url = reverse('logout')

        response = self.client.post(url, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.json())

    def test_user_logout_invalid_token(self):
        url = reverse('logout')
        self.client.defaults['HTTP_AUTHORIZATION'] = 'Token invalidtoken'

        response = self.client.post(url, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.json())