# ============================================================
# ARCHIVO: users/serializers.py
# FUNCIÓN: Define cómo se transforman los datos del alumno a JSON
#          y qué información extra se mete dentro del Token JWT.
#
# El JWT (JSON Web Token) es el "carnet" digital del alumno.
# Cada vez que el alumno hace una petición al backend, envía este
# carnet para demostrar que está conectado y quién es.
# Nosotros "enriquecemos" el carnet con datos extra de gamificación
# para que el frontend no tenga que hacer peticiones adicionales.
# ============================================================

from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth import get_user_model


# ── SERIALIZADOR DE TOKEN PERSONALIZADO ──
# Django REST Framework JWT genera tokens básicos con solo el ID del usuario.
# Nosotros lo personalizamos para añadir datos extra del alumno.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        """
        Este método se llama cada vez que se genera un token JWT:
        - Al hacer login
        - Al completar un curso (para refrescar nivel y XP)
        - Al cambiar de avatar

        Añadimos datos de gamificación para que React los pueda leer
        directamente del token sin hacer peticiones extra al backend.
        """
        # Llamamos al método padre para obtener el token base (con ID y fecha de expiración)
        token = super().get_token(user)

        # Inyectamos nuestros datos de gamificación dentro del token
        token['username'] = user.username
        token['current_student_level'] = user.current_student_level
        token['experience_points'] = user.experience_points
        token['selected_avatar'] = user.selected_avatar
        token['subscription_level'] = user.subscription_level  # Plan 1, 2 o 3

        # Datos del profesor (si el usuario es un maestro)
        # hasattr es seguro para verificar relaciones uno-a-uno
        if hasattr(user, 'professor_profile'):
            token['is_teacher'] = True
            # Guardamos la ruta de imagen real del profesor para que el Navbar la muestre
            token['professor_image'] = user.professor_profile.avatar_url or ''
        else:
            token['is_teacher'] = False

        return token


# ── SERIALIZADOR DE REFRESCO SEGURO ──
# SimpleJWT lanza un error 500 (DoesNotExist) si intentamos refrescar un token
# de un usuario que ha sido borrado de la base de datos.
# Este serializador captura el error y lo convierte en un 401 limpio.
class SafeTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except get_user_model().DoesNotExist:
            from rest_framework_simplejwt.exceptions import AuthenticationFailed
            raise AuthenticationFailed(
                "El usuario vinculado a este token ya no existe.",
                code="user_not_found"
            )


# ── SERIALIZADOR DE USUARIO (para REGISTRO) ──
# Se usa cuando el alumno se registra por primera vez.
# Recibe: username, email, password, subscription_level
# La contraseña se transforma automáticamente a un hash seguro antes de guardarla.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'subscription_level')
        extra_kwargs = {
            # write_only=True significa que la contraseña se puede MANDAR dentro del JSON
            # pero nunca se devuelve en ninguna respuesta (por seguridad)
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """
        Se ejecuta al completar el registro.
        Usamos create_user (método nativo del UserManager de Django)
        que ya se encarga automáticamente de hashear la contraseña de forma segura.
        """
        return CustomUser.objects.create_user(**validated_data)
