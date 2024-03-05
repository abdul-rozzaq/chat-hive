from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Post, User

class UserCreateForm(UserCreationForm):
    class Meta:
        model = User

        fields = ['first_name', 'last_name', 'username', 'password1', 'password2']


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = '__all__'
    
    

