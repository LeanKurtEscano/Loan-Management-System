from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from utils.token import get_tokens_for_user
import datetime
from datetime import timedelta
from .models import LoanAdmin




@api_view(["POST"])
def admin_login(request):
    try:
        data = request.data.get("data", {})
        username = data.get("username")
        password = data.get("password")

      
        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    
        admin = LoanAdmin.objects.filter(username=username).first()
        if not admin:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
        
        admin_verify = authenticate(request, username  = username, password = password)
        if not admin_verify:
            return Response({"error": "Incorrect Password"}, status=status.HTTP_403_FORBIDDEN)

        
        tokens = get_tokens_for_user(admin)
        access_token = tokens['access_token']
        refresh_token = tokens['refresh_token']

       
        response = Response({
            'message': 'User authenticated',
            'access': access_token,  
        }, status=status.HTTP_200_OK)

       
        expires = datetime.utcnow() + timedelta(days=7)
        response.set_cookie(
            key="refresh_token",
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
