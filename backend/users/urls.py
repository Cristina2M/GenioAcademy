# ============================================================
# ARCHIVO: users/urls.py
# FUNCIÓN: Define las rutas de la API para los Alumnos/Usuarios.
#
# Endpoints disponibles bajo /api/users/:
#   /register/            → Crear nueva cuenta de alumno
#   /lives/               → Consultar estado de planetas (vidas)
#   /lives/decrease/      → Restar 1 planeta al fallar una evaluación
#   /minigames/play/      → Validar la victoria en un minijuego de rescate
#   /forgot-password/     → Solicitar email de recuperación de contraseña
#   /reset-password/      → Confirmar nueva contraseña con token seguro
#   /management/          → CRUD completo de usuarios (gestión interna)
# ============================================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, RegisterView, LivesView, DecreaseLivesView, MinigamePlayView,
    ForgotPasswordView, ResetPasswordView
)

router = DefaultRouter()
router.register(r'management', UserViewSet, basename='user-management')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    # Sistema de vidas (planetas)
    path('lives/', LivesView.as_view(), name='lives_status'),
    path('lives/decrease/', DecreaseLivesView.as_view(), name='lives_decrease'),
    path('minigames/play/', MinigamePlayView.as_view(), name='minigame_play'),
    # Recuperación de contraseña
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('', include(router.urls)),
]

