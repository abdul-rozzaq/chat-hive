from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings


class User(AbstractUser):
    background_image = models.ImageField(upload_to='background_images/', default='images/default-background.png')
    avatar = models.ImageField(upload_to='avatar', default='images/default-user.avif')

    def add_friend(self, friend):
        Friend.objects.create(user=self, friend=friend)
        Friend.objects.create(user=friend, friend=self)
    
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    def friends_list(self):
        return [friend.friend for friend in self.friends.all()]

class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE)


class FriendRequest(models.Model):
    _from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    to = models.ForeignKey(User, on_delete=models.CASCADE)

    def accept(self):
        self._from.add_friend(self.to)

        return self.delete()

    @property
    def user(self):
        return self._from

class Post(models.Model):
    creator = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post-images/')
    title = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True)

    def add_like(self, user: User) -> None:
        return self.likes.add(user)
        

    def __str__(self) -> str:
        return self.creator.username
    
class Message(models.Model):
    text = models.CharField(max_length=256)

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')

    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return self.sender.username
    

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'sender': {
                'id': self.sender.pk,
                'avatar': self.sender.avatar.url,
                'receiver': self.receiver.pk,
                'username': self.sender.username,
                'full_name': self.sender.full_name(),
            },
            'receiver': self.receiver.pk,
            'text': self.text,
            'created_at': self.created_at.strftime('%H:%M'),
        }

    def notify(self) -> None:
        channel_layer = get_channel_layer()

        group_name = f"channel_{self.receiver.pk}"

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "message": self.to_dict(),
            },
        )

    def save(self, *args, **kwargs):

        if self.pk is None:
            object = super().save(*args, **kwargs)

            self.notify()
        else:
            return super().save(*args, **kwargs)
