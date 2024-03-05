from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    background_image = models.ImageField(upload_to='background_images/', default='images/default-background.png')
    avatar = models.ImageField(upload_to='avatar', default='images/default-user.avif')

    def add_friend(self, friend):
        return Friend.objects.create(user=self, friend=friend)
    
    def full_name(self):
        return self.first_name + ' ' + self.last_name


class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE)


class FriendRequest(models.Model):
    _from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    to = models.ForeignKey(User, on_delete=models.CASCADE)

    def accept(self):
        self._from.add_friend(self.to)

        return self.delete()


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