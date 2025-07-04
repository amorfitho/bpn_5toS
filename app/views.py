from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def agenda(request):
    return render(request, 'app/agendar.html')

def empleado(request):
    return render(request, 'app/empleado.html')

def login(request):
    return render(request, 'app/login,html')