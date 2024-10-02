import json
from channels.db import database_sync_to_async

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from project.models import Message, User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not isinstance(user, AnonymousUser) and self.check_receiver():
            self.receiver = self.scope["url_route"]["kwargs"]["pk"]
            self.chat_group_name = self.generate_chat_name()

            await self.channel_layer.group_add(self.chat_group_name, self.channel_name)

            await self.accept()

            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "text_message",
                    "content": {
                        "type": "connection",
                        "id": user.id,
                    },
                },
            )

    async def disconnect(self, close_code):
        print(f"Disconnected {close_code}")

    async def receive(self, text_data):       
        message = json.loads(text_data)

        if message["type"] == "text":
            json_message = await self.create_text_message(message["message"])

            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "text_message",
                    "content": {"type": "message", **json_message},
                },
            )

        elif message["type"] == "file":
            print(message.keys())

        elif message["type"] == "status":
            await self.channel_layer.group_send(
                self.chat_group_name,
                {
                    "type": "text_message",
                    "content": {
                        "type": "status",
                        "code": message['code'],
                        "user_id": self.scope['user'].pk,
                    },
                },
            )

    async def text_message(self, message):
        await self.send(text_data=json.dumps(message["content"]))

    def generate_chat_name(self):
        ids = [self.scope["url_route"]["kwargs"]["pk"], self.scope["user"].pk]
        ids.sort()
        return "chat_" + "x".join(map(str, ids))

    @database_sync_to_async
    def create_text_message(self, text_data: str) -> dict:
        try:

            message = Message.objects.create(
                text=text_data,
                sender=self.scope["user"],
                receiver_id=self.receiver,
            )

            return message.to_dict()

        except Exception as e:
            print(f"Message create error {e}")

    @database_sync_to_async
    def check_receiver(self) -> bool:
        return User.objects.filter(pk=self.scope["url_route"]["kwargs"]["pk"]).exists()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not isinstance(user, AnonymousUser):
            self.chat_group_name = f"channel_{user.pk}"
            await self.channel_layer.group_add(self.chat_group_name, self.channel_name)

            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_group_name, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))
