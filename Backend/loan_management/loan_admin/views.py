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



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_login(request):
    try:
        
        username = request.data.get('username')
        password = request.data.get('password')
        admin = authenticate(request, username=username, password=password)
        
        if admin:
            tokens = get_tokens_for_user(admin)
            
            access_token = tokens['access_token']
            refresh_token = tokens['refresh_token']
            
            response = Response({
                'message': 'User authenticated',
                'access_token': access_token,  
            }, status=status.HTTP_200_OK)

          
            expires = datetime.utcnow() + timedelta(days=7)
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                expires=expires,
                httponly=True,   
                secure=True,     
                samesite="None"  
            )

            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
          
    except Exception as e:
        print(f"{e}")