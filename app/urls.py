from django.urls import path
from .views import home,agenda,empleado,login

urlpatterns = [
    path('',home, name="home"),
    path('agendar/',agenda, name="agendar"),
    path('empleado/',empleado, name="trabajador"),
    path('login/',login,name="login"),
]