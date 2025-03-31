from rest_framework import serializers
from .models import LoanPayments
from loan.models import LoanSubmission
from user.serializers import CustomUserSerializer
from loan.serializers import LoanAppSerializer

class LoanSub2Serializer(serializers.ModelSerializer):
     loan_app = LoanAppSerializer(read_only = True)
     class Meta:
        model = LoanSubmission
        fields = '__all__'
    
class LoanPaymentsSerializer(serializers.ModelSerializer):
      class Meta:
        model = LoanPayments
        fields = '__all__'
        
        
class LoanDisbursementSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    loan = LoanSub2Serializer(read_only=True)
    class Meta:
        model = LoanPayments
        fields = '__all__'


