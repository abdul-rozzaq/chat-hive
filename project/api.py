from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request

from project.models import FriendRequest, User
from project.serializers import FriendRequestSerializer, UserSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friend_requests(request: Request):

    queryset = FriendRequest.objects.filter(to=request.user)

    return Response(FriendRequestSerializer(queryset, many=True, context={'request': request}).data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def confirm_friend_request(request: Request, pk: int):
    status = 400

    qs = FriendRequest.objects.filter(pk=pk)

    if qs.exists():
        req = qs.first()
        req.accept()
        status = 200

    return Response(status=status)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cancel_friend_request(request: Request, pk: int):
    status = 400

    qs = FriendRequest.objects.filter(pk=pk)

    if qs.exists():
        req = qs.first()
        req.delete()
        status = 200

    return Response(status=status)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request: Request):
    user = request.user

    queryset = User.objects.exclude(pk=request.user.pk).exclude(pk__in=[x.friend.pk for x in user.friends.all()])

    # queryset = filter()

    serializer = UserSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)