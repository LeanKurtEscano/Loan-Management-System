from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
# Create your views here.
from rest_framework import status
import requests
from car_rental.models import CarLoanDisbursement
from car_rental.serializers import CarLoanDisbursementSerializer
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar
from loan_admin.models import AdminNotification
from django.utils import timezone 
from dateutil.relativedelta import relativedelta  



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
