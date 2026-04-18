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

FECHA DE MODIFICACIÓN: 13/04/2026
AUTOR DE LA MODIFICACIÓN: Kevin Yalama
DESCRIPCIÓN DE LA MODIFICACIÓN:

===========================================================
"""
from django.urls import path
from .views import (
    register_user,
    login_user,
    obtener_productos,
    obtener_categorias,
    get_profile,
    update_profile,
    change_password,
    delete_user,
    create_order,
    my_orders,
    order_detail,
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),

    path('categorias/', obtener_categorias, name='categorias'),
    path('productos/', obtener_productos, name='productos'),

    path('profile/', get_profile, name='profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('change-password/', change_password, name='change_password'),
    path('delete/', delete_user, name='delete_user'),

    path('orders/create/', create_order, name='create_order'),
    path('orders/my-orders/', my_orders, name='my_orders'),
    path('orders/detail/', order_detail, name='order_detail'),
]