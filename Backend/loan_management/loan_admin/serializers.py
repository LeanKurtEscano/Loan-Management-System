from user.models import VerificationRequests
from rest_framework import serializers
from loan_admin.models import AdminNotification

class VerificationRequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequests
        fields = '__all__'
        
        
class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = '__all__'