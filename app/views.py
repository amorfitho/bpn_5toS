from django.shortcuts import render, redirect
from .forms import AgendarForm
# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def agenda(request):
    if request.method == 'POST':
        form = AgendarForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')  # Redirige al home tras agendar con éxito
    else:
        form = AgendarForm()

    return render(request, 'app/agenda.html', {'form': form})

def trabajador(request):
    return render(request, 'app/trabajador.html')

def lista(request):
    return render(request, 'app/lista.html')

def login(request):
    return render(request, 'app/login,html')