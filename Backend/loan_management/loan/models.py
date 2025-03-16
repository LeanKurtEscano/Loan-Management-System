from django.db import models
from user.models import CustomUser
# Create your models here.
class LoanTypes(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    


class LoanPlan(models.Model):
    interest = models.DecimalField(max_digits=5, decimal_places=2)
    repayment_term = models.IntegerField()
    payment_frequency = models.CharField(max_length=20, default='Monthly')


class LoanApplication(models.Model):
    user_id = models.CharField(max_length=255)
    employment_status = models.CharField(max_length=255)
    income_range = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    type = models.ForeignKey(LoanTypes, on_delete=models.CASCADE)
    plan = models.ForeignKey(LoanPlan, on_delete=models.CASCADE)
    amount = models.FloatField()
    
