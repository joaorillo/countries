from django.urls import path

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('create_countries', views.create_countries, name='create_countries'),
]