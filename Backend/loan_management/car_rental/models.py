from django.db import models
from user.models import CustomUser  # Assuming you have a CustomUser model for user management
from cloudinary.models import CloudinaryField
# Create your models here.
class CarLoanApplication(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)  # Link to the user applying for the loan
    car_id = models.IntegerField(unique=True,  blank=True, null=True)  # Unique identifier for the car
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    birthdate = models.DateField()
    gender = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=200)
    email_address = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=100)
    complete_address = models.CharField(max_length=250)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    employment_type = models.CharField(max_length=200, blank=True, null=True)
    years_employed = models.CharField(max_length=200, blank=True, null=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2)
    other_income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan_term = models.CharField(max_length=50)
    status = models.CharField(max_length=200, default='Pending', blank=True, null=True)  # e.g., Pending, Approved, Rejected
    existing_loans = models.BooleanField( blank=True, null=True)
    is_active = models.BooleanField(default=True, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    down_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    
    

class CarLoanDisbursement(models.Model):
    application = models.ForeignKey(CarLoanApplication, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True, blank=True, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    repay_date = models.DateTimeField(blank=True, null=True)
    payment_status = models.CharField(max_length=200, blank=True, null=True)  
    frequency = models.CharField(max_length=50, default='monthly', blank=True, null=True)  
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True, null=True)
    is_fully_paid = models.BooleanField(default=False, blank=True, null=True)
    is_celebrate = models.BooleanField(default=False, blank=True, null=True) 
    status = models.CharField(max_length=200, default='Ongoing', blank=True, null=True) 
    

class CarLoanPayments(models.Model):
    disbursement = models.ForeignKey(CarLoanDisbursement, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=200, default='Pending', blank=True, null=True) 
    period  = models.CharField(max_length=50, null= True , blank= True)
    is_penalty = models.BooleanField(default=False)
    penalty_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    receipt = CloudinaryField('receipt', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
  
  
    