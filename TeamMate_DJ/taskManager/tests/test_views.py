from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from taskManager.models import Task, Tag
from taskManager.forms import TaskForm
import datetime

class ViewTests(TestCase):
    def setUp(self):
        # Create view client
        self.client = Client()
        
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create sample tasks
        self.task1 = Task.objects.create(
            title="sampleTitle1", 
            description="sampleDescription1",
        )

        self.task2 = Task.objects.create(
            title="sampleTitle2", 
            description="sampleDescription2",
            progress=100,
        )

        # Create sample tags
        self.tag1 = Tag.objects.create(name="sampleTag1")
        self.tag2 = Tag.objects.create(name="sampleTag2")

        # Add tags to tasks
        self.task1.tags.add(self.tag1)
        self.task2.tags.add(self.tag2)
    
    def test_display_tasks_unauthenticated(self):
        response = self.client.get(reverse('display_tasks'))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('display_tasks')}")

    def test_display_tasks(self):
        # Simulate log in
        self.client.login(username='testuser', password='testpassword')

        # Display tasks page
        response = self.client.get(reverse('display_tasks'))

        # Check if request is successful, template is correct and data is correct
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'taskPage.html')
        self.assertIn('data', response.context)

        # Check filtered data
        response = self.client.get(reverse('display_tasks'), {'status': 'completed'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('display_tasks'), {'status': 'pending'})
        self.assertEqual(response.status_code, 200)

    def test_add_task_get_unauthenticated(self):
        response = self.client.get(reverse('add_task'))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('add_task')}")

    def test_add_task_get(self):
        self.client.login(username='testuser', password='testpassword')

        # Display add task page
        response = self.client.get(reverse('add_task'))
        
        # Check if request is successful, template is correct and TaskForm is displayed
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'add_task.html')
        self.assertIsInstance(response.context['form'], TaskForm)

    def test_add_task_post_unauthenticated(self):
        response = self.client.post(reverse('add_task'),{
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

        # Add new task
        response = self.client.post(reverse('add_task'),{
            'title':'title1',
            'description':'description1',
            'due_date':datetime.date.today() + datetime.timedelta(days=1),
            'tags':'tag1, tag2, tag3',
            'priority':'Low',
            'progress':25
        })

        # Check if the response is a redirect
        self.assertEqual(response.status_code, 302)
        
        # Get current task from database
        cur_task = Task.objects.get(title='title1')

        # Check if the redirect URL is correct
        self.assertRedirects(response, reverse('task_details', args=[cur_task.id]))

        # Verify the task and tags were created correctly
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

        # Display task details
        response = self.client.get(reverse('task_details', args=[self.task1.id]))

        # Check if request is successful, template is correct and data is correct
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'task_details.html')
        self.assertEqual(response.context['data'], self.task1)

    def test_update_task_get_unauthenticated(self):
        response = self.client.get(reverse('update_task', args=[self.task1.id]))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('update_task', args=[self.task1.id])}")

    def test_update_task_get(self):
        self.client.login(username='testuser', password='testpassword')

        # Display update task page
        response = self.client.get(reverse('update_task', args=[self.task1.id]))

        # Check if request is successful, template is correct and TaskForm is displayed
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'update_task.html')
        self.assertIsInstance(response.context['form'], TaskForm)

    def test_update_task_post_unauthenticated(self):
        response = self.client.post(reverse('update_task', args=[self.task1.id]),{
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

        # Update a task
        response = self.client.post(reverse('update_task', args=[self.task1.id]),{
            'title':'newTitle',
            'description':'newDescription',
            'due_date':datetime.date.today() + datetime.timedelta(days=2),
            'tags':'sampleTag2, newTag1',
            'priority':'Medium',
            'progress':25
        })

        # Check if the response is a redirect
        self.assertEqual(response.status_code, 302)

        # Get current task from database
        cur_task = Task.objects.get(title='newTitle')

        # Check if the redirect URL is correct
        self.assertRedirects(response, reverse('task_details', args=[cur_task.id]))

        # Verify the task was updated correctly
        self.assertEqual(cur_task.title, 'newTitle')
        self.assertEqual(cur_task.description, 'newDescription')
        self.assertEqual(cur_task.due_date, datetime.date.today() + datetime.timedelta(days=2))
        self.assertEqual(cur_task.progress, 25)
        self.assertEqual(cur_task.tags.count(), 2)
        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())
        self.assertTrue(Tag.objects.filter(name='sampleTag2').exists())
        self.assertTrue(Tag.objects.filter(name='newTag1').exists())

    def test_delete_task_unauthenticated(self):
        response = self.client.get(reverse('delete_task', args=[self.task1.id]))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('delete_task', args=[self.task1.id])}")

    def test_delete_task(self):
        self.client.login(username='testuser', password='testpassword')

        # Create another task with the same tag to test the tag deletion logic
        dummy_task = Task.objects.create(
                        title="dummy title", 
                        description="dummy description",
                    )
        
        dummy_task.tags.add(self.tag1)

        # Delete the original task
        response = self.client.post(reverse('delete_task', args=[self.task1.id]))

        # Check for the redirect to the task display page
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('display_tasks'))
        
        # Verify the original task is deleted
        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())

        # Verify the tag is not deleted because it's still associated with another task
        self.assertTrue(Tag.objects.filter(name='sampleTag1').exists())

        # Delete the second task
        response = self.client.post(reverse('delete_task', args=[dummy_task.id]))

        # Verify the second task is deleted
        self.assertFalse(Task.objects.filter(id=dummy_task.id).exists())

        # Verify the tag is deleted because no other tasks are associated with it
        self.assertFalse(Tag.objects.filter(name='sampleTag1').exists())