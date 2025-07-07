from django.urls import path
from .views import home, agenda,trabajador,lista,login,eliminar_agenda, recuperar, registro

urlpatterns = [
    path('',home, name="home"),
    path('agendar/',agenda, name="agendar"),
    path('trabajador/<int:agenda_id>/',trabajador, name="trabajador"),
    path('lista/',lista,name="lista"),
    path('login/',login,name="login"),
    path('eliminar_agenda/<int:agenda_id>/', eliminar_agenda, name="eliminar_agenda"),
    path('recuperar/',recuperar,name="recuperar"),
    path('registro/',registro,name="registro")
]