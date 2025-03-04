from django.db import models
from django.contrib.auth.models import AbstractUser
import cloudinary
import cloudinary.uploader
import cloudinary.models


class IdType(models.Model):
    id_type = models.CharField(max_length=100)
    

class CustomUser(AbstractUser):
    contact_number = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)
    monthly_salary = models.IntegerField()
    password = models.CharField(max_length=128) 
    image_url = cloudinary.models.CloudinaryField('image', blank=True, null=True)
    type_id = models.ForeignKey(IdType, on_delete=models.CASCADE)

class LoanAdmin(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255) 
