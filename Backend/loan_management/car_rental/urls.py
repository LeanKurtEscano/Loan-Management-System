from django.urls import path
from . import views
urlpatterns = [
    # Define your URL patterns here
    # Example:
    # path('some-path/', some_view_function, name='some_name'),
    path('cars/',views.list_cars, name='list_cars'),
    path('cars/<int:id>',views.car_loan_details, name='car'),
    path('apply/', views.apply_car_loan, name='apply_car_loan'),
    path('car-loan/<int:id>', views.get_existing_car_application, name='existing_car_application'),
    
]
