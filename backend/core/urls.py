# ============================================================
# ARCHIVO: core/urls.py
# FUNCIÓN: Enrutador principal del proyecto Django.
#
# Este archivo es el "semáforo" de todas las peticiones HTTP que
# llegan al backend. Aquí decidimos a qué app de Django las enviamos.
#
# Estructura de la API:
#   /api/token/          → Login (JWT) y renovación de sesión
#   /api/users/          → Registro, perfil, vidas, minijuegos
#   /api/courses/        → Catálogo de cursos y progreso del alumno
#   /api/ai/             → Chat con Astro (tutor IA vía Groq)
#   /api/teachers/       → Claustro de profesores y tutorías
#   /admin/              → Panel de administración de Django
# ============================================================

from django.contrib import admin
from django.urls import path, include

# Importamos nuestras vistas de autenticación personalizadas:
# - MyTokenObtainPairView: Añade XP, nivel y avatar al token JWT estándar
# - SafeTokenRefreshView: Evita un crash 500 si el usuario fue borrado de la BD
from users.views import MyTokenObtainPairView, SafeTokenRefreshView

urlpatterns = [
    # Panel de Administración de Django (solo superusuarios)
    path('admin/', admin.site.urls),

    # Rutas de la API — cada app gestiona sus propias subrutas en su urls.py
    path('api/courses/', include('courses.urls')),
    path('api/users/', include('users.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/teachers/', include('teachers.urls')),

    # Autenticación JWT (Login y Refresco de sesión)
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', SafeTokenRefreshView.as_view(), name='token_refresh'),
]
