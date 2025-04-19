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
from .utils import extract_duration
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

        loan_payment = LoanPayments.objects.create(
            user=request.user,
            loan = loan_sub,
            amount= Decimal(period_payment["amount"]),
            period=unit,
            receipt=receipt_url
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
        loan_payment = LoanPayments.objects.get(id=int(id))
       
        loan_sub = loan_payment.loan 

        loan_payment.status = "Approved"
        loan_payment.save()
        loan_sub.balance -= Decimal(loan_payment.amount)  
        
        
        if loan_sub.balance.quantize(Decimal("0.00")) == Decimal("0.00"):
            # loan_sub.is_fully_paid = True
            #loan_sub.is_active = False
            loan_sub.is_celebrate = True
            #loan_sub.loan_app.is_active = False
            #loan_sub.loan_app.save() 
            
            user = loan_payment.user
            subject = "You're Loan is fully paid!"
            html_content = render_to_string("email/loanfullypaid.html", {
                'username': user.username,
                'amount': loan_payment.loan.total_payment,
                'interest_rate': loan_sub.loan_app.interest,
                'start_date': loan_sub.start_date,
                'end_date': loan_sub.repay_date,

            })
            
            plain_message = strip_tags(html_content)

    
            email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
            email.attach_alternative(html_content, "text/html")
            email.send()

        
        loan_sub.save() 
        
        return Response({"success": "Loan Payment has been approved, and balance updated"}, status=status.HTTP_200_OK)

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
    
       