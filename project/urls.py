
from django.urls import path
from .views import *

urlpatterns = [
    path('', home_page, name='home'),
    path('login/', login_page, name='login'),
    path('sign-up/', register_page, name='register'),
]