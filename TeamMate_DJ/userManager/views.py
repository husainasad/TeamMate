from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import login
from userManager.forms import CustomUserCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response

# def dashboard(request):
#     return render(request, "users/dashboard.html")

@api_view(['GET'])
def dashboard(request):
    return Response({'message': 'Welcome to the Dashboard!'})

def register(request):
    if request.method=='POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(reverse("dashboard"))
        else:
            print(form.errors)
    else:
        return render(
            request, "users/register.html",
            {"form": CustomUserCreationForm}
        )