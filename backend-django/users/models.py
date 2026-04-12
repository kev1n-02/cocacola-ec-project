"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 11/04/2026
DESCRIPCIÓN:
Archivo de modelos de base de datos encargado de definir
las entidades Categoria y Producto utilizadas para la
gestión y almacenamiento de información de productos
dentro del sistema web.
===========================================================
"""
from django.contrib.auth.models import User
from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.URLField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
    

class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    nacionalidad = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    cedula = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username