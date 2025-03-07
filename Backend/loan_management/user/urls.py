from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/',views.user_register, name="register"),
    path('register/test/',views.register, name="register-test"),
    path('email/',views.user_email, name="email-reset"),
    path('login/',views.user_login, name="login"),
    path('login/verify/',views.otp_verify, name="verify-otp"),
    path('resend/',views.resend_otp, name="resend-otp"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
]
