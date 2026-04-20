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
from datetime import date
import re

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import transaction

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .models import Producto, Perfil, Pedido, DetallePedido, Categoria
from .serializers import (
    ProductoSerializer,
    PerfilSerializer,
    PedidoSerializer,
    CategoriaSerializer,
)


# =========================
# VALIDACIONES AUXILIARES
# =========================

def validar_solo_letras(valor: str) -> bool:
    patron = r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$'
    return bool(re.fullmatch(patron, valor.strip()))


def validar_password_segura(password: str) -> bool:
    """
    Mínimo 6 caracteres, al menos:
    - una minúscula
    - una mayúscula
    - un número
    - un carácter especial
    """
    patron = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@._\-#$%&*!])[A-Za-z\d@._\-#$%&*!]{6,}$'
    return bool(re.fullmatch(patron, password))


def validar_mayoria_edad(fecha_nacimiento) -> bool:
    hoy = date.today()
    edad = hoy.year - fecha_nacimiento.year - (
        (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day)
    )
    return edad >= 18


def validar_cedula_ecuatoriana(cedula: str) -> bool:
    if not cedula.isdigit():
        return False

    if len(cedula) != 10:
        return False

    provincia = int(cedula[:2])
    tercer_digito = int(cedula[2])

    if provincia < 1 or provincia > 24:
        return False

    if tercer_digito >= 6:
        return False

    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    suma = 0

    for i in range(9):
        valor = int(cedula[i]) * coeficientes[i]
        if valor > 9:
            valor -= 9
        suma += valor

    verificador = (10 - (suma % 10)) % 10

    return verificador == int(cedula[9])


# =========================
# AUTENTICACIÓN
# =========================

@api_view(['POST'])
def register_user(request):
    data = request.data

    nombre = (data.get('nombre') or '').strip()
    apellido = (data.get('apellido') or '').strip()
    fecha_nacimiento = data.get('fecha_nacimiento')
    nacionalidad = (data.get('nacionalidad') or '').strip()
    correo = (data.get('correo') or '').strip()
    telefono = (data.get('telefono') or '').strip()
    cedula = (data.get('cedula') or '').strip()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''

    # CAMPOS OBLIGATORIOS
    if not nombre:
        return Response({'error': 'Los nombres son obligatorios'}, status=400)

    if not apellido:
        return Response({'error': 'Los apellidos son obligatorios'}, status=400)

    if not fecha_nacimiento:
        return Response({'error': 'La fecha de nacimiento es obligatoria'}, status=400)

    if not nacionalidad:
        return Response({'error': 'La nacionalidad es obligatoria'}, status=400)

    if not correo:
        return Response({'error': 'El correo es obligatorio'}, status=400)

    if not cedula:
        return Response({'error': 'La cédula es obligatoria'}, status=400)

    if not password or not confirm_password:
        return Response({'error': 'La contraseña y su confirmación son obligatorias'}, status=400)

    # VALIDACIÓN DE NOMBRE / APELLIDO / NACIONALIDAD
    if not validar_solo_letras(nombre):
        return Response({'error': 'Los nombres solo deben contener letras'}, status=400)

    if not validar_solo_letras(apellido):
        return Response({'error': 'Los apellidos solo deben contener letras'}, status=400)

    if not validar_solo_letras(nacionalidad):
        return Response({'error': 'La nacionalidad solo debe contener letras'}, status=400)

    # VALIDACIÓN DE CORREO
    try:
        validate_email(correo)
    except ValidationError:
        return Response({'error': 'El correo electrónico no es válido'}, status=400)

    # VALIDACIÓN DE CÉDULA
    if not cedula.isdigit():
        return Response({'error': 'La cédula solo debe contener números'}, status=400)

    if not validar_cedula_ecuatoriana(cedula):
        return Response({'error': 'La cédula ecuatoriana no es válida'}, status=400)

    # VALIDACIÓN DE CONTRASEÑA
    if password != confirm_password:
        return Response({'error': 'Las contraseñas no coinciden'}, status=400)

    if not validar_password_segura(password):
        return Response(
            {
                'error': 'La contraseña debe tener mínimo 6 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial'
            },
            status=400
        )

    # VALIDACIÓN DE FECHA Y MAYORÍA DE EDAD
    try:
        fecha_obj = date.fromisoformat(fecha_nacimiento)
    except ValueError:
        return Response({'error': 'La fecha de nacimiento no es válida'}, status=400)

    if not validar_mayoria_edad(fecha_obj):
        return Response({'error': 'Debes ser mayor de edad para registrarte'}, status=400)

    # VALIDACIÓN DE DUPLICADOS
    if User.objects.filter(username=correo).exists():
        return Response({'error': 'El correo ya está registrado'}, status=400)

    if Perfil.objects.filter(cedula=cedula).exists():
        return Response({'error': 'La cédula ya está registrada'}, status=400)

    # CREACIÓN DE USUARIO
    user = User.objects.create_user(
        username=correo,
        email=correo,
        password=password,
        first_name=nombre,
        last_name=apellido
    )

    Perfil.objects.create(
        user=user,
        nombre=nombre,
        apellido=apellido,
        fecha_nacimiento=fecha_obj,
        nacionalidad=nacionalidad,
        telefono=telefono,
        cedula=cedula
    )

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            'message': 'Usuario registrado correctamente',
            'token': token.key
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def login_user(request):
    correo = (request.data.get('username') or request.data.get('correo') or '').strip()
    password = request.data.get('password') or ''

    if not correo:
        return Response({'error': 'Debes ingresar el correo'}, status=400)

    try:
        validate_email(correo)
    except ValidationError:
        return Response({'error': 'El correo electrónico no es válido'}, status=400)

    if not password:
        return Response({'error': 'Debes ingresar la contraseña'}, status=400)

    user = authenticate(username=correo, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'message': 'Login exitoso',
                'token': token.key,
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


# =========================
# PRODUCTOS Y CATEGORÍAS
# =========================

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


# =========================
# PERFIL
# =========================

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

        nombre = request.data.get('nombre', perfil.nombre).strip()
        apellido = request.data.get('apellido', perfil.apellido).strip()
        fecha_nacimiento = request.data.get('fecha_nacimiento', perfil.fecha_nacimiento)
        nacionalidad = request.data.get('nacionalidad', perfil.nacionalidad).strip()
        telefono = request.data.get('telefono', perfil.telefono).strip()
        cedula = request.data.get('cedula', perfil.cedula).strip()
        nuevo_correo = (request.data.get('correo') or user.email).strip()

        if not validar_solo_letras(nombre):
            return Response({'error': 'Los nombres solo deben contener letras'}, status=400)

        if not validar_solo_letras(apellido):
            return Response({'error': 'Los apellidos solo deben contener letras'}, status=400)

        if not validar_solo_letras(nacionalidad):
            return Response({'error': 'La nacionalidad solo debe contener letras'}, status=400)

        try:
            validate_email(nuevo_correo)
        except ValidationError:
            return Response({'error': 'El correo electrónico no es válido'}, status=400)

        if not cedula.isdigit():
            return Response({'error': 'La cédula solo debe contener números'}, status=400)

        if not validar_cedula_ecuatoriana(cedula):
            return Response({'error': 'La cédula ecuatoriana no es válida'}, status=400)

        try:
            fecha_obj = date.fromisoformat(str(fecha_nacimiento))
        except ValueError:
            return Response({'error': 'La fecha de nacimiento no es válida'}, status=400)

        if not validar_mayoria_edad(fecha_obj):
            return Response({'error': 'Debes ser mayor de edad'}, status=400)

        if User.objects.exclude(id=user.id).filter(username=nuevo_correo).exists():
            return Response({'error': 'Ese correo ya está en uso'}, status=400)

        if Perfil.objects.exclude(user_id=user.id).filter(cedula=cedula).exists():
            return Response({'error': 'La cédula ya está registrada'}, status=400)

        perfil.nombre = nombre
        perfil.apellido = apellido
        perfil.fecha_nacimiento = fecha_obj
        perfil.nacionalidad = nacionalidad
        perfil.telefono = telefono
        perfil.cedula = cedula

        user.username = nuevo_correo
        user.email = nuevo_correo
        user.first_name = nombre
        user.last_name = apellido

        user.save()
        perfil.save()

        return Response({'message': 'Perfil actualizado correctamente'})
    except Perfil.DoesNotExist:
        return Response({'error': 'Perfil no encontrado'}, status=404)


@api_view(['PUT'])
def change_password(request):
    user_id = request.data.get('user_id')
    current_password = request.data.get('current_password') or ''
    new_password = request.data.get('new_password') or ''
    confirm_password = request.data.get('confirm_password') or ''

    if not user_id or not current_password or not new_password or not confirm_password:
        return Response({'error': 'Todos los campos son obligatorios'}, status=400)

    if new_password != confirm_password:
        return Response({'error': 'Las nuevas contraseñas no coinciden'}, status=400)

    if not validar_password_segura(new_password):
        return Response(
            {
                'error': 'La nueva contraseña debe tener mínimo 6 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial'
            },
            status=400
        )

    try:
        user = User.objects.get(id=user_id)

        if not user.check_password(current_password):
            return Response({'error': 'La contraseña actual es incorrecta'}, status=400)

        user.set_password(new_password)
        user.save()

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Contraseña actualizada correctamente',
            'token': token.key
        })
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


