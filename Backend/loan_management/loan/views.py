from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import LoanTypes, LoanPlan, LoanApplication
from .serializers import LoanTypesSerializer, LoanPlansSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import LoanApplicationSerializer
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from .models import LoanApplication
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail, EmailMultiAlternatives
from datetime import  timedelta


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
def create_loan_application(request):
    try:
        data = request.data
        
        loan_application = LoanApplication.objects.create(
            id_number=data['idNumber'],
            employment_status=data['employment'],
            income_range=data['income'],
            amount=float(data['amount']),
            user=request.user,
            type_id=int(data['type']) if data.get('type') else None,
            plan_id=int(data['plan']) if data.get('plan') else None
        )

        return Response({"message": "Loan Application submitted successfully."}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_loan_applications(request):
    try:
      
        loan_applications = LoanApplication.objects.filter(user=request.user)
        serializer = LoanApplicationSerializer(loan_applications, many=True)
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
        print(serializer.data)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(f"{e}")
        return Response({"error": str(e)}, status=400)
    
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_loan_application(request) :
    
    try:
        id = request.data.get("id")
        print(id)
       
        application = get_object_or_404(LoanApplication, id=int(id))

        repayment_term = int(application.plan.repayment_term)

        user = application.user
        end_date = now() + timedelta(days=repayment_term * 30)

        application.status = "Approved"
        application.end_date = end_date
        application.save()
        
        formatted_end_date = end_date.strftime("%B %d, %Y")

        print(formatted_end_date)
        
        subject = "You're Loan Application has been approved!"
        html_content = render_to_string("email/loanapplication_success.html", {
            "loan_type":application.type.name,
            "end_date": formatted_end_date,
            "repayment_term": application.plan.repayment_term,
            "payment_frequency": application.plan.payment_frequency,
            "interest":application.plan.interest,
        })
        plain_message = strip_tags(html_content)

    
        email = EmailMultiAlternatives(subject, plain_message, "noreply.lu.tuloang.@gmail.com", [user.email])
        email.attach_alternative(html_content, "text/html")
        email.send()

      
       

        return Response({
            "success": "Loan application verified",
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
