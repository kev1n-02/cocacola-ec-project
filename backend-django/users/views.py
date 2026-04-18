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
FECHA DE MODIFICACIÓN: 13/04/2026
DESCRIPCIÓN DE LA MODIFICACIÓN:

===========================================================
"""
from decimal import Decimal

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Producto, Perfil, Pedido, DetallePedido, Categoria
from .serializers import (
    ProductoSerializer,
    PerfilSerializer,
    PedidoSerializer,
    CategoriaSerializer,
)


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
def obtener_categorias(request):
    categorias = Categoria.objects.all().order_by('nombre')
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def obtener_productos(request):
    categoria = request.GET.get('categoria')
    marca = request.GET.get('marca')
    destacados = request.GET.get('destacados')
    promociones = request.GET.get('promociones')

    productos = Producto.objects.filter(activo=True)

    if categoria:
        productos = productos.filter(categoria__nombre__iexact=categoria)

    if marca:
        productos = productos.filter(marca__iexact=marca)

    if destacados == 'true':
        productos = productos.filter(es_destacado=True)

    if promociones == 'true':
        productos = productos.filter(es_promocion=True)

    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def get_profile(request):
    user_id = request.data.get('user_id')

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    try:
        perfil = Perfil.objects.get(user_id=user_id)
        serializer = PerfilSerializer(perfil)
        return Response(serializer.data)
    except Perfil.DoesNotExist:
        return Response({'error': 'Perfil no encontrado'}, status=404)


@api_view(['PUT'])
def update_profile(request):
    user_id = request.data.get('user_id')

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    try:
        perfil = Perfil.objects.get(user_id=user_id)
        user = perfil.user

        perfil.nombre = request.data.get('nombre', perfil.nombre)
        perfil.apellido = request.data.get('apellido', perfil.apellido)
        perfil.fecha_nacimiento = request.data.get('fecha_nacimiento', perfil.fecha_nacimiento)
        perfil.nacionalidad = request.data.get('nacionalidad', perfil.nacionalidad)
        perfil.telefono = request.data.get('telefono', perfil.telefono)
        perfil.cedula = request.data.get('cedula', perfil.cedula)

        nuevo_correo = request.data.get('correo')
        if nuevo_correo:
            if User.objects.exclude(id=user.id).filter(username=nuevo_correo).exists():
                return Response({'error': 'Ese correo ya está en uso'}, status=400)

            user.username = nuevo_correo
            user.email = nuevo_correo

        user.first_name = request.data.get('nombre', user.first_name)
        user.last_name = request.data.get('apellido', user.last_name)

        user.save()
        perfil.save()

        return Response({'message': 'Perfil actualizado correctamente'})
    except Perfil.DoesNotExist:
        return Response({'error': 'Perfil no encontrado'}, status=404)


@api_view(['PUT'])
def change_password(request):
    user_id = request.data.get('user_id')
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not user_id or not current_password or not new_password or not confirm_password:
        return Response({'error': 'Todos los campos son obligatorios'}, status=400)

    if new_password != confirm_password:
        return Response({'error': 'Las nuevas contraseñas no coinciden'}, status=400)

    try:
        user = User.objects.get(id=user_id)

        if not user.check_password(current_password):
            return Response({'error': 'La contraseña actual es incorrecta'}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Contraseña actualizada correctamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)


@api_view(['DELETE'])
def delete_user(request):
    user_id = request.data.get('user_id')

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'Cuenta eliminada correctamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)


@api_view(['POST'])
def create_order(request):
    user_id = request.data.get('user_id')
    items = request.data.get('items', [])

    nombres_facturacion = request.data.get('nombres_facturacion', '')
    direccion_facturacion = request.data.get('direccion_facturacion', '')
    cedula_facturacion = request.data.get('cedula_facturacion', '')

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    if not items:
        return Response({'error': 'No hay productos en la compra'}, status=400)

    if not nombres_facturacion or not direccion_facturacion or not cedula_facturacion:
        return Response(
            {'error': 'Los datos de facturación son obligatorios'},
            status=400
        )

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

    with transaction.atomic():
        pedido = Pedido.objects.create(
            user=user,
            subtotal=0,
            iva=0,
            total=0,
            estado='pendiente',
            nombres_facturacion=nombres_facturacion,
            direccion_facturacion=direccion_facturacion,
            cedula_facturacion=cedula_facturacion
        )

        subtotal_general = Decimal('0.00')

        for item in items:
            producto_id = item.get('producto_id')
            cantidad = int(item.get('cantidad', 1))

            try:
                producto = Producto.objects.get(id=producto_id, activo=True)
            except Producto.DoesNotExist:
                return Response({'error': f'Producto {producto_id} no encontrado'}, status=404)

            subtotal_item = Decimal(producto.precio) * cantidad
            subtotal_general += subtotal_item

            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio,
                subtotal=subtotal_item
            )

        iva = subtotal_general * Decimal('0.15')
        total = subtotal_general + iva

        pedido.subtotal = subtotal_general
        pedido.iva = iva
        pedido.total = total
        pedido.save()

    return Response(
        {
            'message': 'Compra realizada correctamente',
            'pedido_id': pedido.id,
            'subtotal': pedido.subtotal,
            'iva': pedido.iva,
            'total': pedido.total
        },
        status=201
    )


@api_view(['POST'])
def my_orders(request):
    user_id = request.data.get('user_id')

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    pedidos = Pedido.objects.filter(user_id=user_id).order_by('-fecha')
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def order_detail(request):
    user_id = request.data.get('user_id')
    pedido_id = request.data.get('pedido_id')

    if not user_id or not pedido_id:
        return Response({'error': 'user_id y pedido_id son obligatorios'}, status=400)

    try:
        pedido = Pedido.objects.get(id=pedido_id, user_id=user_id)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)
    except Pedido.DoesNotExist:
        return Response({'error': 'Pedido no encontrado'}, status=404)