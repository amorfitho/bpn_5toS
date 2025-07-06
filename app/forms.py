from django import forms
from .models import Agendar, Cita

class AgendarForm(forms.ModelForm):
    # Opciones para los campos seleccionables:
    TIPO_EDAD_CHOICES = [
        ('días', 'Días'),
        ('meses', 'Meses'),
        ('años', 'Años'),
    ]

    SEXO_CHOICES = [
        ('macho', 'Macho'),
        ('hembra', 'Hembra'),
    ]

    SERVICIO_CHOICES = [
        ('presencial', 'Presencial'),
        ('ambulatorio', 'Ambulatorio'),
    ]

    SUBSERVICIO_CHOICES = [
        ('consulta', 'Consulta'),
        ('peluquería', 'Peluquería'),
        ('anti-parasitario', 'Anti-parasitario'),
        ('operatorio', 'Operatorio'),
        ('radiografías', 'Radiografías'),
        ('urgencias', 'Urgencias'),
    ]

    # Generar lista de horas desde 8:30 a 10:00 en intervalos de 15 min
    HORA_CHOICES = []
    hora = 8
    minuto = 30
    while hora < 10 or (hora == 10 and minuto == 0):
        hora_str = f"{hora:02d}:{minuto:02d}"
        HORA_CHOICES.append((hora_str, hora_str))
        minuto += 15
        if minuto >= 60:
            minuto = 0
            hora += 1

    tipo_edad = forms.ChoiceField(
        choices=TIPO_EDAD_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    sexo_mascota = forms.ChoiceField(
        choices=SEXO_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    nombre_servicio = forms.ChoiceField(
        choices=SERVICIO_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    nombre_sub_servicio = forms.ChoiceField(
        choices=SUBSERVICIO_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    hora_agendada = forms.ChoiceField(
        choices=HORA_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )

    class Meta:
        model = Agendar
        fields = [
            'nombre_mascota',
            'edad_mascota',
            'tipo_edad',
            'sexo_mascota',
            'tipo_animal',
            'raza_mascota',
            'rut_dueño',
            'nombre_duenio',
            'apellido_duenio',
            'email_duenio',
            'celular_duenio',
            'direccion_duenio',
            'region_duenio',
            'nombre_servicio',
            'nombre_sub_servicio',
            'fecha_agendada',
            'hora_agendada',
        ]
        widgets = {
            'fecha_agendada': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if not isinstance(field.widget, forms.Select) and field_name != 'fecha_agendada':
                field.widget.attrs['class'] = 'form-control'


class CitaForm(forms.ModelForm):
    # Campos seleccionables para receta y diagnóstico
    SI_NO_CHOICES = [
        (True, 'Sí'),
        (False, 'No'),
    ]

    TIPO_COSTO_CHOICES = [
        ('por uso', 'Por uso'),
        ('uso mensual', 'Uso mensual'),
        ('uso/mensual', 'Uso/Mensual'),
    ]

    # Campos para descomponer la fecha
    fecha_agendada_dia = forms.IntegerField(label='Día', widget=forms.NumberInput(attrs={'class': 'form-control'}))
    fecha_agendada_mes = forms.IntegerField(label='Mes', widget=forms.NumberInput(attrs={'class': 'form-control'}))
    fecha_agendada_año = forms.IntegerField(label='Año', widget=forms.NumberInput(attrs={'class': 'form-control'}))

    receta = forms.ChoiceField(choices=SI_NO_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))
    diagnostico = forms.ChoiceField(choices=SI_NO_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))

    tipo_costo = forms.ChoiceField(choices=TIPO_COSTO_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))

    class Meta:
        model = Cita
        fields = [
            # Datos de agenda que se mostrarán como texto (no campos editables)
            # Campos para ingresar hora atendida
            'hora_atendida',
            # Campos para costos
            'costo_servicio',
            'costo_promedio_medicamentos',
            'insumos',
            'insumos_costos_promedio',
            'tipo_costo',
            # Campos calculados
            'receta',
            'diagnostico',
            'diagnostico_emitido',
            'tiempo_espera',
            'ingresos_veterinaria',
            # Fecha separada
            'fecha_agendada_dia',
            'fecha_agendada_mes',
            'fecha_agendada_año',
        ]
        widgets = {
            'hora_atendida': forms.TimeInput(attrs={'type': 'time', 'class': 'form-control'}),
            'costo_servicio': forms.NumberInput(attrs={'class': 'form-control'}),
            'costo_promedio_medicamentos': forms.NumberInput(attrs={'class': 'form-control'}),
            'insumos': forms.TextInput(attrs={'class': 'form-control'}),
            'insumos_costos_promedio': forms.NumberInput(attrs={'class': 'form-control'}),
            'diagnostico_emitido': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'tiempo_espera': forms.NumberInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'ingresos_veterinaria': forms.NumberInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
        }

    def __init__(self, *args, **kwargs):
        agenda = kwargs.pop('agenda', None)  # Se espera pasar una instancia de agenda desde la vista
        super().__init__(*args, **kwargs)

        if agenda:
            # Guardar los datos de la agenda como texto para mostrar en la plantilla
            self.agenda_data = {
                'rut_dueño': agenda.rut_dueño,
                'nombre_duenio': f"{agenda.nombre_duenio} {agenda.apellido_duenio}",
                'nombre_mascota': agenda.nombre_mascota,
                'fecha_agendada': agenda.fecha_agendada,
                'hora_agendada': agenda.hora_agendada,
            }

    def clean(self):
        cleaned_data = super().clean()
        hora_agendada_str = self.agenda_data['hora_agendada']
        hora_atendida_str = cleaned_data.get('hora_atendida')

        try:
            h1, m1 = map(int, hora_agendada_str.split(':'))
            h2, m2 = map(int, hora_atendida_str.split(':'))
            tiempo_espera_min = (h2 * 60 + m2) - (h1 * 60 + m1)
            tiempo_espera = max(tiempo_espera_min, 0)
        except Exception:
            tiempo_espera = 0

        cleaned_data['tiempo_espera'] = tiempo_espera

        costo_servicio = cleaned_data.get('costo_servicio') or 0
        costo_meds = cleaned_data.get('costo_promedio_medicamentos') or 0
        costo_insumos = cleaned_data.get('insumos_costos_promedio') or 0

        ingresos = costo_servicio + costo_meds - costo_insumos
        cleaned_data['ingresos_veterinaria'] = ingresos

        return cleaned_data