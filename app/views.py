from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, 'template/home')

def agenda(request):
    return render(request, 'template/agendar')

def empleado(request):
    return render(request, 'template/empleado')