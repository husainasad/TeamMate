from django.test import TestCase, Client
from django.core.exceptions import ValidationError
from taskManager.models import Task, Tag, TaskMember
from django.contrib.auth import get_user_model
import datetime

class TagTestCase(TestCase):
    def test_create_tag(self):
        Tag.objects.create(name="sampleTag1")
        self.assertTrue(Tag.objects.filter(name="sampleTag1").exists())

    def test_unique_name_constraint(self):
        Tag.objects.create(name="uniqueTag")
        with self.assertRaises(Exception):
            Tag.objects.create(name="uniqueTag")

class TaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username='testuser', 
            password='testpassword',
            email='test@example.com'
        )

        self.other_user = get_user_model().objects.create_user(
            username='otheruser', 
            password='otherpassword',
            email='other@example.com'
        )
        self.tag1 = Tag.objects.create(name="sampleTag1")
        self.tag2 = Tag.objects.create(name="sampleTag2")

    def test_create_task_with_valid_data(self):
        task = Task.objects.create(
            owner = self.user,
            title="sampleTitle", 
            description="sampleDescription",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="Medium",
            progress=50,
        )

        task.tags.add(self.tag1)
        task.tags.add(self.tag2)

        self.assertEqual(task.owner, self.user)
        self.assertEqual(task.title, "sampleTitle")
        self.assertEqual(task.description, "sampleDescription")
        self.assertEqual(task.due_date, datetime.date.today() + datetime.timedelta(days=2))
        self.assertEqual(task.priority, "Medium")
        self.assertEqual(task.progress, 50)
        self.assertIn(self.tag1, task.tags.all())
        self.assertIn(self.tag2, task.tags.all())

    def test_default_values(self):
        
        task = Task.objects.create(
            owner = self.user,
            title="sampleTitle", 
            description="sampleDescription",
        )

        self.assertEqual(task.due_date, datetime.date.today())
        self.assertEqual(task.priority, "High")
        self.assertEqual(task.progress, 0)
        self.assertEqual(task.tags.count(), 0)

    def test_progress_must_be_within_valid_range(self):
        task = Task(
            owner = self.user,
            title="sampleTitle",
            description="sampleDescription",
            due_date=datetime.date.today() + datetime.timedelta(days=1),
            progress=-1
        )
        with self.assertRaises(ValidationError):
            task.full_clean()
        
        task.progress = 101
        with self.assertRaises(ValidationError):
            task.full_clean()

    def test_add_members_to_task(self):
        task = Task.objects.create(
            owner=self.user,
            title="sampleTitle", 
            description="sampleDescription",
        )

        task_member = TaskMember.objects.create(
            task=task,
            user=self.other_user,
            is_owner=False
        )

        self.assertTrue(task.members.filter(user=self.other_user).exists())
        self.assertFalse(task_member.is_owner)

    def test_task_member_is_owner(self):
        task = Task.objects.create(
            owner=self.user,
            title="sampleTitle", 
            description="sampleDescription",
        )

        task_member = TaskMember.objects.create(
            task=task,
            user=self.user,
            is_owner=True
        )

        self.assertTrue(task_member.is_owner)