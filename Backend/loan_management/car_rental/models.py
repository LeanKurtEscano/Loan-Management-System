from django.db import models

# Create your models here.
class CarLoanApplication(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    birthdate = models.DateField()
    gender = models.CharField(max_length=10)
    marital_status = models.CharField(max_length=20)
    email_address = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=100)
    complete_address = models.CharField(max_length=250)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    employment_type = models.CharField(max_length=50, blank=True, null=True)
    years_employed = models.CharField(max_length=50, blank=True, null=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2)
    other_income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    loan_term = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='Pending')  # e.g., Pending, Approved, Rejected
    existing_loans = models.BooleanField()
    