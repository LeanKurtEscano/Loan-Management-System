from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.admin_login, name="admin_login"),
    path('logout/', views.log_out_admin, name="admin_logout"),
    path('refresh/', views.refresh_admin_token_view, name="refresh"),
    path('email/', views.reset_password_admin_email, name="reset_admin_password"),
    path('users/', views.get_verify_data, name="get_verify_data"),
    path('users/<int:id>/', views.get_verify, name="get_verify"),
    path('verify/', views.verify_user, name="verify"),
    path('reject/', views.reject_verification, name="reject"),

]
