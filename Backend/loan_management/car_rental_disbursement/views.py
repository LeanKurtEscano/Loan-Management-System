from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes,parser_classes
# Create your views here.
from rest_framework import status
import requests
from car_rental.models import CarLoanDisbursement,CarLoanApplication
from car_rental.serializers import CarLoanDisbursementSerializer,CarLoanPaymentSerializer,CarLoanApplicationSerializer
from .serializers import FullCarLoanPaymentSerializer
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar
from loan_admin.models import AdminNotification
from django.utils import timezone 
from dateutil.relativedelta import relativedelta  
from rest_framework.parsers import MultiPartParser, FormParser
from disbursement.utils import extract_duration
from car_rental.models import CarLoanDisbursement, CarLoanPayments,CarLoanCommission
from user.models import CustomUser,Notification
import cloudinary.uploader
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail, EmailMultiAlternatives
import re
from dotenv import load_dotenv
import os
load_dotenv()
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def active_car_disbursement(request):
    try:
        disbursement = CarLoanDisbursement.objects.filter(
            application__user=request.user,
            is_active=True
        ).first()
        serializer = CarLoanDisbursementSerializer(disbursement)

        if not disbursement:
            return Response({"detail": "No active disbursement found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in active_car_disbursement: {e}")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def active_car_application(request):
    try:
        application= CarLoanApplication.objects.filter(
            user=request.user,
            is_active=True,
            is_reject=False
        ).first()
        serializer = CarLoanApplicationSerializer(application)

        if not application:
            return Response({"detail": "No active disbursement found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in active_car_disbursement: {e}")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_disbursement_payment_list(request):
    try:
        disbursement = CarLoanDisbursement.objects.filter(
            application__user=request.user,
            is_active=True
        ).first()
        
        #response = requests.post(f"http://192.168.1.64:5000/api/loan/car-loan-status/", json =  {
            # disbursement_id: disbursement.id,
            # 
            # 
            # }) to be connected
        # if response.status_code != 200:
        #     return Response({"detail": "Failed to fetch car loan status."}, status=status.HTTP_400_BAD_REQUEST)
        # data = response.json()
        

        return Response("dasdasdsads", status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in car_disbursement_payment_list: {e}")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  
def handle_car_loan_payments(request):
    try:
        email = request.data.get("email", None)
        
        # Extract periodPayment values correctly
        period_payment = {
            "label": request.data.get("periodPayment[label]", ""),
            "amount": request.data.get("periodPayment[amount]", ""),
            "duration": request.data.get("periodPayment[duration]", ""),
        }
      
        unit = extract_duration(period_payment["label"]) 

        receipt = request.FILES.get("receipt", None)     
        disbursement_id = request.data.get("disbursementId")      
        upload_result = cloudinary.uploader.upload(receipt)
        receipt_url = upload_result.get("secure_url")
        loan_sub = CarLoanDisbursement.objects.get(id = int(disbursement_id))
        loan_sub.payment_status = "Pending"
        loan_sub.save()
        
        is_penalty = False
        if loan_sub.no_penalty_delay and loan_sub.no_penalty_delay > 0:
          is_penalty = True

        loan_payment = CarLoanPayments.objects.create(
            user=request.user,
            disbursement = loan_sub,
            amount= Decimal(period_payment["amount"]),
            period=unit,
            receipt=receipt_url,
            is_penalty = is_penalty,
            email=email
            
        )
         
        notification_message = f"Your Car loan payment of ₱{float(period_payment['amount']):,.2f} is being processed. We will notify you once it is verified."

        notification = Notification.objects.create(
            user=loan_sub.application.user,
            message=notification_message,
            is_read=False,
            status="Approved"
        )
        user_id = loan_sub.application.user.id
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user_id}',
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
        
        admin_notification_message = (
    f"New  Car loan payment of ₱{period_payment['amount']} made by {request.user.username}. "
    "Please review the transaction."
)
        
        admin = CustomUser.objects.filter(is_admin=True).first()
        
        
        admin_notification = AdminNotification.objects.create(
            user=admin,
            message=admin_notification_message,
            is_read=False,
        )
        
        admin_id = admin.id

        # Send real-time WebSocket notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'admin_{admin_id}',
            {
                'type': 'send_notification',
                'notification': {
                    'id': admin_notification.id,
                    'message': admin_notification.message,
                    'is_read': admin_notification.is_read,
                    'created_at': str(admin_notification.created_at),
                }
            }
        )

        return Response({
            "success": "Loan Payment has been received",
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_payment_data(request):
    try:
      
        loan_disbursement = CarLoanDisbursement.objects.get(user=request.user ,is_fully_paid =False, is_active = True)
        loan_payments = CarLoanPayments.objects.filter(disbursement=loan_disbursement , status = "Approved")
        serializer = CarLoanPaymentSerializer(loan_payments, many=True)

        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_car_user_payment(request,id):
    try:
      
        loan_payment = CarLoanPayments.objects.get(id = int(id))
     
        serializer = FullCarLoanPaymentSerializer(loan_payment)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def new_car_loan(request):
    try:
        loan_sub = CarLoanDisbursement.objects.get(application__user=request.user ,is_fully_paid =False, is_active = True)
    
        loan_sub.is_fully_paid = True
        loan_sub.is_active = False
        loan_sub.is_celebrate = False
        loan_sub.application.is_active = False
        loan_sub.application.save() 
        
        loan_sub.save() 
        
        return Response({"success": "USer can have new loan payment"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_disbursement_payments(request):
    try:
        loan_payment = CarLoanPayments.objects.filter(disbursement__application__user=request.user)
        serializer = CarLoanPaymentSerializer(loan_payment,many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    except CarLoanPayments.DoesNotExist:
        return Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_car_loan_payment(request):
    try:
        id = request.data.get("id")
        penalty_amount = request.data.get("penaltyAmount")    
        penalty_decimal = Decimal(penalty_amount) if penalty_amount not in [None, ""] else Decimal("0.00")
        loan_payment = CarLoanPayments.objects.get(id=int(id))
        loan_payment.penalty_fee = penalty_decimal
        
        loan_sub = loan_payment.disbursement

        loan_payment.status = "Approved"
        loan_sub.payment_status = None
    
        loan_payment.save()
        
        if loan_sub.no_penalty_delay and loan_sub.no_penalty_delay > 0:
           months_deduct = int(re.search(r'\d+', loan_payment.period).group())
           no_penalty_delay_value = int(loan_sub.no_penalty_delay)
   
           loan_sub.no_penalty_delay = max(0, no_penalty_delay_value - months_deduct)
         
        if penalty_decimal > Decimal("0.00"):
            loan_sub.penalty -= penalty_decimal
            loan_payment.is_penalty = True
            
            
            
        loan_sub.balance -= Decimal(loan_payment.amount)
        
        loan_sub.save()
        
        total_interest = Decimal(loan_sub.application.loan_amount) * Decimal(loan_sub.application.interest) / Decimal(100)
        
        total_amount_to_pay = Decimal(loan_sub.application.loan_amount) + total_interest
        
        commission = Decimal(loan_payment.amount) * (total_interest / total_amount_to_pay)

        
        car_rental_commission = Decimal(loan_payment.amount) - commission
        
        car_loan_commission = CarLoanCommission.objects.create(     
            payment=loan_payment,
            amount=commission,
            track_system_amount=car_rental_commission
        )
        collab_api = os.getenv('COLLAB_API')
        response = requests.post(f"{collab_api}/api/loan/receive-monthly-commission", json={
            "car_id": loan_sub.application.car_id,
            "disbursement_id": loan_sub.id,
            "commission_amount": float(car_rental_commission),
            "is_paid":True
            
        })
        
       

        user = loan_payment.user
        notification_message = f"Your loan payment of ₱{loan_payment.amount} has been approved."
        
        
        loan_penalty_count = CarLoanPayments.objects.filter(disbursement=loan_sub, is_penalty=True).count()
        
        if loan_sub.balance.quantize(Decimal("0.00")) == Decimal("0.00"):
            loan_sub.is_celebrate = True
            loan_sub.status = "Completed"
            loan_sub.save()
            if loan_penalty_count > 0:
              user.is_good_payer = False
            else:
              user.is_good_payer = True
              
            user.save()
            

            subject = "Your Loan is Fully Paid!"
            html_content = render_to_string("email/loanfullypaid.html", {
                'username': user.username,
                'loan_amount': loan_payment.disbursement.application.loan_amount,
                'interest': loan_sub.application.interest,
                'start_date': loan_sub.start_date,
                'end_date': loan_sub.repay_date,
            })
            plain_message = strip_tags(html_content)
            email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
            email.attach_alternative(html_content, "text/html")
            email.send()

          
            notification_message = "🎉 Congratulations! Your loan is fully paid."

        loan_sub.save()

   
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Approved"
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

        return Response({
            "success": "Loan Payment has been approved, balance updated, and notification sent."
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_car_loan_payment(request):
    try:
        
        
        id = request.data.get("id")
        subject_heading = request.data.get("subject")
        
        desc = request.data.get("description")
        
        loan_payment = CarLoanPayments.objects.get(id = int(id))
        loan_sub = loan_payment.disbursement
        loan_sub.payment_status = None
        loan_sub.save()
        loan_payment.status = "Rejected"
        loan_payment.save()
        user = loan_payment.user
        subject = "You're Loan Payment has been rejected"
        html_content = render_to_string("email/rejection_email.html", {
            "subject":subject_heading,
            "user_name": user.username,
            "description": desc
        })
        plain_message = strip_tags(html_content)

    
        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()


        return Response({"success": "Loan Application has been rejected"}, status= status.HTTP_200_OK)
        
        
    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)