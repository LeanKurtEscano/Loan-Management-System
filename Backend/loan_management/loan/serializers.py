from rest_framework import serializers

from .models import LoanPlan, LoanTypes

class LoanTypesSerializer(serializers.ModelSerializer):  
    class Meta:  
        model = LoanTypes  
        fields = '__all__'  

class LoanPlansSerializer(serializers.ModelSerializer):  
    class Meta:  
        model = LoanPlan  
        fields = '__all__'