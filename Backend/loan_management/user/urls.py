from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('register/',views.user_register, name="register"),
    path('login/',views.user_login, name="login"),
    path('logout/',views.user_logout, name="login"),
    path('token/refresh/', views.refresh_token_view, name='token_refresh'),  
]
