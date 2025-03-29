from django.urls import path
from . import views

urlpatterns = [
    path('payment/', views.handle_loan_payments, name="handle-payments"),
]
