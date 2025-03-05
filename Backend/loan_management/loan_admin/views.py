from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
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

        # Generate tokens directly using RefreshToken
        refresh = RefreshToken.for_user(admin)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            'success': 'User authenticated',
            'access': access_token,
        }, status=status.HTTP_200_OK)

        expires = timezone.now() + timedelta(days=7) 
        response.set_cookie(
            key="admin_refresh_token",
            value=refresh_token,
            expires=expires,
            httponly=True,
            secure=False,
            samesite="None"
        )

        return response

    except Exception as e:
        print(f"Login Error: {e}")
        return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
