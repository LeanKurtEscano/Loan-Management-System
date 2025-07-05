from rest_framework import serializers
from .models import CarLoanApplication, CarLoanDisbursement



class CarLoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarLoanApplication
        fields = '__all__' 
        


class CarLoanDisbursementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarLoanDisbursement
        fields = '__all__' 
        
        
   