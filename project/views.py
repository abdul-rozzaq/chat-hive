from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout as lgt
from django.contrib.auth.decorators import login_required

@login_required(login_url='login')
def home_page(request):
    return render(request, "index.html")


def login_page(request):
    return render(request, 'auth/login.html')


def register_page(request):
    return render(request, 'auth/register.html')


def logout(request):
    return render(request, 'auth/login.html')