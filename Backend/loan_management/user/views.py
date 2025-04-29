from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import permission_classes,parser_classes, api_view
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from .models import CustomUser, VerificationRequests,Notification
from .email.emails import send_otp_to_email
from .serializers import CustomUserSerializer,VerificationRequestsSerializer,NotificationSerializer
import cloudinary.uploader
from loan.models import LoanApplication

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def verify_account(request):
    try:
        # Extract form data
        first_name = request.data.get("firstName")
        middle_name = request.data.get("middleName", "")
        last_name = request.data.get("lastName")
        birthdate = request.data.get("birthdate")
        age = request.data.get("age")
        address = request.data.get("address")
        gender = request.data.get("gender")
        civil_status = request.data.get("civilStatus")
        postal_code= request.data.get("postalCode")
      
        
        user = CustomUser.objects.get(id = request.user.id)
        user.is_verified = "pending"
        user.save()
        if not first_name or not last_name or not birthdate  or not address:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

     

      
        VerificationRequests.objects.create(
            user =request.user,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            birthdate=birthdate,
            age=age,
            address=address,
            gender = gender,
            postal_code = postal_code,
            marital_status = civil_status,
          
            status="pending"
        )

        return Response({"success": "Data received and stored"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
           
           return Response({"message": "OTP sent successfully."}, status=200)
        else:
            return Response({"error" : "Email is not Registered"}, status=404)
           
    except Exception as e:
        return Response({"error": "Something Went Wrong"}, status=500)

@api_view(["POST"])
def register(request):
    
    try:
      
        username = request.data.get('username') 
        admin_pass = request.data.get('admin_pass')  
        
      
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
        username = data.get("username")
        password = data.get("password")
        otp_code = data.get("otpCode")
        purpose = request.data.get("purpose")

        if not all([email, password, otp_code, purpose]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"{email}_{purpose}"
        cache_otp = cache.get(cache_key)

        if cache_otp is None:
            return Response({"error": "OTP code is expired. Please generate a new one."}, status=status.HTTP_404_NOT_FOUND)

        if str(cache_otp) != str(otp_code):
            return Response({"error": "Incorrect OTP Code. Please try again."}, status=status.HTTP_401_UNAUTHORIZED)

        user_auth = authenticate(request, username=email, password=password)

        if purpose == "verification":
            if user_auth is None:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

         
            existing_loan = LoanApplication.objects.filter(user=user_auth).first()
            loan_status_message = existing_loan.status if existing_loan else "None"
           
            refresh = RefreshToken.for_user(user_auth)
            access_token = str(refresh.access_token)

            return Response({
                "message": "User authenticated",
                "access_token": access_token,
                "refresh_token": str(refresh),
                "loan_status": loan_status_message
            }, status=status.HTTP_200_OK)

        elif purpose == "register":
            if CustomUser.objects.filter(email=email).exists():
                return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

            user = CustomUser.objects.create(username=username, email=email, password=make_password(password))

            return Response({"success": "Registered successfully"}, status=status.HTTP_201_CREATED)

        return Response({"error": "Invalid purpose."}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Error during OTP verification: {e}")
        return Response({"error": "Something went wrong. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def resend_otp(request):
    try:
        
        email = request.data.get("email")
        purpose = request.data.get("purpose") 
        user = CustomUser.objects.filter(email=email).first()
    
     
        messages = {
            "verification": "Your OTP for account verification.",
            "reset_password": "Your OTP for password reset."
        }
        
        subject_dynamic = {
            "verification": "Login",
            "reset_password": "Reset Password"
        }

        message = messages.get(purpose, "Your OTP for verification.")  
        
        dynamic = subject_dynamic.get(purpose)
       

        
        cache_key = f"{email}_{purpose}"
        message = "Your OTP for verification"
        subject = f"Your  Verification Code for {dynamic}"
        otp_generated = send_otp_to_email(email, message,subject)
        OTP_EXPIRATION_TIME = 120  
        cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)

        
        return Response({"success":"Resend successfully"}, status= status.HTTP_200_OK)
    
    except Exception as e:
        print(f"{e}")
    

@api_view(["POST"])
def verify_password_reset_otp(request):
    try:
        
        data = request.data.get("data")
        email = data.get("email")
        otp_code = data.get("otpCode")
        purpose = "reset_password"
        cache_key = f"{email}_{purpose}"
        
      
        cached_otp = cache.get(cache_key)
        
        if cached_otp is None:
            return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_404_NOT_FOUND)
        
       
        if str(cached_otp) == str(otp_code):
            return Response({"success": "Email is verified."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Incorrect OTP code. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def reset_password(request):
    try:
        data = request.data.get("data")
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm')
        
        if password != confirm_password:
            return Response({"error", "Password does not match"}, status=400)
        
        else:     
            user = CustomUser.objects.get(email = email)
            user.set_password(password)
            user.save()
            return Response({"success": "Password has been reset successfully."}, status=200)

    except Exception as e:
        return Response({"error": "Something Went Wrong"}, status=500)


@api_view(["POST"])
def user_register(request):
    try:
        
        data = request.data.get("data")
        email = data.get("email")
        print(email)
        purpose = "register"
        
        if CustomUser.objects.filter(email = email).exists():
            return Response({"error": "Email is already registered"}, status= status.HTTP_403_FORBIDDEN)
        
        cache_key = f"{email}_{purpose}"
        message = "Your OTP for verification"
        subject = f"Your  Verification Code for Account Registration"
        otp_generated = send_otp_to_email(email, message,subject)
        OTP_EXPIRATION_TIME = 120  
        cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)
        
        return Response({"success":" Registration successful"}, status = status.HTTP_200_OK)
        
    except Exception as e:
        print(f"{e}")

    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_out_user(request):
    try:
        refresh_token = request.data.get("refresh")  
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist() 
    
        logout(request)
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)        


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    
    try:
       user = request.user
       serializer = CustomUserSerializer(user)
      
       return Response(serializer.data, status=status.HTTP_200_OK)
        
        
        
    except Exception as e:
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_verify_details(request):
    try:
        
        user =request.user.id
       
        request_data = VerificationRequests.objects.get(user=user)
  
        serializer = VerificationRequestsSerializer(request_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    try:
        user = request.user.id
        
      
        request_data = Notification.objects.filter(user=user).order_by('-created_at')
  
        serializer = NotificationSerializer(request_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    try:
        user = request.user
      
        notifications = Notification.objects.filter(user=user)

        notifications.update(is_read=True)

    
       
        return Response({"success" :"Mark all as read"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

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