from django.urls import path
from .views import home, agenda, empleado

urlpatterns = [
    path('',home,name="home"),
    path('agenda/',agenda, name="agenda"),
    path('empleado/', empleado, name="emleado")
]