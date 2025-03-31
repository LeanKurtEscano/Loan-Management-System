from django.urls import path
from . import views

urlpatterns = [
    path('payment/', views.handle_loan_payments, name="handle-payments"),
    path('payment/<int:id>/', views.get_user_payment, name="loan-payment"),
    path('payments/', views.loan_disbursement_list, name="loan-disbursements"),
    path('approve/payment/', views.approve_loan_payment, name="approve_loan_payment"),
    path('remove/payment/', views.delete_loan_payments, name="delete_loan_payment"),
    path('reject/payment/', views.reject_loan_payment, name="reject_payment"),
    path('payment/date/',views.user_payment_data, name="payment-data"),
    path('transactions/', views.user_transactions, name="user_transactions"),
    path('transactions/<int:id>/', views.user_transaction, name="transaction"),
]
