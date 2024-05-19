from django import forms
from django.core.exceptions import ValidationError
from .models import Task
import datetime

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'
        widgets = {
            'due_date': forms.DateInput(attrs={'type': 'date'}),
            'tags': forms.TextInput(attrs={'placeholder': 'Enter tags separated by commas'}),
        }

    def clean_due_date(self):
        due_date = self.cleaned_data['due_date']
        if due_date < datetime.date.today():
            raise ValidationError("Due date cannot be in the past.")
        return due_date