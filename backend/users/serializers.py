from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Custom Token Serializer para inyectar datos del RPG en el Payload de React
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Inyectamos nuestros datos extra de gamificación
        token['username'] = user.username
        token['current_student_level'] = user.current_student_level
        token['experience_points'] = user.experience_points
        token['selected_avatar'] = user.selected_avatar
        token['subscription_level'] = user.subscription_level

        return token

# Creamos el serializador para transformar los datos del usuario a JSON y viceversa
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # Definimos el modelo sobre el cual actuará este serializador
        model = CustomUser
        # Exponemos campos, incluyendo la contraseña protegida
        fields = ('id', 'username', 'email', 'password', 'subscription_level')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # Sobrescribimos el método create para asegurar que la contraseña se guarde encriptada (hashing)
    def create(self, validated_data):
        # Encriptamos la contraseña por seguridad antes de guardarla en BBDD
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
