from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes,parser_classes
# Create your views here.
from rest_framework import status
import requests
from car_rental.models import CarLoanDisbursement
from car_rental.serializers import CarLoanDisbursementSerializer,CarLoanPaymentSerializer
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
from car_rental.models import CarLoanDisbursement, CarLoanPayments
from user.models import CustomUser,Notification
import cloudinary.uploader
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