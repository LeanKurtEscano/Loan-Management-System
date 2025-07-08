from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
# Create your views here.
from rest_framework import status
import requests
from car_rental import CarLoanApplication , CarLoanDisbursement,CarLoanPayments
from decimal import Decimal
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import calendar
from loan_admin.models import AdminNotification
from django.utils import timezone 
from dateutil.relativedelta import relativedelta  