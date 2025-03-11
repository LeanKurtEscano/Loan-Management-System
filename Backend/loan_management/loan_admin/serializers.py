from user.models import VerificationRequests
from rest_framework import serializers


class VerificationRequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequests
        fields = '__all__'