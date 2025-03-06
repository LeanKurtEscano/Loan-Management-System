from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.admin_login, name="admin_login"),
    path('refresh/', views.refresh_admin_token_view, name="refresh")
]
