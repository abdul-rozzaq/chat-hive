from rest_framework import serializers

from project.models import FriendRequest, User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']


class FriendRequestSerializer(serializers.ModelSerializer):
    _from = UserSerializer() 

    class Meta:
        model = FriendRequest
        fields = '__all__'
        
