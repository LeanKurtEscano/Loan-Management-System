from rest_framework import serializers
from .models import CustomUser, VerificationRequests

class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "middle_name", "last_name","email","contact_number","address","is_verified"]


class VerificationRequestsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VerificationRequests
        fields = ["id", "first_name", "middle_name", "last_name","age","birthdate","contact_number","address","status"]
        