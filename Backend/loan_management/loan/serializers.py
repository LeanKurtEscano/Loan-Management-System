from rest_framework import serializers
from user.models import CustomUser
from .models import LoanPlan, LoanTypes
from rest_framework import serializers
from .models import LoanApplication, CustomUser, LoanTypes, LoanPlan, LoanSubmission
from disbursement.models import LoanPayments
from user.models import VerificationRequests
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
        
        
class LoanPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanPayments
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









class VerificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequests
        exclude = ['user']  # Exclude to avoid redundancy


class LoanSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanSubmission
        exclude = ['user', 'loan_app']


class LoanApplicationSerializer2(serializers.ModelSerializer):
    loan_submissions = serializers.SerializerMethodField()

    class Meta:
        model = LoanApplication
        exclude = ['user']

    def get_loan_submissions(self, obj):
        submissions = LoanSubmission.objects.filter(loan_app=obj)
        return LoanSubmissionSerializer(submissions, many=True).data


class AccountDetailSerializer(serializers.ModelSerializer):
    verification_request = serializers.SerializerMethodField()
    loan_applications = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'middle_name', 'last_name',
            'email', 'contact_number', 'address', 'image_url',
            'is_verified', 'is_admin', 'is_borrower',
            'verification_request', 'loan_applications'
        ]

    def get_verification_request(self, obj):
        try:
            latest_verification = VerificationRequests.objects.filter(user=obj).latest('created_at')
            return VerificationRequestSerializer(latest_verification).data
        except VerificationRequests.DoesNotExist:
            return None

    def get_loan_applications(self, obj):
        applications = LoanApplication.objects.filter(user=obj)
        return LoanApplicationSerializer2(applications, many=True).data
