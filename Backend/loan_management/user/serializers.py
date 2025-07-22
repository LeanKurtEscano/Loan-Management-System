from rest_framework import serializers
from .models import CustomUser, VerificationRequests,Notification


class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = '__all__'

class VerificationRequestsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VerificationRequests
        fields = '__all__'
 
 
class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = '__all__'
               