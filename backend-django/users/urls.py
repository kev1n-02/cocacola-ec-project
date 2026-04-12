"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 08/04/2026
DESCRIPCIÓN:
Archivo de rutas URL del módulo de usuarios.
Define los endpoints principales de la API para el registro,
inicio de sesión y gestión de productos.

FECHA DE MODIFICACIÓN: 11/04/2026
AUTOR DE LA MODIFICACIÓN: Kevin Yalama
DESCRIPCIÓN DE LA MODIFICACIÓN:
Se agregó la ruta 'productos/' para permitir la consulta
de productos disponibles mediante la API del sistema.
===========================================================
"""
from django.urls import path
from .views import register_user, login_user, obtener_productos

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('productos/', obtener_productos, name='productos'),
]