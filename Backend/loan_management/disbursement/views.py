from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.timezone import now
from decimal import Decimal
import cloudinary.uploader
from .serializers import LoanDisbursementSerializer
from user.models import CustomUser
from loan.models import LoanSubmission
from .models import LoanPayments

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
            period=period_payment["label"],
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
        loan_sub.save() 

        return Response({"success": "Loan Payment has been approved, and balance updated"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
