from django.urls import path
from . import views
urlpatterns = [
    path('types/', views.loan_types_list, name="loan-types"),
    path('plans/', views.loan_plans_list, name="plan-list"),
    path('application/<int:id>/', views.get_user_application, name="get_user_application"),
    path('submission/<int:id>/', views.get_user_submission, name="get_user_submission"),
    path('loan/apply/', views.create_loan_application, name="create_loan_application"),
    path('loan/submission/', views.create_loan_submission, name="create_loan_submission"),
    path('applications/', views.get_all_loan_applications, name="get_loan_application"),
    path('submissions/', views.get_all_loan_submissions, name="get_loan_application"),
    path('verify/application/', views.verify_loan_application, name="verify_loan_application"),
    path('remove/', views.delete_loan_application, name="delete-loanapp"),
    path('remove/submission/', views.delete_loan_submission, name="delete-loansub"),
    path('reject/', views.reject_loan_application, name="reject-loanapp"),
    path('reject/submission/', views.reject_loan_submission, name="reject-loansub"),
    path('user/application/', views.loan_application, name="loanapp"),
    path('approve/disbursement/', views.approve_loan_disbursement, name="approve_loan_disbursment"),
    path('user/submission/', views.loan_submission, name="loansub"),
    path('users/', views.get_users, name="getusers"),
    path('remove/user/', views.delete_user, name="delete-user"),
    path('user/<int:id>', views.account_detail_view, name="account_detail_view"),
]
