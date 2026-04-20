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
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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
        token['is_teacher'] = hasattr(user, 'professor_profile')

        # Datos del profesor (si el usuario es un maestro)
        token['is_teacher'] = hasattr(user, 'professor_profile')
        if hasattr(user, 'professor_profile'):
            # Guardamos la ruta de imagen real del profesor para que el Navbar la muestre
            # El campo avatar_url contiene la ruta pública: /assets/professors/prof_math.png
            token['professor_image'] = user.professor_profile.avatar_url or ''

        return token


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
        Convertimos la contraseña en texto plano a un hash seguro (sha256 + salt)
        antes de guardarla en la base de datos. Nunca guardamos contraseñas en texto.
        """
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
