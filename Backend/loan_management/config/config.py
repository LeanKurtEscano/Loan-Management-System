from django.contrib.auth.backends import BaseBackend
from user.models import CustomUser

from django.contrib.auth.hashers import check_password

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
          
            user = CustomUser.objects.get(email=username, is_admin = False)
                 
            if user.check_password(password):
                return user  
            else:
                return None  
        except CustomUser.DoesNotExist:
          
            return None  
        except Exception as e:

            print(f"Error during authentication: {str(e)}")

class UsernameBackend(BaseBackend):
    """Authenticate admins by username."""
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            admin = CustomUser.objects.get(username=username, is_admin=True)  
            if check_password(password, admin.password):
                return admin
        except CustomUser.DoesNotExist:
            return None
        return None
