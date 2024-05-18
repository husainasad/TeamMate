from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .forms import TaskForm

def display_hello(request):
    return HttpResponse('Hello World!')

def testing(request):
    template = loader.get_template('testing_tmpl.html')
    return HttpResponse(template.render())

def display_tasks(request):
    template = loader.get_template('taskPage.html')
    return HttpResponse(template.render())

def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            return redirect('display_tasks')
    else:
        form = TaskForm()
    return render(request, 'add_task.html', {'form':form})