from django.shortcuts import render, redirect, get_object_or_404
from .forms import AgendarForm,CitaForm
from .models import Agendar, Cita
from django.contrib import messages
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def agenda(request):
    if request.method == 'POST':
        form = AgendarForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Se agendó la hora con éxito')
            return redirect('home')  # Redirige al home tras agendar con éxito
    else:
        form = AgendarForm()

    return render(request, 'app/agenda.html', {'form': form})


def trabajador(request,agenda_id):
     
    agenda = get_object_or_404(Agendar, id_agenda=agenda_id)

    if request.method == 'POST':
        form = CitaForm(request.POST, agenda=agenda)
        if form.is_valid():
            cita = form.save(commit=False)
            cita.id_agenda = agenda
            cita.nombre_mascota = agenda.nombre_mascota
            cita.edad_mascota = agenda.edad_mascota
            cita.tipo_edad = agenda.tipo_edad
            cita.sexo_mascota = agenda.sexo_mascota
            cita.tipo_animal = agenda.tipo_animal
            cita.raza_mascota = agenda.raza_mascota
            cita.rut_dueño = agenda.rut_dueño
            cita.nombre_duenio = agenda.nombre_duenio
            cita.email_duenio = agenda.email_duenio
            cita.celular_duenio = agenda.celular_duenio
            cita.direccion_duenio = agenda.direccion_duenio
            cita.region_duenio = agenda.region_duenio
            cita.nombre_servicio = agenda.nombre_servicio
            cita.nombre_sub_servicio = agenda.nombre_sub_servicio
            cita.save()
            return redirect('lista')
    else:
        form = CitaForm(agenda=agenda)
    return render(request, 'app/trabajador.html',{'form': form})

def lista(request):
    agendas = Agendar.objects.all().order_by('-fecha_agendada')
    return render(request, 'app/lista.html', {'agendas': agendas})

def login(request):
    return render(request, 'app/login.html')

def eliminar_agenda(request, agenda_id):
    if request.method == 'POST':
        try:
            agenda = Agendar.objects.get(id_agenda=agenda_id)
            agenda.delete()
            return JsonResponse({'success': True})
        except Agendar.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Agenda no encontrada'})
    return HttpResponseNotAllowed(['POST'])

def recuperar(request):
    return render(request, 'app/recuperar.html')

def registro(request):
    return render(request, 'app/registro.html')