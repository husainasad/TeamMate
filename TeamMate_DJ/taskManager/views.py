from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader

def display_hello(request):
    return HttpResponse('Hello World!')

def testing(request):
    template = loader.get_template('testing_tmpl.html')
    return HttpResponse(template.render())