"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 08/04/2026
DESCRIPCIÓN:
Vistas de autenticación para registro e inicio de sesión
de usuarios en el sistema web inspirado en Coca-Cola Ecuador.
FECHA DE MODIFICACIÓN: 11/04/2026
AUTOR DE LA MODIFICACIÓN: Kevin Yalama
DESCRIPCIÓN DE LA MODIFICACIÓN:
Se agregó la vista obtener_productos utilizando el método GET
para consultar y retornar la lista de productos registrados
en la base de datos mediante serialización.
===========================================================
"""
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Producto, Perfil
from .serializers import ProductoSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    fecha_nacimiento = data.get('fecha_nacimiento')
    nacionalidad = data.get('nacionalidad')
    correo = data.get('correo')
    telefono = data.get('telefono')
    cedula = data.get('cedula')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not correo or not password:
        return Response(
            {'error': 'Correo y contraseña son obligatorios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if password != confirm_password:
        return Response(
            {'error': 'Las contraseñas no coinciden'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=correo).exists():
        return Response(
            {'error': 'El correo ya está registrado'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=correo,
        email=correo,
        password=password,
        first_name=nombre or '',
        last_name=apellido or ''
    )

    Perfil.objects.create(
        user=user,
        nombre=nombre or '',
        apellido=apellido or '',
        fecha_nacimiento=fecha_nacimiento,
        nacionalidad=nacionalidad or '',
        telefono=telefono or '',
        cedula=cedula or ''
    )

    return Response(
        {'message': 'Usuario registrado correctamente'},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def login_user(request):
    correo = request.data.get('username') or request.data.get('correo')
    password = request.data.get('password')

    if not correo or not password:
        return Response(
            {'error': 'Correo y contraseña son obligatorios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=correo, password=password)

    if user is not None:
        return Response(
            {
                'message': 'Login exitoso',
                'user': {
                    'id': user.id,
                    'correo': user.email,
                    'nombre': user.first_name,
                    'apellido': user.last_name
                }
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {'error': 'Credenciales inválidas'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
def obtener_productos(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)