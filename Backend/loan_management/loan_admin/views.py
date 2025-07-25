from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate,logout
from user.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
import os
from user.serializers import CustomUserSerializer
from django.core.cache import cache
from .serializers import VerificationRequestsSerializer
from user.models import VerificationRequests
from user.email.emails import send_otp_to_email
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user.models import VerificationRequests, CustomUser
from .serializers import VerificationRequestsSerializer
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from user.models import CustomUser,Notification
from .models import AdminNotification
from .serializers import AdminNotificationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import timedelta
from django.utils import timezone
from loan.models import LoanSubmission
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_verification(request):
    try:
        id = request.data.get("id")
        if not id:
            return Response({"error": "ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        
        verification = get_object_or_404(VerificationRequests, id=int(id))
        
    
        user = verification.user
        user.is_verified = "not applied"
        user.save()

        verification.delete()

        return Response({"success": "Verification application rejected"}, status=status.HTTP_200_OK)


    except Exception as e:
        print(f"{e}")
        return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_user(request):
    try:
        id = request.data.get("id") 
        user_id = request.data.get("user")
        
        verification = get_object_or_404(VerificationRequests, id=int(id))
        user = get_object_or_404(CustomUser, id=int(user_id))

        verification.status = "Approved"
        verification.save() 
        user.is_verified = "verified"
        user.first_name = verification.first_name
        user.middle_name = verification.middle_name
        user.last_name = verification.last_name
       
        user.save()  

        # Email
        subject = "You're now verified!"
        html_content = render_to_string("email/verification_success.html", {
            "username": user.username,
            "account_link": "http://localhost:5173/user/account"
        })
        plain_message = strip_tags(html_content)
        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        # In-app Notification
        notification_message = "Your identity has been successfully verified. You now have full access to all features."
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Approved"
        )

        # WebSocket Real-time Notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user.id}',
            {
                'type': 'send_notification',
                'notification': {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': notification.is_read,
                    'created_at': str(notification.created_at),
                }
            }
        )

        return Response({
            "success": "User Verified and email sent!"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"{e}")
        return Response({
            "error": "Something went wrong",
            "details": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
   
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_verify_data(request):
    try:
        data = VerificationRequests.objects.all()
        serializer = VerificationRequestsSerializer(data, many=True)
        
        return Response({
            "success": "Data Sent",
            "data": serializer.data  
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": "Something went wrong",
            "details": str(e)  
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_verify(request,id):
    try:
        data = VerificationRequests.objects.get(id = int(id))
        serializer = VerificationRequestsSerializer(data)
        
        return Response(
          serializer.data  
        , status=status.HTTP_200_OK)

    except Exception as e:
        print(f"{e}")
        return Response({
            "error": "Something went wrong",
            "details": str(e)  
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
@permission_classes([IsAuthenticated])
def log_out_admin(request):
    try:
        refresh_token = request.data.get("refresh")  
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist() 
    
        logout(request)
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)        

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
    
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_user_verification(request):
    try:
        id = request.data.get("id")
        subject_heading = request.data.get("subject")
        desc = request.data.get("description")

        loan_app = VerificationRequests.objects.get(id=int(id))
        loan_app.status = "Rejected"
        loan_app.save()
        
        user = loan_app.user
        user.is_verified = "rejected"
        user.save()

       
        subject = "Your Account Verification Was Unsuccessful"
        html_content = render_to_string("email/rejection_email.html", {
            "subject": subject_heading,
            "user_name": user.username,
            "description": desc
        })
        plain_message = strip_tags(html_content)

        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

    
        notification_message = f"Your verification was rejected: {subject_heading}"

        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False ,
            status = "Rejected"
        )

       
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
             f'notifications_{user.id}',
            {
                'type': 'send_notification',
                'notification': {
                'id': notification.id,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': str(notification.created_at),
               
            }
            }
        )

        return Response({"success": "Loan Application has been rejected"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(["POST"])
def admin_email(request):
    try:
        email = request.data.get('email')
        print(email)
        
        # Check if the email exists and is associated with an admin user
        admin_user_exists = CustomUser.objects.filter(email=email, is_admin=True).exists()
        
        if not admin_user_exists:
            return Response({"error": "Admin Email is not registered or not an admin user"}, status=404)
        
        purpose = "reset_password_admin"       
        message = "Your OTP for Reset Password"
        subject = "Your Verification Code for Password Reset."
        cache_key = f"{email}_{purpose}"
        
        # Generate and send the OTP
        otp_generated = send_otp_to_email(email, message, subject)
        OTP_EXPIRATION_TIME = 120 
        cache.set(cache_key, otp_generated, OTP_EXPIRATION_TIME)
        
        return Response({"message": "OTP sent successfully."}, status=200)
    
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=500)
    
    
    



@api_view(["POST"])
def verify_password_reset_admin_otp(request):
    try:
        
        data = request.data.get("data")
        email = data.get("email")
        otp_code = data.get("otpCode")
        purpose = "reset_password_admin"
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
def reset_admin_password(request):
    try:
        data = request.data.get("data")
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm')
        
        if password != confirm_password:
            return Response({"error", "Password does not match"}, status=400)
        
        else:     
            user = CustomUser.objects.get(email = email,is_admin = True)
            user.set_password(password)
            user.save()
            return Response({"success": "Password has been reset successfully."}, status=200)

    except Exception as e:
        return Response({"error": "Something Went Wrong"}, status=500)


@api_view(["POST"])
def resend_otp(request):
    try:
        
        email = request.data.get("email")
        purpose = request.data.get("purpose") 
        user = CustomUser.objects.filter(email=email,is_admin = True).first()
    
     
        messages = {
            "verification": "Your OTP for account verification.",
            "reset_password": "Your OTP for password reset."
        }
        
        subject_dynamic = {
            "verification": "Login",
            "reset_password_admin": "Reset Password"
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





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_admin_details(request):
    
    try:
       admin  = CustomUser.objects.filter(is_admin=True).first()
      
       if not admin:
            return Response({"error": "No admin found"}, status=status.HTTP_404_NOT_FOUND)
       
       serializer = CustomUserSerializer(admin)
       print(serializer.data)
       return Response(serializer.data, status=status.HTTP_200_OK)
        
        
        
    except Exception as e:
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    







@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    try:
        user = request.user.id
        
      
        request_data = AdminNotification.objects.filter(user=user).order_by('-created_at')
  
        serializer = AdminNotificationSerializer(request_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_notification(request,id):
    try:
        user = request.user.id
        
      
        request_data = AdminNotification.objects.get(user = user, id = id)
        request_data.delete()
  
    
        return Response({"success": "notification deleted"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_details(request, id):
    try:
        user = request.user.id
        request_data = AdminNotification.objects.get(user=user, id=int(id))
        serializer = AdminNotificationSerializer(request_data)
        
        # Add email to the serialized data
        data_with_email = serializer.data.copy()
        data_with_email["email"] = request_data.user.email

        return Response({"data": data_with_email}, status=status.HTTP_200_OK)
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
      
        notifications = AdminNotification.objects.filter(user=user)

        notifications.update(is_read=True)

    
       
        return Response({"success" :"Mark all as read"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_users_and_blacklist(request):
    now = timezone.now()
    five_months_ago = now - timedelta(days=150)

    users_to_check = CustomUser.objects.filter(last_login__lte=five_months_ago, is_blacklisted=False)

    blacklisted_count = 0

    for user in users_to_check:
        submissions = LoanSubmission.objects.filter(user=user, is_fully_paid=False)
        for submission in submissions:
            if submission.no_penalty_delay is not None and submission.no_penalty_delay >= 5:
                user.is_blacklisted = True
                user.blacklisted_date = now
                user.save()
                blacklisted_count += 1
                break

    return Response({"message": "Blacklist check complete", "blacklisted_users": blacklisted_count})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_read(request, id):
    try:
        user = request.user
        notification = AdminNotification.objects.filter(user=user, id=int(id)).first()

        if not notification:
            return Response(
                {"error": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if notification.is_read:
            return Response(
                {"message": "Notification already marked as read."},
                status=status.HTTP_200_OK
            )

        notification.is_read = True
        notification.save()

        return Response(
            {"success": "Notification marked as read."},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {"error": f"Unexpected error: {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
