from django.urls import path
from . import views



urlpatterns = [
    path('active-disbursement/', views.active_car_disbursement, name='active_car_disbursement'),
    path('disbursement/payments/', views.car_disbursement_payment_list, name='car_disbursement_list'),
]