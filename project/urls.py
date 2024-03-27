
from django.urls import path

from .api import get_friend_requests, confirm_friend_request, cancel_friend_request, get_users
from .views import *
from .consumers import ChatConsumer, NotificationConsumer

# Django urls

urlpatterns = [
    path('', home_page, name='home'),
    path('login/', login_page, name='login'),
    path('sign-up/', register_page, name='register'),
    path('logout/', logout, name='logout'),

    path('user-profile/@<str:username>', user_profile, name='user_profile'),
    path('chat/@<str:username>', chat_page, name='chat'),
    path('send-friend-request/<int:pk>/', send_friend_request, name='send_friend_request'),
]

# Api urls

urlpatterns += [
    path('api/friend-requests/', get_friend_requests),
    path('api/confirm-request/<int:pk>/', confirm_friend_request),
    path('api/cancel-request/<int:pk>/', cancel_friend_request),
    path('api/users/', get_users),
]

# Websocket urls

websocket_urlpatterns = [
    path("ws/chat/<int:pk>/", ChatConsumer.as_asgi()),
    path("ws/notify/", NotificationConsumer.as_asgi()),

]