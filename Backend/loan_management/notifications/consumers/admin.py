import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AdminNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.admin_id = self.scope['url_route']['kwargs']['admin_id']
        self.group_name = f"notifications_{self.admin_id}"
        
        # Join the notification group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send a connection confirmation message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to notification service'
        }))
    
    async def disconnect(self, close_code):
        # Leave the notification group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            # Handle heartbeat messages
            if message_type == 'heartbeat':
                await self.send(text_data=json.dumps({
                    'type': 'heartbeat_response'
                }))
                return
        except json.JSONDecodeError:
            # Handle invalid JSON
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def send_notification(self, event):
        # This method is called when a notification is sent to the group
        # It simply passes the notification data to the WebSocket
        notification = event['notification']
        
        await self.send(text_data=json.dumps({
            'notification': notification
        }))