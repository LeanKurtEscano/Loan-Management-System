from django.contrib.auth.backends import BaseBackend
from user.models import CustomUser

from loan_admin.models import LoanAdmin
from django.contrib.auth.hashers import check_password

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
          
            user = CustomUser.objects.get(email=username)
                 
            if user.check_password(password):
                return user  
            else:
                return None  
        except CustomUser.DoesNotExist:
          
            return None  
        except Exception as e:

            print(f"Error during authentication: {str(e)}")
            return None

class LoanAdminBackend(BaseBackend):
    """ Authenticate loan admins using username and password (LoanAdmin). """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            admin = LoanAdmin.objects.get(username=username)
            if check_password(password, admin.password):  
                return admin
        except LoanAdmin.DoesNotExist:
            return None
        return None
