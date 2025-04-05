from django.db import models
from user.models import CustomUser
from cloudinary.models import CloudinaryField
class LoanTypes(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    


class LoanPlan(models.Model):
    interest = models.DecimalField(max_digits=5, decimal_places=2)
    repayment_term = models.IntegerField()
    payment_frequency = models.CharField(max_length=20, default='Monthly')




class LoanApplication(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    front = CloudinaryField('front_image', blank=True, null=True)  # Cloudinary Field
    back = CloudinaryField('back_image', blank=True, null=True) 
    id_type = models.CharField(max_length=50, blank=True, null=True)
    education_level = models.CharField(max_length=50,blank=True, null=True)
    employment_status = models.CharField(max_length=50, blank=True, null=True)
    monthly_income = models.CharField(max_length=100, blank=True, null=True)
    income_variation = models.CharField(max_length=50, blank=True, null=True)
    primary_income_source = models.CharField(max_length=100, blank=True, null=True)
    other_sources_of_income = models.TextField(blank=True, null=True)  
    income_frequency = models.CharField(max_length=50, blank=True, null=True)
    primary_source = models.CharField(max_length=100, blank=True, null=True)
    money_receive = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20,  default='Pending')
    total_spend = models.CharField(max_length=100, blank=True, null=True)
    purpose = models.CharField(max_length=100, blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    outstanding =  models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    end_date = models.DateTimeField(null=True, blank=True)
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    borrowed_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    interest = models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False) 


    def __str__(self):
        return f"Loan Application for {self.user.username}"


class LoanSubmission(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    loan_app = models.ForeignKey(LoanApplication, on_delete=models.CASCADE)
    id_selfie = CloudinaryField('id_selfie', blank=True, null=True) 
    repay_date = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default='Pending')
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cashout = models.CharField(max_length=50, blank=True)
    contact_number = models.CharField(max_length=50, blank=True)
    total_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    frequency = models.CharField(max_length=40, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    is_fully_paid = models.BooleanField(default=False)
    is_celebrate = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def update_payment_status(self):
        """ Updates is_fully_paid based on the remaining balance. """
        self.is_fully_paid = self.balance <= 0
        self.save()


