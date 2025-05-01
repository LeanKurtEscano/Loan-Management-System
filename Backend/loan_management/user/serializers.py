from rest_framework import serializers
from .models import CustomUser, VerificationRequests,Notification


class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "middle_name", "last_name","email","contact_number","address","is_verified","is_borrower","is_good_payer"]


class VerificationRequestsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VerificationRequests
        fields = '__all__'
 
 
class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = '__all__'
               