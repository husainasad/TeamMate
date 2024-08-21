from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from userManager.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail': 'Error fetching users'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_detail(request, pk):
    user = get_object_or_404(User, pk=pk)
    if request.user != user and not request.user.is_staff:
        return Response({'detail': 'You do not have permission to view this user.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': 'Error fetching user details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)