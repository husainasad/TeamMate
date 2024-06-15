from django import forms
from taskManager.models import Task

class TaskForm(forms.ModelForm):
    tags = forms.CharField(
        widget=forms.TextInput(),
        required=False,
        help_text='(Enter tags separated by commas)'
    )
    
    class Meta:
        model = Task
        exclude = ['owner']
        widgets = {
            'due_date': forms.DateInput(attrs={'type': 'date'}),
        }
        labels = {
            'progress': 'Progress (%)',
        }