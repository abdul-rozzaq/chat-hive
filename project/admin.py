from django.contrib import admin

from .models import User, Post, Message, Friend, FriendRequest


class FriendAdmin(admin.ModelAdmin):
    list_display = ['user', 'friend']
    list_filter = ['user']


admin.site.register(User)
admin.site.register(Post)
admin.site.register(Message)
admin.site.register(Friend, FriendAdmin)
admin.site.register(FriendRequest)