from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
# Create your views here.
from rest_framework import status
import requests

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cars(request):
    try:
       
        response = requests.get('https://api.example.com/available-cars') 

 
        if response.status_code == 200:
            data = response.json()
            return Response({"cars": data.get('cars', [])}, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": f"External API returned {response.status_code}: {response.text}"
            }, status=status.HTTP_502_BAD_GATEWAY)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
    
   
    
    