from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from django.urls import reverse
from .forms import TaskForm
from .models import Task

def display_hello(request):
    return HttpResponse('Hello World!')

def testing(request):
    template = loader.get_template('testing_tmpl.html')
    return HttpResponse(template.render())

def display_tasks(request):
    all_data = Task.objects.filter(progress__lt=100)
    template = loader.get_template('taskPage.html')
    context = {
        'data':all_data,
    }
    return HttpResponse(template.render(context, request))

def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('pending tasks')
    else:
        form = TaskForm()
    return render(request, 'add_task.html', {'form':form})

def completed_tasks(request):
    all_data = Task.objects.filter(progress=100)
    template = loader.get_template('completed_tasks.html')
    context = {
        'data':all_data,
    }
    return HttpResponse(template.render(context, request))

def tasks_details(request, id):
    cur_data = Task.objects.get(id=id)
    template = loader.get_template('task_details.html')
    context = {
        'data':cur_data,
    }
    return HttpResponse(template.render(context, request))