"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 11/04/2026
DESCRIPCIÓN:
Archivo de configuración del panel administrativo de Django
encargado de registrar los modelos Categoria y Producto
para su gestión desde la interfaz de administración.
FECHA DE MODIFICACIÓN: 13/04/2026
AUTOR DE LA MODIFICACIÓN: Kevin Yalama
DESCRIPCIÓN DE LA MODIFICACIÓN:
===========================================================
"""
from django.contrib import admin
from .models import Categoria, Producto, Perfil, Pedido, DetallePedido


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nombre',
        'marca',
        'categoria',
        'precio',
        'stock',
        'es_destacado',
        'es_promocion',
        'activo'
    )
    list_filter = ('categoria', 'marca', 'es_destacado', 'es_promocion', 'activo')
    search_fields = ('nombre', 'marca')


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'nombre', 'apellido', 'telefono', 'cedula')
    search_fields = ('nombre', 'apellido', 'cedula', 'user__username')


class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 0


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'fecha',
        'subtotal',
        'iva',
        'total',
        'estado',
        'nombres_facturacion',
        'cedula_facturacion',
    )
    list_filter = ('estado', 'fecha')
    search_fields = ('user__username', 'nombres_facturacion', 'cedula_facturacion')
    inlines = [DetallePedidoInline]


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pedido', 'producto', 'cantidad', 'precio', 'subtotal')
    search_fields = ('producto__nombre',)