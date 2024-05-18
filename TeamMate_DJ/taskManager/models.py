from django.db import models
import datetime

class Task(models.Model):

    PRIORITY_CHOICES = (
        ("High", "High"),
        ("Medium", "Medium"),
        ("Low", "Low"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField(default=datetime.date.today)
    tags = models.ManyToManyField('Tag', blank=True)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default="High")
    progress = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name