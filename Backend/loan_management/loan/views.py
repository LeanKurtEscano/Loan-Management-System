from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import LoanTypes, LoanPlan, LoanApplication
from .serializers import LoanTypesSerializer, LoanPlansSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import LoanApplication
from .serializers import LoanApplicationSerializer
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

