from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from datetime import datetime, timezone, timedelta
import datetime
from datetime import timedelta
from django.utils import timezone
from user.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(["POST"])
def admin_login(request):
    try:
        data = request.data.get("data", {})
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        admin = CustomUser.objects.filter(username=username, is_admin = True).first()
        if not admin:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)

        admin_verify = authenticate(request, username=username, password=password)
        if not admin_verify:
            return Response({"error": "Incorrect Password"}, status=status.HTTP_403_FORBIDDEN)

       
        refresh = RefreshToken.for_user(admin)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'success': 'Admin authenticated',
            'access_token': access_token,
            'refresh_token': str(refresh),
        }, status=status.HTTP_200_OK)
        """
        expires = timezone.now() + timedelta(days=7) 
        response.set_cookie(
            key="admin_refresh_token",
            value=refresh_token,
            expires=expires,
            httponly=True,
            secure=False,
            samesite="None"
        )
       """
        

    except Exception as e:
        print(f"Login Error: {e}")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_admin_token_view(request):
    """ Refresh token for admin users without using cookies """
    refresh_token = request.data.get("refresh_token") 

    if not refresh_token:
        return Response({"error": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)
        return Response({"access_token": new_access_token}, status=status.HTTP_200_OK)
    except Exception:
        return Response({"error": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)