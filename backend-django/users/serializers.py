"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 11/04/2026
DESCRIPCIÓN:
Archivo de serializadores del sistema encargado de convertir
los modelos Categoria y Producto en formato JSON para su
envío y recepción mediante la API REST del proyecto.
===========================================================
"""

from rest_framework import serializers
from .models import Producto, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer()

    class Meta:
        model = Producto
        fields = '__all__'