from django.db import models

# Create your models here.
class Agendar(models.Model):
    id_agenda = models.AutoField(primary_key=True)
    nombre_mascota = models.CharField(max_length=50)
    edad_mascota = models. IntegerField()
    tipo_edad = models.CharField(max_length=6, null=True, blank=True)
    sexo_mascota = models.CharField(max_length=10) 
    tipo_animal = models.CharField(max_length=50)
    raza_mascota = models.CharField(max_length=80)
    rut_dueño=models.IntegerField()
    nombre_duenio = models.CharField(max_length=50)
    apellido_duenio= models.CharField(max_length=250) 
    email_duenio = models.CharField(max_length=250) 
    celular_duenio = models.IntegerField()
    direccion_duenio= models.CharField(max_length=150)
    region_duenio= models.CharField(max_length=20)
    nombre_servicio = models.CharField(max_length=20)
    nombre_sub_servicio = models.CharField(max_length=20)
    fecha_agendada = models.DateField()
    hora_agendada = models.CharField(max_length=10)

    def __str__(self):
        return self.id_agenda
    
class Cita(models.Model):
    id_cita = models.IntegerField()
    id_agenda=models.ForeignKey(Agendar, on_delete=models.PROTECT,default=0)
    nombre_mascota = models.CharField(max_length=50)
    edad_mascota = models. IntegerField()
    tipo_edad = models.CharField(max_length=4,null=True, blank=True)
    sexo_mascota = models.CharField(max_length=10)
    tipo_animal = models.CharField(max_length=50)
    raza_mascota = models.CharField(max_length=80)
    rut_dueño=models.IntegerField()
    nombre_duenio = models.CharField(max_length=20)
    email_duenio = models.CharField(max_length=250) 
    celular_duenio = models.IntegerField() 
    direccion_duenio= models.CharField(max_length=150)
    region_duenio= models.CharField(max_length=20)
    nombre_servicio = models.CharField(max_length=20)
    nombre_sub_servicio = models.CharField(max_length=20)
    razon_servicio= models.CharField(max_length=500,default='consulta')
    fecha_agendada_dia = models.IntegerField()
    fecha_agendada_mes = models.IntegerField()
    fecha_agendada_año = models.IntegerField()
    hora_agendada = models.CharField(max_length=15)
    hora_atendida = models.CharField(max_length=15)
    tiempo_espera= models.IntegerField(default=0)
    rut_espcialista= models.CharField(max_length=10,default=0)
    nombre_especialista = models.CharField(max_length=250)
    receta = models.BooleanField()
    diagnostico = models.BooleanField()
    diagnostico_emitido= models.CharField(max_length=500,default='No emitido')
    costo_servicio=models.IntegerField(default=0)
    costo_promedio_medicamentos = models.IntegerField()
    insumos= models.CharField(max_length=200)
    Tipo_costo = models.CharField(max_length=100)
    insumos_costos_promedio = models.IntegerField()
    ingresos_veterinaria= models.IntegerField()

    def __str__(self):
        return self.id_cita
