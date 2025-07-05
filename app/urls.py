from django.urls import path
from .views import home, agenda,trabajador,lista,login

urlpatterns = [
    path('',home, name="home"),
    path('agendar/',agenda, name="agendar"),
    path('trabajador/',trabajador, name="trabajador"),
    path('lista/',lista,name="lista"),
    path('login/',login,name="login"),
]