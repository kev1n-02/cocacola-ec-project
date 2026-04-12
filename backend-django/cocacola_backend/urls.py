"""
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 08/04/2026
DESCRIPCIÓN:
Archivo principal de configuración de rutas del proyecto.
Define las URLs globales para el panel administrativo
de Django y la integración de rutas de la API del módulo users.
===========================================================
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),

    # 🔐 LOGIN JWT
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
