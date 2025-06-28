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
       """
        response = requests.get('https://api.example.com/available-cars') 

 
        if response.status_code == 200:
            data = response.json()
            return Response({"cars": data.get('cars', [])}, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": f"External API returned {response.status_code}: {response.text}"
            }, status=status.HTTP_502_BAD_GATEWAY)
        """
        
       mock_cars_data = [
    {
        "id": 1,
        "car_id": 101,
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "color": "Silver",
        "license_plate": "ABC123",
        "loan_sale_price": 1250000,
        "commission_rate": 0.05,
        "date_offered": "2024-01-15T10:30:00",
        "description": "Well-maintained sedan with low mileage, perfect for family use",
        "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop"
    },
    {
        "id": 2,
        "car_id": 102,
        "make": "Honda",
        "model": "Civic",
        "year": 2023,
        "color": "White",
        "license_plate": "DEF456",
        "loan_sale_price": 980000,
        "commission_rate": 0.045,
        "date_offered": "2024-01-20T14:15:00",
        "description": "Sporty and fuel-efficient, ideal for city driving",
        "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop"
    },
    {
        "id": 3,
        "car_id": 103,
        "make": "Nissan",
        "model": "Altima",
        "year": 2021,
        "color": "Black",
        "license_plate": "GHI789",
        "loan_sale_price": 1100000,
        "commission_rate": 0.055,
        "date_offered": "2024-01-18T09:45:00",
        "description": "Luxurious interior with advanced safety features",
        "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop"
    },
    {
        "id": 4,
        "car_id": 104,
        "make": "Hyundai",
        "model": "Elantra",
        "year": 2023,
        "color": "Blue",
        "license_plate": "JKL012",
        "loan_sale_price": 850000,
        "commission_rate": 0.04,
        "date_offered": "2024-01-22T16:20:00",
        "description": "Brand new with warranty, excellent fuel economy",
        "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop"
    },
    {
        "id": 5,
        "car_id": 105,
        "make": "Mazda",
        "model": "CX-5",
        "year": 2022,
        "color": "Red",
        "license_plate": "MNO345",
        "loan_sale_price": 1450000,
        "commission_rate": 0.06,
        "date_offered": "2024-01-25T11:30:00",
        "description": "SUV with spacious interior and all-wheel drive",
        "image_url": "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&h=300&fit=crop"
    },
    {
        "id": 6,
        "car_id": 106,
        "make": "Subaru",
        "model": "Outback",
        "year": 2021,
        "color": "Green",
        "license_plate": "PQR678",
        "loan_sale_price": 1320000,
        "commission_rate": 0.052,
        "date_offered": "2024-01-28T13:45:00",
        "description": "Adventure-ready with excellent ground clearance",
        "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop"
    }
]
       
       return Response({"cars": mock_cars_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching car data: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
    
   
    
    