from django.urls import path

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('create_countries', views.create_countries, name='create_countries'),
    path('get_country_data/<str:country_name>/', views.get_country_data, name='get_country_data'),
]