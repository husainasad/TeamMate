from django.shortcuts import get_object_or_404
from django.db import transaction
from taskManager.models import Task, Tag, TaskMember
from django.contrib.auth.models import User
from taskManager.serializers import TaskSerializer, TaskMemberSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

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

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_tasks(request):
    try:
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
         return Response({'detail': f'Error fetching tasks: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_tasks_as_member(request):
    try:
        user = request.user
        task_memberships = TaskMember.objects.filter(user=user)
        tasks = Task.objects.filter(id__in=task_memberships.values_list('task_id', flat=True))
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
         return Response({'detail': f'Error fetching member tasks: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_tasks_as_owner(request):
    try:
        user = request.user
        tasks = Task.objects.filter(owner=user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
         return Response({'detail': f'Error fetching owner tasks: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_task_by_id(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    try:
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': f'Error fetching task by id: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_new_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                task = serializer.save(owner=request.user)
                tags = process_tags(request.data.get('tags', ''))
                task.tags.set(tags)
                TaskMember.objects.create(task=task, user=request.user, is_owner=True)
                return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': f'Error creating task: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def task_details(request, id):
#     try:
#         task = get_object_or_404(Task, id=id, owner=request.user)
#         serializer = TaskSerializer(task)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Exception as e:
#         logger.error(f"Error fetching task details: {e}")
#         return Response({'detail': 'Error fetching task details: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def update_task_by_id(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task_member = get_object_or_404(TaskMember, task=task, user=request.user)
    if task_member.is_owner or task_member:
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    updated_task = serializer.save()
                    updated_tags = process_tags(request.data.get('tags', ''))
                    prev_tags = task.tags.all()
                    prev_only_tags = [tag for tag in prev_tags if tag not in updated_tags]
                    cleanup_tags(prev_only_tags, task)
                    updated_task.tags.set(updated_tags)
                    return Response(TaskSerializer(updated_task).data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'detail': f'Error updating task: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'You do not have permission to edit this task.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['DELETE'])
def delete_task_by_id(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task_member = get_object_or_404(TaskMember, task=task, user=request.user)
    if task_member.is_owner:
        try:
            with transaction.atomic():
                associated_tags = task.tags.all()
                cleanup_tags(associated_tags, task)
                task.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'detail': f'Error deleting task: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'detail': 'You do not have permission to delete this task.'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def add_user_to_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    user = request.user
    
    if not TaskMember.objects.filter(task=task, user=user, is_owner=True).exists():
        return Response({'detail': 'You do not have permission to add members to this task.'}, status=status.HTTP_403_FORBIDDEN)

    new_member_username = request.data.get('username')
    if not new_member_username:
        return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
         with transaction.atomic():
            new_member = get_object_or_404(User, username=new_member_username)
            if TaskMember.objects.filter(task=task, user=new_member).exists():
                return Response({'detail': 'User is already a member of this task.'}, status=status.HTTP_400_BAD_REQUEST)

            task_member = TaskMember(task=task, user=new_member)
            task_member.save()
            serializer = TaskMemberSerializer(task_member)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': f'Error adding user to task: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def remove_user_from_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    user = request.user

    if not TaskMember.objects.filter(task=task, user=user, is_owner=True).exists():
        return Response({'detail': 'You do not have permission to add members to this task.'}, status=status.HTTP_403_FORBIDDEN)

    remove_member_username = request.data.get('username')
    if not remove_member_username:
        return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        with transaction.atomic():
            remove_member = get_object_or_404(User, username=remove_member_username)
            task_member = TaskMember.objects.filter(task=task, user=remove_member).first()
            if not task_member:
                return Response({'detail': 'User is not a member of this task.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if task_member.is_owner:
                return Response({'detail': 'You cannot remove the task owner from the task.'}, status=status.HTTP_400_BAD_REQUEST)

            task_member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'detail': f'Error removing user from task: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)