from django.urls import path
from .views import home, agenda

urlpatterns = [
    path('',home,name="home"),
    path('agenda',agenda, name="agenda")
]