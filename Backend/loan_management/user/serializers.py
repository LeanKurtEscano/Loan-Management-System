from rest_framework import serializers
from .models import CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "middle_name", "last_name","email","contact_number","address","is_verified"]
        