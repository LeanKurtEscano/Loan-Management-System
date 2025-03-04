from django.db import models

# Create your models here.
class LoanAdmin(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255) 