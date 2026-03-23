# Importación de Serializers desde Django Rest Framework
from rest_framework import serializers
from .models import CustomUser

# Creamos el serializador para transformar los datos del usuario a JSON y viceversa
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # Definimos el modelo sobre el cual actuará este serializador
        model = CustomUser
        # Exponemos únicamente campos seguros para evitar fugas de información sensible como contraseñas
        fields = ('id', 'username', 'email', 'subscription_level')
