from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
# Create your views here.
from rest_framework import status
import requests
from . models import CarLoanApplication
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar
from loan_admin.models import AdminNotification
from user.models import CustomUser

from .serializers import CarLoanApplicationSerializer
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
  
    
   
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_details(request, id):
    try:
        """
        response = requests.get(f'https://api.example.com/car-loan-details/{id}') Will change with 
        
        if response.status_code == 200:
            data = response.json()
            return Response({"car_loan_details": data}, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": f"External API returned {response.status_code}: {response.text}"
            }, status=status.HTTP_502_BAD_GATEWAY)
        """
        
        # Mock data for car loan details
        mock_car_loan_details = {
            "id": id,
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
        }
        
        return Response({"car_loan_details": mock_car_loan_details}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching car loan details: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_car_loan(request):
    try:
        data = request.data
        monthly_income = Decimal(data.get('monthlyIncome', 0))
        other_income = Decimal(data.get('otherIncome', 0) or 0)
        loanAmount = Decimal(data.get('loanAmount', 0))
        down_payment = Decimal(data.get('downPayment', 0) or 0)
        user = request.user
        # Create a new CarLoanApplication instance
        application = CarLoanApplication.objects.create(
            first_name=data.get('firstName'),
            middle_name=data.get('middleName'),
            last_name=data.get('lastName'),
            birthdate=data.get('dateOfBirth'),
            gender=data.get('gender'),
            marital_status=data.get('maritalStatus'),
            email_address=data.get('email'),
            phone_number=data.get('phone'),
            complete_address=data.get('address'),
            city=data.get('city'),
            company_name=data.get('employer'),
            job_title=data.get('jobTitle'),
            employment_type=data.get('employmentType'),
            years_employed=data.get('yearsEmployed'),
            monthly_income=monthly_income,
            other_income=other_income,
            loan_amount=loanAmount,
            loan_term=data.get('loanTerm'),
            existing_loans=True if data.get('hasOtherLoans') == 'yes' else False,
            car_id = data.get('carId', None),  
            down_payment=down_payment,
            user_id = user.id,  
            
        )
        
        
        admin_notification_message = (
    f"New car loan application submitted by {application.first_name} {application.last_name}.\n"
)
        
        admin = CustomUser.objects.filter(is_admin=True).first()
        
        
        admin_notification = AdminNotification.objects.create(
            user=admin,
            message=admin_notification_message,
            is_read=False,
        )
        
        admin_id = admin.id

        # Send real-time WebSocket notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'admin_{admin_id}',
            {
                'type': 'send_notification',
                'notification': {
                    'id': admin_notification.id,
                    'message': admin_notification.message,
                    'is_read': admin_notification.is_read,
                    'created_at': str(admin_notification.created_at),
                }
            }
        )
        
   

        return Response({
            "message": "Car loan application submitted successfully",
         
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error submitting car loan application: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def existing_car_application(request, id):
    try:
        
      
        application = CarLoanApplication.objects.get(user = request.user, car_id=int(id), is_active=True)
        
        print(application.id)
        if application.status == 'Approved':
            return Response({
                "message": "Existing car loan is approved",
                "status": "approved"
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Existing car loan application is pending",
            "status": "pending"
        }, status=status.HTTP_200_OK)

    except CarLoanApplication.DoesNotExist:
        return Response({
            "message": "Application not found"
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error fetching car loan application: {e}")
        return Response({
            "message": "Internal server error",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_applications(request):
    try:
        
        applications = CarLoanApplication.objects.all()
        serializer = CarLoanApplicationSerializer(applications, many=True)
        print(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_application_details(request,id):
    try:
        
        applications = CarLoanApplication.objects.filter(id = id)
        serializer = CarLoanApplicationSerializer(applications)
        
   
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

