from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader
from .forms import TaskForm
from .models import Task, Tag

def process_tags(input_tags):
    tag_names = [tag.strip() for tag in input_tags.split(',') if tag.strip()]
    tags = []
    for tag_name in tag_names:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        tags.append(tag)
    return tags

def cleanup_tags(tags, task):
    for tag in tags:
        if Task.objects.filter(tags=tag).count() == 1:
            tag.delete()
        else:
            task.tags.remove(tag)

def display_hello(request):
    return HttpResponse('Hello World!')

def testing(request):
    template = loader.get_template('testing_tmpl.html')
    return HttpResponse(template.render())

@login_required
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

@login_required
def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        
        if form.is_valid():
            task = form.save(commit=False)

            tags = process_tags(form.cleaned_data.get('tags', ''))

            task.save()
            task.tags.add(*tags)
            task.save()

            return redirect('task_details', id=task.id)
    else:
        form = TaskForm()
    
    return render(request, 'add_task.html', {'form':form})

@login_required
def task_details(request, id):
    cur_data = get_object_or_404(Task, id=id)
    template = loader.get_template('task_details.html')
    context = {
        'data':cur_data,
    }
    return HttpResponse(template.render(context, request))

@login_required
def update_task(request, id):
    cur_task = get_object_or_404(Task, id=id)

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=cur_task)

        if form.is_valid():
            updated_task = form.save(commit=False)

            updated_tags = process_tags(form.cleaned_data.get('tags', ''))
            prev_tags = cur_task.tags.all()

            prev_only_tags = [tag for tag in prev_tags if tag not in updated_tags]

            cleanup_tags(prev_only_tags, cur_task)
        
            updated_task.save()
            updated_task.tags.set(updated_tags)

            return redirect('task_details', id=id)
    else:
        form = TaskForm(instance=cur_task)

    return render(request, 'update_task.html', {'form':form})

@login_required
def delete_task(request, id):
    cur_task = get_object_or_404(Task, id=id)
    associated_tags = cur_task.tags.all()

    cleanup_tags(associated_tags, cur_task)

    cur_task.delete()
    return redirect('display_tasks')