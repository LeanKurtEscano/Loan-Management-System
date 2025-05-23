from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.timezone import now
from decimal import Decimal
import cloudinary.uploader
from .serializers import LoanDisbursementSerializer, LoanPaymentsSerializer
from user.models import CustomUser
from loan.models import LoanSubmission
from .models import LoanPayments
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils import timezone
from .utils import extract_duration
from datetime import datetime, timedelta
from django.db.models import Sum
from user.models import CustomUser,Notification
import re
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar


from decimal import Decimal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_penalty(request):
   
    penalty_amount = Decimal(request.data.get('penalty', '0'))
    no_penalty_delay = int(request.data.get('no_penalty_delay', 0))
  

    today = timezone.now().date()

    try:
        loan = LoanSubmission.objects.get(user=request.user, is_fully_paid=False, is_active=True)

        if loan.last_penalty_update is None or (today - loan.last_penalty_update).days >= 30:
            if no_penalty_delay > 0:
                # Safely initialize penalty and delay fields if they are None
                loan.penalty = (loan.penalty or Decimal('0.00')) + penalty_amount
                loan.no_penalty_delay = (loan.no_penalty_delay or 0) + no_penalty_delay
                loan.last_penalty_update = today
                loan.save()

                # Mark user as not a good payer
                user = loan.user
                user.is_good_payer = False
                user.save()

                return Response({'message': 'Penalty updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No penalty delay to apply'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Penalty has already been applied this month'}, status=status.HTTP_400_BAD_REQUEST)

    except LoanSubmission.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])  
