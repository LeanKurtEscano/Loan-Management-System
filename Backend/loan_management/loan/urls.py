from django.urls import path
from . import views
urlpatterns = [
    path('types/', views.loan_types_list, name="loan-types"),
    path('plans/', views.loan_plans_list, name="plan-list")
]
