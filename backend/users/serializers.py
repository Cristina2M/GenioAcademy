from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password

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
