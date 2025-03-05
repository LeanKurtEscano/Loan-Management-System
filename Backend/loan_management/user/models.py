from django.db import models
from django.contrib.auth.models import AbstractUser
import cloudinary
import cloudinary.uploader
import cloudinary.models


class IdType(models.Model):
    id_type = models.CharField(max_length=100)
    
class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False) 
    contact_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    monthly_salary = models.IntegerField(null=True, blank=True)
    password = models.CharField(max_length=255)  
    image_url = cloudinary.models.CloudinaryField('image', blank=True, null=True)
   # type_id = models.ForeignKey(IdType, on_delete=models.CASCADE, null=True, blank=True)
