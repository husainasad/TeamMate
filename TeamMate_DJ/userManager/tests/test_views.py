from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient

class ViewTests(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin', 
            password='adminpassword', 
            email='admin@example.com'
        )

        self.non_admin_user1 = User.objects.create_user(
            username='testuser1', 
            password='testpassword1', 
            email='test1@example.com'
        )

        self.non_admin_user2 = User.objects.create_user(
            username='testuser2', 
            password='testpassword2', 
            email='test2@example.com'
        )

        self.client = APIClient()

    def test_admin_can_access_user_list(self):
        self.client.force_authenticate(user=self.admin_user)

        url = reverse('user_list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), User.objects.count())

    def test_non_admin_cannot_access_user_list(self):
        self.client.force_authenticate(user=self.non_admin_user1)

        url = reverse('user_list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_access_user_detail(self):
        self.client.force_authenticate(user=self.admin_user)

        url = reverse('user_detail', args=[self.non_admin_user1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.non_admin_user1.username)

    def test_non_admin_cannot_access_other_user_detail(self):
        self.client.force_authenticate(user=self.non_admin_user1)

        url = reverse('user_detail', args=[self.non_admin_user2.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_register_user_with_valid_data(self):
        user_data = {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'newuser@example.com'
        }

        url = reverse('register_user')
        response = self.client.post(url, data=user_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], user_data['username'])

    def test_register_user_with_invalid_data(self):
        user_data = {
            'username': '',
            'password': 'newpassword',
            'email': 'newuser@example.com'
        }

        url = reverse('register_user')
        response = self.client.post(url, data=user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)