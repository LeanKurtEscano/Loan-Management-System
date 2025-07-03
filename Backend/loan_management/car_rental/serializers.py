from rest_framework import serializers
from .models import CarLoanApplication



class CarLoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarLoanApplication
        fields = '__all__' 
        
   