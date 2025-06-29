from django.urls import path
from . import views
urlpatterns = [
    # Define your URL patterns here
    # Example:
    # path('some-path/', some_view_function, name='some_name'),
    path('cars/',views.list_cars, name='list_cars'),
    path('cars/<int:id>',views.car, name='car'),
]