def handle_loan_payments(request):
    try:
        email = request.data.get("email", None)
        
        # Extract periodPayment values correctly
        period_payment = {
            "label": request.data.get("periodPayment[label]", ""),
            "amount": request.data.get("periodPayment[amount]", ""),
            "duration": request.data.get("periodPayment[duration]", ""),
        }
        
      
        
        unit = extract_duration(period_payment["label"])
        print(unit)
        
        print(period_payment["amount"])

        receipt = request.FILES.get("receipt", None)
        
        disbursement_id = request.data.get("disbursementId")
        print(disbursement_id)
        print("Received email:", email)
        print("Received periodPayment:", period_payment)
        print("Received receipt:", receipt)
      
         
         
         
        
        
        upload_result = cloudinary.uploader.upload(receipt)
        receipt_url = upload_result.get("secure_url")
        loan_sub = LoanSubmission.objects.get(id = int(disbursement_id))
        
        is_penalty = False
        if loan_sub.no_penalty_delay and loan_sub.no_penalty_delay > 0:
          is_penalty = True

        loan_payment = LoanPayments.objects.create(
            user=request.user,
            loan = loan_sub,
            amount= Decimal(period_payment["amount"]),
            period=unit,
            receipt=receipt_url,
            is_penalty = is_penalty
        )
        

        return Response({
            "success": "Loan Payment has been received",
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def loan_disbursement_list(request):
    loan_payments = LoanPayments.objects.all()
    serializer = LoanDisbursementSerializer(loan_payments, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_payment(request,id):
    try:
      
        loan_applications = LoanPayments.objects.get(id = int(id))
     
        serializer = LoanDisbursementSerializer(loan_applications)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_loan_payment(request):
    try:
        id = request.data.get("id")
        penalty_amount = request.data.get("penaltyAmount")    
        penalty_decimal = Decimal(penalty_amount) if penalty_amount not in [None, ""] else Decimal("0.00")
        loan_payment = LoanPayments.objects.get(id=int(id))
        loan_payment.penalty_fee = penalty_decimal
        
        loan_sub = loan_payment.loan 

        loan_payment.status = "Approved"
        loan_payment.save()
        
        if loan_sub.no_penalty_delay and loan_sub.no_penalty_delay > 0:
           months_deduct = int(re.search(r'\d+', loan_payment.period).group())
           no_penalty_delay_value = int(loan_sub.no_penalty_delay)
   
           loan_sub.no_penalty_delay = max(0, no_penalty_delay_value - months_deduct)
         
        if penalty_decimal > Decimal("0.00"):
            loan_sub.penalty -= penalty_decimal
            loan_payment.is_penalty = True
        loan_sub.balance -= Decimal(loan_payment.amount)

        user = loan_payment.user
        notification_message = f"Your loan payment of ₱{loan_payment.amount} has been approved."
        
        
        loan_penalty_count = LoanPayments.objects.filter(loan=loan_sub, is_penalty=True).count()
        
        if loan_sub.balance.quantize(Decimal("0.00")) == Decimal("0.00"):
            loan_sub.is_celebrate = True
            user.is_borrower = False  
          
            
            
            if loan_penalty_count > 0:
              user.is_good_payer = False
            else:
              user.is_good_payer = True
              
            user.save()
            

            subject = "Your Loan is Fully Paid!"
            html_content = render_to_string("email/loanfullypaid.html", {
                'username': user.username,
                'loan_amount': loan_payment.loan.total_payment,
                'interest': loan_sub.loan_app.interest,
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def new_loan(request):
    try:
        loan_sub = LoanSubmission.objects.get(user=request.user ,is_fully_paid =False, is_active = True)
    
        loan_sub.is_fully_paid = True
        loan_sub.is_active = False
        loan_sub.is_celebrate = False
        loan_sub.loan_app.is_active = False
        loan_sub.loan_app.save() 
        
        loan_sub.save() 
        
        return Response({"success": "USer can have new loan payment"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_transactions(request):
    try:
 
        user_loans = LoanPayments.objects.filter(user=request.user)
    
        serializer = LoanDisbursementSerializer(user_loans, many=True)
        
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)
    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_loan_payments(request):
    try:
        
        
        id = request.data.get("id")
        
        print(id)
        loan_payment = LoanPayments.objects.get(id = int(id))
        loan_payment.delete()

        
        
        return Response({"success": "Loan Payment has been deleted"}, status= status.HTTP_200_OK)
        
        
    except Exception as e:
        print(f"{e}")
        return Response({"error": f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    
 

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_loan_payment(request):
    try:
        
        
        id = request.data.get("id")
        subject_heading = request.data.get("subject")
        
        desc = request.data.get("description")
        
        loan_payment = LoanPayments.objects.get(id = int(id))
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
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_transaction(request,id):
    try:
      
        loan_applications = LoanPayments.objects.get(id = int(id))
        serializer = LoanDisbursementSerializer(loan_applications)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   
    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_payment_data(request):
    try:
      
        loan_disbursement = LoanSubmission.objects.get(user=request.user ,is_fully_paid =False, is_active = True)
        loan_payments = LoanPayments.objects.filter(loan=loan_disbursement , status = "Approved")
        serializer = LoanPaymentsSerializer(loan_payments, many=True)

        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   
    




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_user_payment_data(request,id):
    try:
      
        loan_disbursement = LoanSubmission.objects.get(id=int(id))
        loan_payments = LoanPayments.objects.filter(loan=loan_disbursement)
        serializer = LoanPaymentsSerializer(loan_payments, many=True)

        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)   
    

QUARTER_MONTHS = {
    'q1': ['January', 'February', 'March'],
    'q2': ['April', 'May', 'June'],
    'q3': ['July', 'August', 'September'],
    'q4': ['October', 'November', 'December'],
}

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    try:
        
        selected_year = request.query_params.get('year', '2025')
        months_param = request.query_params.get('months', '')

   
        year = int(selected_year)
        month_names = [month.strip() for month in months_param.split(',') if month.strip()]

        # --- Line Chart ---
        line_chart_data = []
        for month in month_names:
            try:
                month_number = datetime.strptime(month, '%B').month
                total_amount = LoanSubmission.objects.filter(
                    created_at__year=year,
                    created_at__month=month_number
                ).aggregate(total=Sum('loan_amount'))['total'] or 0

                line_chart_data.append({
                    'month': month,
                    'total_amount': float(total_amount)
                })
            except ValueError:
                continue  # Skip invalid month strings

        # --- Stats Cards ---
        active_loans_count = LoanSubmission.objects.filter(is_active=True).count()
        total_borrowers = CustomUser.objects.filter(is_borrower=True, is_admin=False).count()
        total_users = CustomUser.objects.filter(is_admin=False).count()

        # --- Pie Chart ---
        application_statuses = {
            'Approved': LoanSubmission.objects.filter(status='Approved').count(),
            'Pending': LoanSubmission.objects.filter(status='Pending').count(),
            'Rejected': LoanSubmission.objects.filter(status='Rejected').count(),
        }

        total_applications = sum(application_statuses.values())
        pie_data = {
            'labels': list(application_statuses.keys()),
            'data': []
        }

        if total_applications > 0:
            for status, count in application_statuses.items():
                percentage = (count / total_applications) * 100
                pie_data['data'].append(round(percentage, 1))
        else:
            pie_data['data'] = [0, 0, 0]

      
        response_data = {
            'stats': {
                'active_loans': active_loans_count,
                'total_borrowers': total_borrowers,
                'total_users': total_users
            },
            'line_chart': line_chart_data,
            'pie_chart': {
                'labels': pie_data['labels'],
                'data': pie_data['data'],
            }
        }
        
        print(response_data)

        return Response(response_data, status=200)

    except Exception as e:
        return Response(
            {'error': f'Failed to fetch dashboard data: {str(e)}'},
            status=500
        )
