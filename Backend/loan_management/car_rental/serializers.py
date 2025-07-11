from rest_framework import serializers
from .models import CarLoanApplication, CarLoanDisbursement, CarLoanPayments



class CarLoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarLoanApplication
        fields = '__all__' 
        


class CarLoanDisbursementSerializer(serializers.ModelSerializer):
    # Add application fields
    first_name = serializers.CharField(source='application.first_name', read_only=True)
    last_name = serializers.CharField(source='application.last_name', read_only=True)
    car_id = serializers.IntegerField(source='application.car_id', read_only=True)
    
    class Meta:
        model = CarLoanDisbursement
        fields = '__all__'


class CarLoanPaymentSerializer(serializers.ModelSerializer):
    # Add disbursement fields
  
    
    class Meta:
        model = CarLoanPayments
        fields = '__all__'



class CarLoanDisbursementFullSerializer(serializers.ModelSerializer):
    application = CarLoanApplicationSerializer(read_only=True)  # nested serializer

    class Meta:
        model = CarLoanDisbursement
        fields = '__all__'
