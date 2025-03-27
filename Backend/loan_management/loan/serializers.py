from rest_framework import serializers
from user.models import CustomUser
from .models import LoanPlan, LoanTypes
from rest_framework import serializers
from .models import LoanApplication, CustomUser, LoanTypes, LoanPlan, LoanSubmission

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'middle_name', 'last_name']

class LoanTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanTypes
        fields = '__all__'

class LoanPlansSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanPlan
        fields = '__all__'



class LoanAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = '__all__'
        
        
class LoanSubSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)  
    loan_app = LoanAppSerializer(read_only=True) 

    class Meta:
        model = LoanSubmission
        fields = '__all__'  # You can als
class LoanApplicationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    type = LoanTypesSerializer(read_only=True)
    plan = LoanPlansSerializer(read_only=True)

    class Meta:
        model = LoanApplication
        fields = '__all__'
