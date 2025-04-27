from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/',views.user_register, name="register"),
    path('register/test/',views.register, name="register-test"),
    path('email/',views.user_email, name="email-reset"),
    path('login/',views.user_login, name="login"),
    path('logout-user/',views.log_out_user, name="logout_user"),
    path('verify/reset/',views.verify_password_reset_otp, name="verify-reset"),
    path('reset/',views.reset_password, name="reset-password"),
    path('login/verify/',views.otp_verify, name="verify-otp"),
    path('resend/',views.resend_otp, name="resend-otp"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    path('details/', views.get_user_details, name='user_Details'), 
    path('account/verify/',views.verify_account, name="verify_account"),
    path('details/verify/',views.get_verify_details, name="get_verify_details"),
    path('notifications/',views.get_notifications, name="get_notifications"),
]
