from django.db import models

# Create your models here.
class Duenio (models.Model):
    rut_duenio = models.IntegerField(max_length=8)
    dv_duenio = models.CharField(max_length=1)
    nombre_duenio = models.CharField(max_length=20)
    apellidos_duenio= models.CharField(max_length=80)
    email_duenio = models.CharField(max_length=250)
    celular_duenio = models.IntegerField()
    fono_duenio = models.IntegerField()
    direccion_duenio= models.CharField(max_length=150)
    region_duenio= models.CharField(max_length=20)

    def __str__(self):
        return self.rut_duenio


opcion_sexo = [
    [0,"Macho"],
    [1,"Hembra"]
]
class mascota (models.Model):
    id_mascota = models.IntegerField()
    nombre_mascota = models.CharField(max_length=50)
    edad_mascota = models. IntegerField()
    sexo_mascota = models.IntegerField(choices=opcion_sexo)
    tipo_animal = models.CharField(max_length=50)
    raza_mascota = models.CharField(max_length=80)
    rut_duenio = models.ForeignKey(Duenio,on_delete=models.PROTECT)
    
    def __str__(self):
        return self.id_mascota

class Doctor (models.Model):
    rut_doctor = models.CharField()
    nombre_doctor = models.CharField(max_length=20)
    apellidos_doctor= models.CharField(max_length=80)

    def __str__(self):
        return self.rut_doctor

class Servicios (models.Model):
    id_servicio =  models.IntegerField()
    nombre_servicio = models.CharField()

    def __str__(self):
        return self.id_servicio

class Sub_servicio (models.Model):
    id_sub_servicio =  models.IntegerField()
    nombre_sub_servicio = models.CharField()

    def __str__(self):
        return self.id_sub_servicio
