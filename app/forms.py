from django import forms
from .models import Agendar

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
