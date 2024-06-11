from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from taskManager.forms import TaskForm
from taskManager.models import Task, Tag

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
    return render(request, 'testing_tmpl.html')  

@login_required
def display_tasks(request):

    tasks = Task.objects.filter(owner=request.user)
    status_filter = request.GET.get('status')

    if(status_filter=='completed'):
        tasks = tasks.filter(progress=100)
    elif(status_filter=='pending'):
        tasks = tasks.filter(progress__lt=100)

    return render(request, 'taskPage.html', {'data': tasks})

@login_required
def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        
        if form.is_valid():
            task = form.save(commit=False)
            task.owner = request.user

            tags = process_tags(form.cleaned_data.get('tags', ''))

            task.save()
            task.tags.set(tags)

            return redirect('task_details', id=task.id)
    else:
        form = TaskForm()
    
    return render(request, 'add_task.html', {'form':form})

@login_required
def task_details(request, id):
    task = get_object_or_404(Task, id=id)
    return render(request, 'task_details.html', {'data': task})

@login_required
def update_task(request, id):
    cur_task = get_object_or_404(Task, id=id)

    if cur_task.owner != request.user:
        return HttpResponse('Unauthorized', status=401)

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

    if cur_task.owner != request.user:
        return HttpResponse('Unauthorized', status=401)
    
    associated_tags = cur_task.tags.all()

    cleanup_tags(associated_tags, cur_task)

    cur_task.delete()
    return redirect('display_tasks')