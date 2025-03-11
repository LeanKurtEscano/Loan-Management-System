from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.admin_login, name="admin_login"),
    path('refresh/', views.refresh_admin_token_view, name="refresh"),
    path('email/', views.reset_password_admin_email, name="reset_admin_password"),
    path('users/', views.get_verify_data, name="get_verify_data")
]
