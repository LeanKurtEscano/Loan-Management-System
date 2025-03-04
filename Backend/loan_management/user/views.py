from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from utils.token import get_tokens_for_user
import datetime
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(["POST"])
@permission_classes([AllowAny])  
def user_login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)

        if user:
            tokens = get_tokens_for_user(user)
            access_token = tokens["access_token"]
            refresh_token = tokens["refresh_token"]

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

            return response
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        print(f"Error during login: {e}")
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def user_register(request):
    try:
        
        return Response({"success":" Registration successful"}, status = status.HTTP_200_OK)
        
    except Exception as e:
        print(f"{e}")
        
        
@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get("refresh_token") 

    if not refresh_token:
        return Response({"error": "No refresh token found"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)  

        return Response({"access_token": new_access_token}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")

        return response
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)