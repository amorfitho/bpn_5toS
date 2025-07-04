from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def agenda(request):
    return render(request, 'app/agenda.html')

def trabajador(request):
    return render(request, 'app/trabajador.html')

def login(request):
    return render(request, 'app/login,html')