from django.test import TestCase
from django.core.exceptions import ValidationError
from taskManager.models import Task, Tag
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
        self.tag1 = Tag.objects.create(name="sampleTag1")
        self.tag2 = Tag.objects.create(name="sampleTag2")

    def test_create_task_with_valid_data(self):
        task = Task.objects.create(
            title="sampleTitle", 
            description="sampleDescription",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="Medium",
            progress=50,
        )

        task.tags.add(self.tag1)
        task.tags.add(self.tag2)

        self.assertEqual(task.title, "sampleTitle")
        self.assertEqual(task.description, "sampleDescription")
        self.assertEqual(task.due_date, datetime.date.today() + datetime.timedelta(days=2))
        self.assertEqual(task.priority, "Medium")
        self.assertEqual(task.progress, 50)
        self.assertIn(self.tag1, task.tags.all())
        self.assertIn(self.tag2, task.tags.all())

    def test_default_values(self):
        
        task = Task.objects.create(
            title="sampleTitle", 
            description="sampleDescription",
        )

        self.assertEqual(task.due_date, datetime.date.today())
        self.assertEqual(task.priority, "High")
        self.assertEqual(task.progress, 0)

    def test_due_date_cannot_be_in_past(self):
        task = Task(
            title="sampleTitle",
            description="sampleDescription",
            due_date=datetime.date.today() - datetime.timedelta(days=1),
        )
        with self.assertRaises(ValidationError):
            task.full_clean()


    def test_progress_must_be_within_valid_range(self):
        task = Task(
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

    def test_ordering(self):
        task1 = Task.objects.create(
            title="sampleTitle1", 
            description="sampleDescription1",
            due_date=datetime.date.today() + datetime.timedelta(days=1),
            priority="High",
            progress=0,
        )

        task2 = Task.objects.create(
            title="sampleTitle2", 
            description="sampleDescription2",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="High",
            progress=0,
        )

        task3 = Task.objects.create(
            title="sampleTitle3", 
            description="sampleDescription3",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="Medium",
            progress=0,
        )

        task4 = Task.objects.create(
            title="sampleTitle4", 
            description="sampleDescription4",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="Low",
            progress=0,
        )

        task5 = Task.objects.create(
            title="sampleTitle5", 
            description="sampleDescription5",
            due_date=datetime.date.today() + datetime.timedelta(days=2),
            priority="Low",
            progress=50,
        )
    
        tasks = Task.objects.all()
        self.assertEqual(tasks[0], task1)
        self.assertEqual(tasks[1], task2)
        self.assertEqual(tasks[2], task4)
        self.assertEqual(tasks[3], task5)
        self.assertEqual(tasks[4], task3)