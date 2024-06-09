from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from taskManager.models import Task, Tag
from taskManager.forms import TaskForm
import datetime

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword'
        )

        self.other_user = get_user_model().objects.create_user(
            username='otheruser', 
            password='otherpassword'
        )

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
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('display_tasks')}")

    def test_display_tasks(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('display_tasks'))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'taskPage.html')
        self.assertIn('data', response.context)

        response = self.client.get(reverse('display_tasks'), {'status': 'completed'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('display_tasks'), {'status': 'pending'})
        self.assertEqual(response.status_code, 200)

    def test_add_task_get_unauthenticated(self):
        response = self.client.get(reverse('add_task'))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('add_task')}")

    def test_add_task_get(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('add_task'))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'add_task.html')
        self.assertIsInstance(response.context['form'], TaskForm)

    def test_add_task_post_unauthenticated(self):
        response = self.client.post(reverse('add_task'),{
            'owner':self.user,
            'title':'title1',
            'description':'description1',
            'due_date':datetime.date.today() + datetime.timedelta(days=1),
            'tags':'tag1, tag2, tag3',
            'priority':'Low',
            'progress':25
        })

        self.assertRedirects(response, f"{reverse('login')}?next={reverse('add_task')}")

    def test_add_task_post(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.post(reverse('add_task'),{
            'owner':self.user.id,
            'title':'title1',
            'description':'description1',
            'due_date':datetime.date.today() + datetime.timedelta(days=1),
            'tags':'tag1, tag2, tag3',
            'priority':'Low',
            'progress':25
        })

        self.assertEqual(response.status_code, 302)

        cur_task = Task.objects.get(title='title1')

        self.assertRedirects(response, reverse('task_details', args=[cur_task.id]))

        self.assertEqual(cur_task.progress, 25)
        self.assertEqual(cur_task.tags.count(), 3)
        self.assertTrue(Tag.objects.filter(name='tag1').exists())
        self.assertTrue(Tag.objects.filter(name='tag2').exists())
        self.assertTrue(Tag.objects.filter(name='tag3').exists())

    def test_task_details_unauthenticated(self):
        response = self.client.get(reverse('task_details', args=[self.task1.id]))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('task_details', args=[self.task1.id])}")

    def test_task_details(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('task_details', args=[self.task1.id]))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'task_details.html')
        self.assertEqual(response.context['data'], self.task1)

    def test_update_task_get_unauthenticated(self):
        response = self.client.get(reverse('update_task', args=[self.task1.id]))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('update_task', args=[self.task1.id])}")

    def test_update_task_get(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.get(reverse('update_task', args=[self.task1.id]))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'update_task.html')
        self.assertIsInstance(response.context['form'], TaskForm)

    def test_update_task_post_unauthenticated(self):
        response = self.client.post(reverse('update_task', args=[self.task1.id]),{
            'owner':self.user.id,
            'title':'newTitle',
            'description':'newDescription',
            'due_date':datetime.date.today() + datetime.timedelta(days=2),
            'tags':'sampleTag2, newTag1',
            'priority':'Medium',
            'progress':25
        })

        self.assertRedirects(response, f"{reverse('login')}?next={reverse('update_task', args=[self.task1.id])}")

    def test_update_task_post(self):
        self.client.login(username='testuser', password='testpassword')

        response = self.client.post(reverse('update_task', args=[self.task1.id]),{
            'owner':self.user.id,
            'title':'newTitle',
            'description':'newDescription',
            'due_date':datetime.date.today() + datetime.timedelta(days=2),
            'tags':'sampleTag2, newTag1',
            'priority':'Medium',
            'progress':25
        })

        self.assertEqual(response.status_code, 302)

        cur_task = Task.objects.get(title='newTitle')

        self.assertRedirects(response, reverse('task_details', args=[cur_task.id]))

        self.assertEqual(cur_task.title, 'newTitle')
        self.assertEqual(cur_task.description, 'newDescription')
        self.assertEqual(cur_task.due_date, datetime.date.today() + datetime.timedelta(days=2))
        self.assertEqual(cur_task.progress, 25)
        self.assertEqual(cur_task.tags.count(), 2)
        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())
        self.assertTrue(Tag.objects.filter(name='sampleTag2').exists())
        self.assertTrue(Tag.objects.filter(name='newTag1').exists())

    def test_only_owner_can_update_task(self):
        self.client.login(username='otheruser', password='otherpassword')

        response = self.client.post(reverse('update_task', args=[self.task1.id]), {
            'title': 'unauthorizedTitle',
            'description': 'unauthorizedDescription',
            'due_date': datetime.date.today() + datetime.timedelta(days=2),
            'tags': 'sampleTag2, newTag1',
            'priority': 'Medium',
            'progress': 25
        })

        self.assertEqual(response.status_code, 401)

    def test_delete_task_unauthenticated(self):
        response = self.client.get(reverse('delete_task', args=[self.task1.id]))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('delete_task', args=[self.task1.id])}")

    def test_delete_task(self):
        self.client.login(username='testuser', password='testpassword')

        dummy_task = Task.objects.create(
                        owner=self.user,
                        title="dummy title", 
                        description="dummy description",
                    )
        
        dummy_task.tags.add(self.tag1)

        response = self.client.post(reverse('delete_task', args=[self.task1.id]))

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('display_tasks'))

        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())

        self.assertTrue(Tag.objects.filter(name='sampleTag1').exists())

        response = self.client.post(reverse('delete_task', args=[dummy_task.id]))

        self.assertFalse(Task.objects.filter(id=dummy_task.id).exists())

        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())

    def test_only_owner_can_delete_task(self):
        self.client.login(username='otheruser', password='otherpassword')

        response = self.client.post(reverse('delete_task', args=[self.task1.id]))
        
        self.assertEqual(response.status_code, 401)