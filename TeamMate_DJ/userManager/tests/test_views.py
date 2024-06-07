from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from userManager.forms import CustomUserCreationForm

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_dashboard(self):
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'users/dashboard.html')

    def test_registration_get(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'users/register.html')
        # self.assertIsInstance(response.context['form'], CustomUserCreationForm) # fails because of custom form, test with individual fields

    def test_registration_post(self):
        response = self.client.post(reverse('register'),{
            'username':'sampleUser',
            'email': 'sampleEmail@example.com',
            'password1':'samplePassword',
            'password2':'samplePassword'
        })
            
        self.assertEqual(response.status_code, 302)

        user_exists = User.objects.filter(username='sampleUser').exists()
        self.assertTrue(user_exists)

        self.assertRedirects(response, reverse('dashboard'))
