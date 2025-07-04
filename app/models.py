from django.db import models

# Create your models here.
class Duenio (models.Model):
    rut_duenio = models.IntegerField()
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
    rut_doctor = models.CharField(max_length=10)
    nombre_doctor = models.CharField(max_length=20)
    apellidos_doctor= models.CharField(max_length=80)

    def __str__(self):
        return self.rut_doctor

class Servicios (models.Model):
    id_servicio =  models.IntegerField()
    nombre_servicio = models.CharField(max_length=20)

    def __str__(self):
        return self.id_servicio

class Sub_servicio (models.Model):
    id_sub_servicio =  models.IntegerField()
    nombre_sub_servicio = models.CharField(max_length=80)
    
    

    def __str__(self):
        return self.id_sub_servicio

class Especialista(models.Model):
    run_especialista = models.IntegerField()
    nombre_especialista = models.CharField(max_length=250)
    id_sub_servicio = models.ForeignKey(Sub_servicio, on_delete=models.PROTECT)

    def __str__(self):
        return self.run_especialista


class Tipo_costo(models.Model):
    nombre_coste = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre_coste

class Insumos(models.Model):
    nombre_insumo= models.CharField(max_length=250)
    costo_promedio_medicamentos= models.IntegerField()
    insumos_costos_promedio= models.IntegerField()
    tipo_costo = models.ForeignKey(Tipo_costo, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre_insumo

class Coste_subservicio(models.Model):
    coste=models.IntegerField()

    def __str__(self):
        return self.coste