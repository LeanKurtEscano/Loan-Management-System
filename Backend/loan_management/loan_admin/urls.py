from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.admin_login, name="admin_login"),
    path('logout/', views.log_out_admin, name="admin_logout"),
    path('refresh/', views.refresh_admin_token_view, name="refresh"),
    path('otp-password/', views.verify_password_reset_admin_otp, name="reset_admin_password"),
    path('password/', views.reset_admin_password, name="reset_admin_password"),
    path('users/', views.get_verify_data, name="get_verify_data"),
    path('users/<int:id>/', views.get_verify, name="get_verify"),
    path('verify/', views.verify_user, name="verify"),
    path('remove/', views.remove_verification, name="remove"),
    path('reject/', views.reject_user_verification, name="reject"),
    path('email/', views.admin_email, name="admin-email"),
    path('resend/',views.resend_otp, name="resend-otp"),
    path('admin-details/',views.get_admin_details, name="admin_details"),
    path('notifications/',views.get_notifications, name="get_notifications"),
    path('notifications/mark-all-read/',views.mark_all_read, name="mark-all-read"),
    path('notifications/<int:id>/mark-read/',views.mark_read, name="mark-read"),
    path('notifications/<int:id>/',views.delete_notification, name="delete-notif"),
    path('notifications/details/<int:id>/',views.notification_details, name="details-notif"),

]
