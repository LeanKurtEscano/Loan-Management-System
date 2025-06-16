from django.db import models
from django.contrib.auth.models import AbstractUser
import cloudinary
import cloudinary.uploader
import cloudinary.models


class IdType(models.Model):
    id_type = models.CharField(max_length=100)
    
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)  
    is_verified = models.CharField(max_length=20, default="not applied")  
    is_borrower = models.BooleanField(default=False)
    contact_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    middle_name = models.CharField(max_length=255,  null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    password = models.CharField(max_length=255)  
    image_url = cloudinary.models.CloudinaryField('image', blank=True, null=True)
    is_good_payer = models.BooleanField(default=False)
    suffix = models.CharField(max_length=20, blank=True, null=True )
   # type_id = models.ForeignKey(IdType, on_delete=models.CASCADE, null=True, blank=True)

class VerificationRequests(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    birthdate = models.DateField()
    age = models.IntegerField()
    contact_number = models.CharField(max_length=15)
    address = models.TextField()
    #image = cloudinary.models.CloudinaryField("image") 
    gender = models.CharField(max_length=20, blank=True, null=True )
    marital_status = models.CharField(max_length=20, blank=True, null=True )
    postal_code = models.CharField(max_length=20, blank=True, null=True )
    status = models.CharField(max_length=20, default="pending")  
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    suffix = models.CharField(max_length=20, blank=True, null=True )
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.status}"
    
    
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, blank=True, null=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
  

    def __str__(self):
        return f"Notification for {self.user.username}"