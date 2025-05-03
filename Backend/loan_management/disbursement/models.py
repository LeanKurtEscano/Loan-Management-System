from django.db import models
from user.models import CustomUser
from loan.models import LoanSubmission
import cloudinary
from cloudinary.models import CloudinaryField



class LoanPayments(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,)
    loan = models.ForeignKey(LoanSubmission, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    period  = models.CharField(max_length=50, null= True , blank= True)
    receipt = CloudinaryField('receipt', null=True, blank=True)
    status = models.CharField(max_length=20,  default='Pending')
   
    penalty_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

