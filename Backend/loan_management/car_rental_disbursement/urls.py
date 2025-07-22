from django.urls import path
from . import views



urlpatterns = [
    path('active-disbursement/', views.active_car_disbursement, name='active_car_disbursement'),
    path('active-application/', views.active_car_application, name='active_car_application'),
    path('disbursement/payments/', views.car_disbursement_payment_list, name='car_disbursement_list'),
    path('approve/payment/', views.approve_car_loan_payment, name="approve_car_loan_payment"),
    path('reject/payment/', views.reject_car_loan_payment, name="approve_car_loan_payment"),
    path('payment/', views.handle_car_loan_payments, name='payment_handler'),
    path('payment/<int:id>/', views.get_car_user_payment, name='payment_handler'),
    path('new/application/', views.new_car_loan, name='new_car_loan'),
    path('payments/', views.car_disbursement_payments, name='car_payments'),
]