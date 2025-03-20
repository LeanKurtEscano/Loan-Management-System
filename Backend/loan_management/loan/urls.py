from django.urls import path
from . import views
urlpatterns = [
    path('types/', views.loan_types_list, name="loan-types"),
    path('plans/', views.loan_plans_list, name="plan-list"),
    path('application/<int:id>/', views.get_user_application, name="get_user_application"),
    path('loan/apply/', views.create_loan_application, name="create_loan_application"),
    path('applications/', views.get_all_loan_applications, name="get_loan_application"),
    path('verify/application/', views.verify_loan_application, name="verify_loan_application"),
    path('reject/', views.reject_loan_application, name="reject-loanapp"),
]
