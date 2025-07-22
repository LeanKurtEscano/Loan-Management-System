from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes,parser_classes
# Create your views here.
from rest_framework import status
import requests
from . models import CarLoanApplication , CarLoanDisbursement,CarLoanPayments
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar
from loan_admin.models import AdminNotification
from user.models import CustomUser
from user.models import CustomUser,Notification
from .serializers import CarLoanApplicationSerializer,CarLoanDisbursementSerializer,CarLoanPaymentSerializer
from user.models import CustomUser,Notification
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader
from django.utils import timezone  # For timezone-aware datetime
from dateutil.relativedelta import relativedelta  
from dotenv import load_dotenv
import os
load_dotenv
@api_view(['GET'])
def list_cars(request):
    try:
        collab_api = os.getenv('COLLAB_API')
        print(collab_api)
       
        response = requests.get(f'{collab_api}/api/loan/available-cars') 

 
        if response.status_code == 200:
            data = response.json()
            print(data)
            return Response({"cars": data.get('cars', [])}, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": f"External API returned {response.status_code}: {response.text}"
            }, status=status.HTTP_502_BAD_GATEWAY)     
    except Exception as e:
        print(f"Error fetching car data: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
    
   
    
@api_view(['GET'])
def car_loan_details(request, id):
    try:
        
        collab_api =  os.getenv('COLLAB_API')
        response = requests.get(f'{collab_api}/api/loan/cars-loan-details/{id}') 
       
        
        if response.status_code == 200:
            data = response.json()
            return Response({"car_loan_details": data}, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": f"External API returned {response.status_code}: {response.text}"
            }, status=status.HTTP_502_BAD_GATEWAY)
        """
        print(id)
        sample_json = {
    "car": {
        "id": id,
        "make": "Toyota",
        "model": "Corolla",
        "year": 2022,
        "image_url": "https://example.com/images/cars/toyota-corolla.jpg",
        "loan_sale_price": 850000,
        "interest_rate": 6.5,
        "description": "A reliable and fuel-efficient sedan ideal for both city and highway driving. Equipped with modern safety features and excellent mileage.",
        "body_type": "Sedan",
        "license_plate": "ABC-1234",
        "date_offered": "2024-09-10",
        "car_id": "CAR101",
        "mileage": 32000,
        "horsepower": 132
    }
}

        return Response({"car_loan_details": sample_json}, status=status.HTTP_200_OK)
    """
    except Exception as e:
        print(f"Error fetching car loan details: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser]) 
@permission_classes([IsAuthenticated])
def apply_car_loan(request):
    try:
        data = request.data
        print(request.data)
        monthly_income = Decimal(data.get('monthlyIncome', 0))
        other_income = Decimal(data.get('otherIncome', 0) or 0)
        loanAmount = Decimal(data.get('loanAmount', 0))
        car_id = data.get('carId', None)
        user = request.user
        
        front_image_url = ""
        back_image_url = ""

        if 'idFront' in request.FILES:
            front_image = request.FILES['idFront']
            upload_front = cloudinary.uploader.upload(front_image)
            front_image_url = upload_front.get("secure_url")

        if 'idBack' in request.FILES:
            back_image = request.FILES['idBack']
            upload_back = cloudinary.uploader.upload(back_image)
            back_image_url = upload_back.get("secure_url")
            
        
        # Create a new CarLoanApplication instance
        application = CarLoanApplication.objects.create(
            first_name=data.get('firstName'),
            middle_name=data.get('middleName'),
            last_name=data.get('lastName'),
            front_id=front_image_url,
            back_id=back_image_url,
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
            user_id = user.id,  
            
        )
        
        collab_api = os.getenv('COLLAB_API')
        response = requests.post(f"{collab_api}/api/loan/set-pending/{car_id}",
                                 
        json={"car_id": car_id}) 
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
        # Fix: Convert QuerySet to list or use .values() if you only need specific fields
        applications = list(CarLoanApplication.objects.all())
        serializer = CarLoanApplicationSerializer(applications, many=True)
        print(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_applications(request):
    try:
        # Fix: Convert QuerySet to list or use .values() if you only need specific fields
        applications = list(CarLoanApplication.objects.all())
        serializer = CarLoanApplicationSerializer(applications, many=True)
        print(serializer.data)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_disbursements(request):
    try:
        disbursements = CarLoanDisbursement.objects.select_related('application').all()

        token = request.META.get('HTTP_AUTHORIZATION')
        headers = {'Authorization': token} if token else {}
        collab_api = os.getenv('COLLAB_API')
        response = requests.get(f'{collab_api}/api/loan/all-cars', headers=headers)
        if response.status_code != 200:
            return Response({"error": "Failed to fetch car data"}, status=status.HTTP_502_BAD_GATEWAY)

        cars_data = response.json().get('cars', [])
        print(cars_data)

        enriched_disbursements = []
        for disbursement in disbursements:
            car_id = disbursement.application.car_id

            matched_car = next((car for car in cars_data if car['id'] == car_id), None)

            disbursement_with_car = {
                "id": disbursement.id,
                "first_name": disbursement.application.first_name,
                "middle_name": disbursement.application.middle_name,
                "last_name": disbursement.application.last_name,
                "application": disbursement.application.id,
                "total_amount": disbursement.total_amount,
                "status": disbursement.status,
                "disbursement_start_date": disbursement.start_date,
                "end_date": disbursement.repay_date,
                "car_details": {
                    'make': matched_car['make'],
                    'model': matched_car['model'],
                    'year': matched_car['year'],
                    'color': matched_car['color'],
                } if matched_car else None
            }

            enriched_disbursements.append(disbursement_with_car)

        return Response( enriched_disbursements, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching car loan disbursements: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_loan_application_details(request,id):
    
   # response = requests.get(f'http://localhost:8000/rental/cars/{id}') 
    #data = response.json()
    
    
    try:
        
        applications = CarLoanApplication.objects.get(id = id)
        serializer = CarLoanApplicationSerializer(applications)

        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def car_loan_approval(request):
    try:
        data = request.data
        id = data.get('id')
        loan_amount = data.get('loan_amount')
        print(loan_amount)
        interest = data.get('interest')
        print(interest)
        
      
      
        application = CarLoanApplication.objects.get(id= int(id))
        print(application.car_id)
        application.interest = Decimal(interest) 
        
        
        
        loan_term_months = int(application.loan_term or 0)  # Fallback to 0 if empty

        # 📅 Calculate end date
        start_date = timezone.now()
        end_date = start_date + relativedelta(months=loan_term_months)
        
        car_disbursment = CarLoanDisbursement.objects.create(application=application,
                                                             total_amount= Decimal(loan_amount),
                                                             balance = Decimal(loan_amount),
                                                              repay_date=end_date)    
        car_disbursment.save()
        print(application.first_name)
    
        application.status = 'Approved'
        application.save()
        collab_api = os.getenv('COLLAB_API')
        response = requests.post(f"{collab_api}/api/loan/car-loan-status/{application.car_id}" , json = {
            "car_id": application.car_id,
            "user_id": application.user.id,
            "is_approved": True,
            "disbursement_id": car_disbursment.id,
            "first_name": application.first_name,
            "last_name": application.last_name,
            "middle_name": application.middle_name or  "",
            "email": application.email_address,
            "contact": application.phone_number,
            "loan_term": application.loan_term,
            "birthdate": application.birthdate.strftime('%Y-%m-%d'),
            "gender": application.gender,
            "marital_status": application.marital_status,
            "city": application.city,
            "complete_address": application.complete_address,
            "company_name": application.company_name,
            "job_title": application.job_title,
            "employment_type": application.employment_type,
            "years_employed": application.years_employed,
            "monthly_income": str(application.monthly_income),
            "other_income": str(application.other_income),
            "existing_loans": application.existing_loans,
            "front": str(application.front_id),
            "back": str(application.back_id),
            }) 
        
        print(response.status_code)
        
      
        user = application.user
        notification_message = (
            f"Your car loan application has been approved. ")
        
        notification = Notification.objects.create(
            user=user,
            message=notification_message,
            is_read=False,
            status="Approved"
        )


        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user.id}',
            {
                'type': 'send_notification',
                'notification': {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': notification.is_read,
                    'created_at': str(notification.created_at),
                }
            }
        )
        
        return Response({
            "message": "Car loan application approved successfully"
        }, status=status.HTTP_200_OK)
    
    except CarLoanApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        print(f"Error approving car loan application: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def car_loan_reject(request, id):
    try:
        
        data = request.data
        subject = data.get('subject')
        description = data.get('description')
        application = CarLoanApplication.objects.get(id=int(id))
        application.status = 'Rejected'
        application.is_active = False
        application.save()
        collab_api = os.getenv('COLLAB_API')
        response = requests.post(f"{collab_api}/api/loan/car-loan-status-reject" , json = {
           "car_id": application.car_id,
           }) 
        
        print(response.status_code)
        message  = (
            f"Your car loan application has been rejected. Reason: {description}")
        user = application.user
       
        notification = Notification.objects.create(
            user=user,
            message=message,
            is_read=False,
            status="Rejected"
        )


        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user.id}',
            {
                'type': 'send_notification',
                'notification': {
                    'id': notification.id,
                    'message': notification.message,
                    'is_read': notification.is_read,
                    'created_at': str(notification.created_at),
                }
            }
        )
        
        return Response({
            "message": "Car loan application rejected successfully"
        }, status=status.HTTP_200_OK)
    
    except CarLoanApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        print(f"Error rejecting car loan application: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def active_car_loan_data(request, id):
    try:
        user = request.user
        try:
            application = CarLoanApplication.objects.get(user=user, is_active=True, car_id=int(id))
        except CarLoanApplication.DoesNotExist:
            return Response({"message": "No active car loan application found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            disbursement = CarLoanDisbursement.objects.get(application=application)
        except CarLoanDisbursement.DoesNotExist:
            return Response({"message": "Disbursement not found for this application"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            "car_id": application.car_id,
            "user_data": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": application.phone_number,
            },
            "loan_data": {
                "loan_amount": float(application.loan_amount),
                "loan_term": application.loan_term,
                "interest_rate": float(disbursement.total_amount),  
            }
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching active car loan applications: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_disbursment_payments(request, id):
    try:
        
        token = request.META.get('HTTP_AUTHORIZATION')
        headers = {'Authorization': token} if token else {}
        disbursement = CarLoanDisbursement.objects.get(id=id)
        collab_api = os.getenv('COLLAB_API')
        response = requests.get(f"{collab_api}/api/loan/cars-loan-details/{disbursement.application.car_id}", headers=headers)
        if response.status_code != 200:
            return Response({"error": "Failed to fetch car data"}, status=status.HTTP_502_BAD_GATEWAY)

        cars_data = response.json().get('car')
        print(cars_data)
      
        payments = CarLoanPayments.objects.filter(disbursement=disbursement)
        
        serializer = CarLoanPaymentSerializer(payments, many=True)
        
        personal_details = {
            "first_name": disbursement.application.first_name,
            "last_name": disbursement.application.last_name,
            "middle_name": disbursement.application.middle_name,
            "email": disbursement.application.email_address,
            "phone_number": disbursement.application.phone_number,
        }
     
        
        return Response({"car_details":cars_data ,"payments":serializer.data, "person": personal_details}, status=status.HTTP_200_OK)
    
    except CarLoanDisbursement.DoesNotExist:
        return Response({"error": "Disbursement not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        print(f"Error fetching car loan payments: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
""" 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def car_disbursement_payment(request):
    try:
        data = request.data
        disbursement_id = data.get("disbursement_id")
        
    except Exception as e:
        print(e)
        return Response({"error":f"{e}"}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        
"""


@api_view(['GET'])
def car_disbursement_personal_details(request, id):
    try:
        disbursement = CarLoanDisbursement.objects.get(id=int(id))
        serializer = CarLoanDisbursementSerializer(disbursement)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
    except Exception as e:
        print(f"Error fetching personal details: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)