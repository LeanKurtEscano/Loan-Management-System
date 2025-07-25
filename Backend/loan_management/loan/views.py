from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework import status
from .models import LoanTypes, LoanPlan, LoanApplication, LoanSubmission
from .serializers import LoanTypesSerializer, LoanPlansSerializer,LoanAppSerializer,LoanSubSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import LoanApplicationSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from .models import LoanApplication
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail, EmailMultiAlternatives
from datetime import  timedelta
from dateutil.relativedelta import relativedelta
from rest_framework.decorators import api_view, permission_classes
from .models import LoanApplication
import cloudinary.uploader
import locale
from user.serializers import CustomUserSerializer
from user.models import CustomUser
from datetime import datetime
from decimal import Decimal
from .serializers import AccountDetailSerializer
from user.models import CustomUser,Notification
from dateutil.relativedelta import relativedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from loan_admin.models import AdminNotification

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_loan_disbursement(request):
    try:
        id = request.data.get("id")
        loan_sub = LoanSubmission.objects.get(id=int(id))
        loan_sub.status = "Approved"
        loan_sub.start_date = datetime.now() 
        loan_sub.balance = Decimal(loan_sub.total_payment)
        loan_sub.save()
        
        user = loan_sub.user
        user.is_borrower = True
        user.save()

        subject = "Your Loan Has Been Approved"
        html_content = render_to_string("email/loandisbursementsuccess.html", {
            "cashout": loan_sub.cashout,
            "loan_amount": loan_sub.loan_amount,
            "interest": loan_sub.loan_app.interest,
            "start_date": loan_sub.start_date,
            "end_date": loan_sub.repay_date
        })
        plain_message = strip_tags(html_content)

        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        # Create notification
        notification_message = f"Your disbursement amount request of ₱{loan_sub.loan_amount} has been approved."

        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Approved"
        )

        # Send real-time WebSocket notification
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

        return Response({"success": "Loan Disbursement has been approved"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def loan_types_list(request):
    loan_types = LoanTypes.objects.all()
    serializer = LoanTypesSerializer(loan_types, many=True)
    return Response(serializer.data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def loan_plans_list(request):
    loan_plans = LoanPlan.objects.all()
    serializer = LoanPlansSerializer(loan_plans, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser]) 
def create_loan_application(request):
    try:
        data = request.data
        print("Received Data:", data)
        id_type = data.get("idType", "")
        education_level = data.get("educationLevel", "")
        employment_status = data.get("employmentStatus", "")
        monthly_income = data.get("monthlyIncome", "")
        income_variation = data.get("incomeVariation", "")
        primary_income_source = data.get("primaryIncomeSource", "")        
        other_sources_of_income = data.getlist("otherSourcesOfIncome[]")
        combined_sources = ", ".join(other_sources_of_income)
    
        income_frequency = data.get("incomeFrequency", "")
        primary_source = data.get("primarySource", "")
        money_receive = data.get("moneyReceive", "")
        total_spend = data.get("totalSpend", "")
        outstanding = data.get("outstanding", "")
        purpose = data.get("purpose", "")
        explanation = data.get("explanation", "")

        # Handle image uploads to Cloudinary
        front_image_url = ""
        back_image_url = ""

        if 'front' in request.FILES:
            front_image = request.FILES['front']
            upload_front = cloudinary.uploader.upload(front_image)
            front_image_url = upload_front.get("secure_url")

        if 'back' in request.FILES:
            back_image = request.FILES['back']
            upload_back = cloudinary.uploader.upload(back_image)
            back_image_url = upload_back.get("secure_url")

        # Create the LoanApplication entry in the database
        loan_application = LoanApplication.objects.create(
            user=request.user,
            front=front_image_url,
            back=back_image_url,
            id_type=id_type,
            education_level=education_level,
            employment_status=employment_status,
            monthly_income=monthly_income,
            income_variation=income_variation,
            primary_income_source=primary_income_source,
            other_sources_of_income=combined_sources,
            income_frequency=income_frequency,
            primary_source=primary_source,
            money_receive=money_receive,
            total_spend=total_spend,
            outstanding=outstanding,
            purpose=purpose,
            explanation=explanation
        )
        notification_message = f"New loan application submitted by {request.user.username}."
        print(notification_message)
        
        admin = CustomUser.objects.filter(is_admin=True).first()
        
        
        notification = AdminNotification.objects.create(
            user=admin,
            message=notification_message,
            is_read=False,
        )

        # Send real-time WebSocket notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{admin.id}',
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
        
        loan_application.status = "Pending"
        loan_application.is_active = True
        loan_application.save()
        
        return Response({"message": "Loan Application submitted successfully."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser]) 
def create_loan_submission(request):
    try:
        data = request.data
        print(data)

      
        upload_selfie = None
        if 'idSelfie' in request.FILES:
            id_selfie = request.FILES['idSelfie']
            upload_back = cloudinary.uploader.upload(id_selfie)
            upload_selfie = upload_back.get("secure_url")

      
        loan_id = data.get("loanId")
        loan_amount = data.get("loanAmount", 0)
        cashout = data.get("cashout", "")
        total_payment = data.get("totalPayment", 0)
        frequency = data.get("paymentFrequency")
        contact_number = data.get("contactNumber")

      
        user = request.user
        loan_app = LoanApplication.objects.get(id=int(loan_id))

        loan_submission = LoanSubmission.objects.create(
            user=user,
            loan_app=loan_app,
            id_selfie=upload_selfie,
            repay_date=loan_app.end_date,
            loan_amount=Decimal(loan_amount),
            cashout=cashout,
            total_payment=Decimal(total_payment),
            frequency = frequency,
            contact_number = contact_number
         
        )
        
        
        notification_message = f"New loan submission request from {user.username}."
        
        
        admin = CustomUser.objects.filter(is_admin=True).first()
        
        notification = AdminNotification.objects.create(
            user = admin,
            message = notification_message,
            is_read = False
        )
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            
            f'notifications_{admin.id}', {
                'type': 'send_notification',
                'notification': {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': notification.is_read,
                    'created_at': str(notification.created_at),
                }
            }
        )
        
        loan_submission.is_active = True
        loan_submission.save()

        return Response({
            "message": "Loan Application submitted successfully.",
            "submission_id": loan_submission.id
        }, status=status.HTTP_201_CREATED)

  
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_loan_applications(request):
    try:
      
        loan_applications = LoanApplication.objects.all()
        serializer = LoanApplicationSerializer(loan_applications, many=True)
       
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_loan_submissions(request):
    try:
      
        loan_sub = LoanSubmission.objects.all()
        serializer = LoanSubSerializer(loan_sub, many=True)
       
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)
    
   

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_application(request,id):
    try:
      
        loan_applications = LoanApplication.objects.get(id = int(id))
        serializer = LoanApplicationSerializer(loan_applications)
       
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_submission(request,id):
    try:
      
        loan_applications = LoanSubmission.objects.get(id = int(id))
        serializer = LoanSubSerializer(loan_applications)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_loan_application(request):
    try:
        id = request.data.get("id")
        loan_amount = request.data.get("loanAmount")
        interest = request.data.get("interest")
        duration = request.data.get("duration")

        application = get_object_or_404(LoanApplication, id=int(id))

        application.loan_amount = Decimal(loan_amount)
        application.interest = int(interest)
        application.status = "Approved"
        application.end_date = datetime.now() + relativedelta(months=int(duration))
        application.duration = f"{int(duration)} months"
        application.save()

        user = application.user
        locale.setlocale(locale.LC_ALL, 'en_PH.UTF-8')
        formatted_loan_amount = f"₱{float(application.loan_amount):,.2f}"

        subject = "Your Loan Application Has Been Approved!"
        html_content = render_to_string("email/loanapplication_success.html", {
            "loan_amount": formatted_loan_amount,
            "interest": application.interest,
        })
        plain_message = strip_tags(html_content)

        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        # Create in-app notification
        notification_message = f"Your loan application has been approved for {formatted_loan_amount}."
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Approved"
        )

        # Send WebSocket notification
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
            "success": "Loan application verified",
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_loan_application(request):
    try:
        
        
        id = request.data.get("id")
        
        print(id)
        loan_application = LoanApplication.objects.get(id = int(id))
        loan_application.delete()

        
        
        return Response({"success": "Loan Application has been rejected"}, status= status.HTTP_200_OK)
        
        
    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    
 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_loan_submission(request):
    try:
                
        id = request.data.get("id")
        print(id)
        
        loan_application = LoanSubmission.objects.get(id = int(id))
        loan_application.delete()

        
        
        return Response({"success": "Loan Application has been rejected"}, status= status.HTTP_200_OK)
        
        
    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    try:
                
        id = request.data.get("id")
        
        user = CustomUser.objects.get(id = int(id))
        user.delete()

        
        
        return Response({"success": "Loan Application has been rejected"}, status= status.HTTP_200_OK)
        
        
    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
              
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_loan_application(request):
    try:
        id = request.data.get("id")
        subject_heading = request.data.get("subject")
        desc = request.data.get("description")

        loan_app = LoanApplication.objects.get(id=int(id))
        loan_app.status = "Rejected"
        loan_app.is_active = False
        loan_app.save()

        user = loan_app.user

        subject = "Your Loan Application Has Been Rejected"
        html_content = render_to_string("email/rejection_email.html", {
            "subject": subject_heading,
            "user_name": user.username,
            "description": desc
        })
        plain_message = strip_tags(html_content)

        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        # Create in-app notification
        notification_message = f"Your loan application has been rejected: {subject_heading}"
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Rejected"
        )

        # Send WebSocket notification
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
@permission_classes([IsAuthenticated])
def reject_loan_submission(request):
    try:
        id = request.data.get("id")
        subject_heading = request.data.get("subject")
        desc = request.data.get("description")

        loan_app = LoanSubmission.objects.get(id=int(id))
        loan_app.status = "Rejected"
        loan_app.is_active = False
        loan_app.save()

        user = loan_app.user

        subject = "Your Loan Disbursement Has Been Rejected"
        html_content = render_to_string("email/rejection_email.html", {
            "subject": subject_heading,
            "user_name": user.username,
            "description": desc
        })
        plain_message = strip_tags(html_content)

        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

        # In-app notification
        notification_message = f"Your loan disbursement request was rejected: {subject_heading}"
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Rejected"
        )

        # WebSocket broadcast
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

        return Response({"success": "Loan Disbursement has been rejected"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def loan_application(request):
    try:
        
        user = request.user
        loan_applications = LoanApplication.objects.get(user=request.user, is_active = True)
        serializer = LoanAppSerializer(loan_applications)
        
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def loan_submission(request):
    try:
        
        user = request.user
     
        
        loan_applications = LoanSubmission.objects.get(user=request.user,is_fully_paid =False, is_active = True)
        serializer = LoanSubSerializer(loan_applications)
        
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)
    
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users(request):
    try:
        users = CustomUser.objects.filter(is_admin=False)
        serializer = CustomUserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    
@api_view(['GET'])
def account_detail_view(request, id):
    try:
        user = CustomUser.objects.get(id=id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AccountDetailSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)