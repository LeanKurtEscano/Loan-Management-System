from django.urls import path


from django.urls import re_path

from .consumers import users
from .consumers import admin


websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', users.NotificationConsumer.as_asgi()),
    re_path(r'ws/admin-notifications/(?P<admin_id>\w+)/$', admin.AdminNotificationConsumer.as_asgi()),
]
