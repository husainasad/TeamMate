from django.db import models
from django.contrib.auth.models import  User, Group
from django.core.exceptions import ValidationError
import datetime

class Task(models.Model):

    PRIORITY_CHOICES = (
        ("High", "High"),
        ("Medium", "Medium"),
        ("Low", "Low"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
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

    def clean(self):
        super().clean()
        if self.due_date < datetime.date.today():
            raise ValidationError("Due date cannot be in the past.")
        if not 0 <= self.progress <= 100:
            raise ValidationError("Progress must be between 0 and 100.")
        
    class Meta:
        ordering = ('due_date','priority','progress',)
    
    
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name