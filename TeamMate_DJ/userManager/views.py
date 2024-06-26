from django.contrib.auth import login, authenticate, logout
from userManager.forms import CustomUserCreationForm
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def user_signup(request):
    form = CustomUserCreationForm(data=request.data)
    if form.is_valid():
        try:
            user = form.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Registration successful',
                'username': user.username,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error signing up: {e}")
            return Response({'detail': 'Error signing up'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'detail': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    if user is not None:
        try:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error logging in: {e}")
            return Response({'detail': 'Error loggin in'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            'detail': 'Invalid credentials'
        }, status=status.HTTP_400_BAD_REQUEST)
  
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        request.user.auth_token.delete()
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error logging out: {e}")
        return Response({
            'detail': 'Invalid credentials'
        }, status=status.HTTP_400_BAD_REQUEST)