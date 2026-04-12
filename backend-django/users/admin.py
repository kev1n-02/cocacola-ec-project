"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 11/04/2026
DESCRIPCIÓN:
Archivo de configuración del panel administrativo de Django
encargado de registrar los modelos Categoria y Producto
para su gestión desde la interfaz de administración.
===========================================================
"""
from django.contrib import admin
from .models import Categoria, Producto

admin.site.register(Categoria)
admin.site.register(Producto)