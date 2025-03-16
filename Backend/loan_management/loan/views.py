from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import LoanTypes, LoanPlan, LoanApplication
from .serializers import LoanTypesSerializer, LoanPlansSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

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
