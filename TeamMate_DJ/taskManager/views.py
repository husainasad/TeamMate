from django.shortcuts import get_object_or_404
from taskManager.models import Task, Tag
from taskManager.serializers import TaskSerializer, TagSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

def process_tags(input_tags):
    tag_names = [tag.strip() for tag in input_tags if tag.strip()]
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

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def display_tasks(request):
    try:
        tasks = Task.objects.filter(owner=request.user)
        status_filter = request.GET.get('status')

        if(status_filter=='completed'):
            tasks = tasks.filter(progress=100)
        elif(status_filter=='pending'):
            tasks = tasks.filter(progress__lt=100)

        serializer = TaskSerializer(tasks, many=True)

        response_data = {
            'username': request.user.username,
            'tasks': serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error displaying task: {e}")
        return Response({'detail': 'Error displaying task'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        try:
            task = serializer.save(owner=request.user)
            tags = process_tags(request.data.get('tags', ''))
            task.tags.set(tags)
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error during task creation: {e}")
            return Response({'detail': 'Error during task creation'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def task_details(request, id):
    try:
        task = get_object_or_404(Task, id=id, owner=request.user)
        serializer = TaskSerializer(task)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching task details: {e}")
        return Response({'detail': 'Error fetching task details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_task(request, id):
    task = get_object_or_404(Task, id=id, owner=request.user)
    serializer = TaskSerializer(task, data=request.data, partial=True)

    if serializer.is_valid():
        try:
            updated_task = serializer.save()
            updated_tags = process_tags(request.data.get('tags', ''))
            prev_tags = task.tags.all()
            prev_only_tags = [tag for tag in prev_tags if tag not in updated_tags]
            cleanup_tags(prev_only_tags, task)
            updated_task.tags.set(updated_tags)
            return Response(TaskSerializer(updated_task).data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error updating task: {e}")
            return Response({'detail': 'Error updating task'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_task(request, id):
    try:
        task = get_object_or_404(Task, id=id, owner=request.user)
        associated_tags = task.tags.all()
        cleanup_tags(associated_tags, task)
        task.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"Error deleting task: {e}")
        return Response({'detail': 'Error deleting task'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)