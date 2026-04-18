"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 11/04/2026
DESCRIPCIÓN:
Archivo de serializadores del sistema encargado de convertir
los modelos Categoria y Producto en formato JSON para su
envío y recepción mediante la API REST del proyecto.
FECHA DE MODIFICACIÓN: 13/04/2026
DESCRIPCIÓN DE MODIFICACIÓN:

===========================================================
"""
from rest_framework import serializers
from .models import Producto, Perfil, Pedido, DetallePedido, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio',
            'imagen',
            'categoria',
            'categoria_nombre',
            'marca',
            'stock',
            'es_destacado',
            'es_promocion',
            'activo',
        ]


class PerfilSerializer(serializers.ModelSerializer):
    correo = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Perfil
        fields = [
            'nombre',
            'apellido',
            'fecha_nacimiento',
            'nacionalidad',
            'telefono',
            'cedula',
            'correo',
        ]


class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = [
            'id',
            'producto',
            'producto_nombre',
            'cantidad',
            'precio',
            'subtotal',
        ]


class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id',
            'fecha',
            'subtotal',
            'iva',
            'total',
            'nombres_facturacion',
            'direccion_facturacion',
            'cedula_facturacion',
            'estado',
            'detalles',
        ]