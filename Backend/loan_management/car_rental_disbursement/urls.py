from django.urls import path
from . import views



urlpatterns = [
    path('active-disbursement/', views.active_car_disbursement, name='active_car_disbursement'),
]