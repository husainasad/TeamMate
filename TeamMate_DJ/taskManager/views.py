from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .forms import TaskForm
from .models import Task, Tag

def display_hello(request):
    return HttpResponse('Hello World!')

def testing(request):
    template = loader.get_template('testing_tmpl.html')
    return HttpResponse(template.render())

def display_tasks(request):

    tasks = Task.objects.all()
    status_filter = request.GET.get('status')

    if(status_filter=='completed'):
        tasks = tasks.filter(progress=100)
    elif(status_filter=='pending'):
        tasks = tasks.filter(progress__lt=100)

    template = loader.get_template('taskPage.html')
    context = {
        'data':tasks,
    }
    return HttpResponse(template.render(context, request))

def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        
        if form.is_valid():
            task = form.save(commit=False)

            tags_input = form.cleaned_data.get('tags', '')
            tag_names = [tag.strip() for tag in tags_input.split(',') if tag.strip()]
            tags = []

            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tags.append(tag)

            task.save()
            task.tags.add(*tags)
            task.save()

            return redirect('task_details', id=task.id)
    else:
        form = TaskForm()
    
    return render(request, 'add_task.html', {'form':form})

def tasks_details(request, id):
    cur_data = Task.objects.get(id=id)
    template = loader.get_template('task_details.html')
    context = {
        'data':cur_data,
    }
    return HttpResponse(template.render(context, request))

def update_task(request, id):
    cur_task = Task.objects.get(id=id)

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=cur_task)

        if form.is_valid():
            updated_task = form.save(commit=False)

            tags_input = form.cleaned_data.get('tags', '')
            tag_names = [tag.strip() for tag in tags_input.split(',') if tag.strip()]
            updated_tags = []

            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                updated_tags.append(tag)

            updated_task.save()
            updated_task.tags.set(updated_tags)

            return redirect('task_details', id=id)
    else:
        form = TaskForm(instance=cur_task)

    return render(request, 'update_task.html', {'form':form})

def delete_task(request, id):
    cur_task = Task.objects.get(id=id)
    associated_tags = cur_task.tags.all()

    for tag in associated_tags:
        if Task.objects.filter(tags=tag).count() == 1:
            tag.delete()
        else:
            cur_task.tags.remove(tag)

    cur_task.delete()
    return redirect('display_tasks')