# =========================
# PEDIDOS
# =========================

@api_view(['POST'])
def create_order(request):
    user_id = request.data.get('user_id')
    items = request.data.get('items', [])

    nombres_facturacion = (request.data.get('nombres_facturacion') or '').strip()
    direccion_facturacion = (request.data.get('direccion_facturacion') or '').strip()
    cedula_facturacion = (request.data.get('cedula_facturacion') or '').strip()

    if not user_id:
        return Response({'error': 'user_id es obligatorio'}, status=400)

    if not items:
        return Response({'error': 'No hay productos en la compra'}, status=400)

    if not nombres_facturacion or not direccion_facturacion or not cedula_facturacion:
        return Response(
            {'error': 'Los datos de facturación son obligatorios'},
            status=400
        )

    if not validar_solo_letras(nombres_facturacion):
        return Response({'error': 'Los nombres de facturación solo deben contener letras'}, status=400)

    if not cedula_facturacion.isdigit():
        return Response({'error': 'La cédula de facturación solo debe contener números'}, status=400)

    if not validar_cedula_ecuatoriana(cedula_facturacion):
        return Response({'error': 'La cédula de facturación no es válida'}, status=400)

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

            if cantidad <= 0:
                return Response({'error': 'La cantidad debe ser mayor a cero'}, status=400)

            try:
                producto = Producto.objects.get(id=producto_id, activo=True)
            except Producto.DoesNotExist:
                return Response({'error': f'Producto {producto_id} no encontrado'}, status=404)

            if producto.stock < cantidad:
                return Response(
                    {'error': f'Stock insuficiente para {producto.nombre}'},
                    status=400
                )

            subtotal_item = Decimal(producto.precio) * cantidad
            subtotal_general += subtotal_item

            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio,
                subtotal=subtotal_item
            )

            producto.stock -= cantidad
            producto.save()

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