from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import permission_classes, api_view
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import datetime
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .models import CustomUser
from .email.emails import send_otp_to_email


@api_view(["POST"])
def user_email(request):
    try:
        email = request.data.get('email')
        
        if CustomUser.objects.filter(email = email).exists():  
           purpose = "reset_password"       
           message = "Your OTP for Reset Password"
           subject = f"Your Verification Code for Password Reset."
           cache_key = f"{email}_{purpose}"
           otp_generated = send_otp_to_email(email,message,subject)
           OTP_EXPIRATION_TIME = 120 
           cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)
           
           return Response({"message": "OTP sent successfully."}, status=202)
        else:
            return Response({"error" : "Email is not Registered"}, status=404)
           
    except Exception as e:
        return Response({"error": "Something Went Wrong"}, status=500)

@api_view(["POST"])
def register(request):
    
    try:
        email = request.data.get('email')
        print(email)
        password = request.data.get('password')
        username = request.data.get('username') 
        admin_pass = request.data.get('admin_pass')  
        
        user = CustomUser.objects.create(email = email, password = make_password(password))
        admin = CustomUser.objects.create(username = username, password= make_password(admin_pass))

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    
    
    except Exception as e:
        return Response({"error": f"{e}"}, status= status.HTTP_200_OK)
    
    
@api_view(["POST"])
def user_login(request):
    try:
        data = request.data.get("data", {})  
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return Response({"error": "Please fill out all fields"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(email=email, is_admin = False).first()

        if not user:
            return Response({"error": "Email is not registered"}, status=status.HTTP_404_NOT_FOUND)

      
        user_auth = authenticate(request, username=user.username, password=password)
        if not user_auth:
            return Response({"error": "Incorrect Password"}, status=status.HTTP_401_UNAUTHORIZED)

        
        purpose = "verification"
        message = "Your OTP for verification"
        subject = f"Your  Verification Code for Login"
        cache_key = f"{email}_{purpose}"
        otp_generated = send_otp_to_email(email, message,subject)

        OTP_EXPIRATION_TIME = 120  
        cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)

        return Response({"success": "Verified Credentials"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Login Error: {e}")  
        return Response({"error": "Something went wrong. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["POST"])
@permission_classes([AllowAny])  
def otp_verify(request):
    try:
        data = request.data.get("data", {})
        email = data.get("email")
        password = data.get("password")
        otpCode = data.get("otpCode")
        purpose = "verification"
        
        cache_key = f"{email}_{purpose}"
        cache_otp = cache.get(cache_key)
        
        if cache_otp is None:
            return Response({"error": "OTP code is expired. Please generate a new one"}, status=status.HTTP_404_NOT_FOUND)
        
        if str(cache_otp) == str(otpCode):
            user_auth = authenticate(request, username=email, password=password)
            
            if not user_auth:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user_auth)
            access_token = str(refresh.access_token)

            return Response({
                'message': 'User authenticated',
                'access_token': access_token,  
                'refresh_token': str(refresh),  
            }, status=status.HTTP_200_OK)
            
            """

            expires = datetime.datetime.utcnow() + datetime.timedelta(days=7)
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                expires=expires,
                httponly=True,   
                secure=True,     
                samesite="None"  
            )

            return response
            """
        
        return Response({'error': 'Incorrect OTP Code. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        print(f"Error during login: {e}")
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def resend_otp(request):
    try:
        
        email = request.data.get("email")
        purpose = request.data.get("purpose") 
        user = CustomUser.objects.filter(email=email).first()
        
        if not user:
            return Response({"error": "Email is not registered"}, status=status.HTTP_404_NOT_FOUND)

        cache_key = f"{email}_{purpose}"
        message = "Your OTP for verification"
        subject = f"Your  Verification Code for Login"
        otp_generated = send_otp_to_email(email, message,subject)
        OTP_EXPIRATION_TIME = 120  
        cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)

        
        return Response({"success":"Resend successfully"}, status= status.HTTP_200_OK)
    
    except Exception as e:
        print(f"{e}")
    




@api_view(["POST"])
def user_register(request):
    try:
        
        return Response({"success":" Registration successful"}, status = status.HTTP_200_OK)
        
    except Exception as e:
        print(f"{e}")
        


"""    
@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get("refresh_token") 
    print(refresh_token)

    if not refresh_token:
        return Response({"error": "No refresh token found"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)  

        return Response({"access_token": new_access_token}, status=status.HTTP_200_OK)
    except Exception as e:
        response = Response({"error": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        response.delete_cookie("refresh_token")  
        return response
    
    
@api_view(["POST"])
@permission_classes([AllowAny])
def user_logout(request):
    try:
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")

        return response
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
"""