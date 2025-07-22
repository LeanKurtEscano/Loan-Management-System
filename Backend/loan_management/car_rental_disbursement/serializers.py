from user.serializers import CustomUserSerializer
from rest_framework import serializers
from car_rental.models import CarLoanDisbursement, CarLoanPayments
from car_rental.serializers import CarLoanDisbursementFullSerializer




class FullCarLoanPaymentSerializer(serializers.ModelSerializer):
    # Add disbursement fields
    
    disbursement = CarLoanDisbursementFullSerializer(read_only=True)
    class Meta:
        model = CarLoanPayments
        fields = '__all__'