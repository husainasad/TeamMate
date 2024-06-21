from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from taskManager.models import Task, Tag
import datetime
from rest_framework import status
from rest_framework.authtoken.models import Token

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword'
        )

        self.token = Token.objects.create(user=self.user)
        self.auth_header = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        self.other_user = get_user_model().objects.create_user(
            username='otheruser', 
            password='otherpassword'
        )

        self.other_token = Token.objects.create(user=self.other_user)
        self.other_auth_header = {'HTTP_AUTHORIZATION': f'Token {self.other_token.key}'}

        self.task1 = Task.objects.create(
            owner = self.user,
            title="sampleTitle1", 
            description="sampleDescription1",
        )

        self.task2 = Task.objects.create(
            owner=self.user,
            title="sampleTitle2", 
            description="sampleDescription2",
            progress=100,
        )

        self.other_user_task = Task.objects.create(
            owner=self.other_user,
            title="otherUserTask",
            description="other user task description"
        )

        self.tag1 = Tag.objects.create(name="sampleTag1")
        self.tag2 = Tag.objects.create(name="sampleTag2")

        self.task1.tags.add(self.tag1)
        self.task2.tags.add(self.tag2)
    
    def test_display_tasks_unauthenticated(self):
        response = self.client.get(reverse('display_tasks'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_display_tasks(self):
        response = self.client.get(reverse('display_tasks'), **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_data = response.json()
        self.assertEqual(response_data['username'], 'testuser')
        self.assertEqual(len(response_data['tasks']), 2)

        response = self.client.get(reverse('display_tasks'), {'status': 'completed'}, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = response.json()
        self.assertEqual(len(response_data['tasks']), 1)

        response = self.client.get(reverse('display_tasks'), {'status': 'pending'}, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_data = response.json()
        self.assertEqual(len(response_data['tasks']), 1)

    def test_add_task_unauthenticated(self):
        response = self.client.post(reverse('add_task'), {
            'title': 'title1',
            'description': 'description1',
            'due_date': datetime.date.today() + datetime.timedelta(days=1),
            'tags': 'tag1, tag2, tag3',
            'priority': 'Low',
            'progress': 25
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_task(self):
        response = self.client.post(reverse('add_task'), {
            'title': 'title1',
            'description': 'description1',
            'due_date': datetime.date.today() + datetime.timedelta(days=1),
            'tags': 'tag1, tag2, tag3',
            'priority': 'Low',
            'progress': 25
        }, **self.auth_header)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response_data = response.json()
        self.assertEqual(response_data['title'], 'title1')
        self.assertEqual(response_data['progress'], 25)
        self.assertEqual(len(response_data['tags']), 3)
        self.assertTrue(Tag.objects.filter(name='tag1').exists())
        self.assertTrue(Tag.objects.filter(name='tag2').exists())
        self.assertTrue(Tag.objects.filter(name='tag3').exists())

    def test_task_details_unauthenticated(self):
        response = self.client.get(reverse('task_details', args=[self.task1.id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_task_details(self):
        response = self.client.get(reverse('task_details', args=[self.task1.id]), **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response_data = response.json()
        self.assertEqual(response_data['title'], self.task1.title)
        self.assertEqual(response_data['description'], self.task1.description)

    def test_update_task_get_unauthenticated(self):
        response = self.client.put(reverse('update_task', args=[self.task1.id]), {
            'title': 'newTitle',
            'description': 'newDescription',
            'due_date': datetime.date.today() + datetime.timedelta(days=2),
            'tags': 'sampleTag2, newTag1',
            'priority': 'Medium',
            'progress': 25
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_task(self):
        response = self.client.put(reverse('update_task', args=[self.task1.id]), {
            'title': 'newTitle',
            'description': 'newDescription',
            'due_date': datetime.date.today() + datetime.timedelta(days=2),
            'tags': 'sampleTag2, newTag1',
            'priority': 'Medium',
            'progress': 25
        }, **self.auth_header, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        cur_task = Task.objects.get(id=self.task1.id)
        self.assertEqual(cur_task.title, 'newTitle')
        self.assertEqual(cur_task.description, 'newDescription')
        self.assertEqual(cur_task.due_date, datetime.date.today() + datetime.timedelta(days=2))
        self.assertEqual(cur_task.progress, 25)
        self.assertEqual(cur_task.tags.count(), 2)
        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())
        self.assertTrue(Tag.objects.filter(name='sampleTag2').exists())
        self.assertTrue(Tag.objects.filter(name='newTag1').exists())

    def test_only_owner_can_update_task(self):
        response = self.client.put(reverse('update_task', args=[self.task1.id]), {
            'title': 'unauthorizedTitle',
            'description': 'unauthorizedDescription',
            'due_date': datetime.date.today() + datetime.timedelta(days=2),
            'tags': 'sampleTag2, newTag1',
            'priority': 'Medium',
            'progress': 25
        }, **self.other_auth_header, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_task_unauthenticated(self):
        response = self.client.delete(reverse('delete_task', args=[self.task1.id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_task(self):
        temp_task = Task.objects.create(
            owner=self.user,
            title="temp title", 
            description="temp description",
        )
        
        temp_task.tags.add(self.tag1)

        response = self.client.delete(reverse('delete_task', args=[self.task1.id]), **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())
        self.assertTrue(Tag.objects.filter(name='sampleTag1').exists())

        response = self.client.delete(reverse('delete_task', args=[temp_task.id]), **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=temp_task.id).exists())
        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())

    def test_only_owner_can_delete_task(self):
        response = self.client.delete(reverse('delete_task', args=[self.task1.id]), **self.other_auth_header)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)