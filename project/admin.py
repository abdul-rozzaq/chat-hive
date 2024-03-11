from django.contrib import admin

from .models import User, Post, Message, Friend, FriendRequest


class FriendAdmin(admin.ModelAdmin):
    list_display = ['user', 'friend']
    list_filter = ['user']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender','receiver', 'text']
    list_filter = ['sender','receiver']

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Message, MessageAdmin)
admin.site.register(Friend, FriendAdmin)
admin.site.register(FriendRequest)