# Importaciones necesarias para crear los controladores de la API (Vistas)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import CustomUser
from .serializers import UserSerializer

# Definimos el conjunto de vistas (ViewSet) para manejar las operaciones sobre 'CustomUser'
class UserViewSet(viewsets.ModelViewSet):
    # La consulta que obtiene todos los usuarios de la base de datos
    queryset = CustomUser.objects.all()
    # Especifica el serializador que se encarga de dar formato json a los usuarios
    serializer_class = UserSerializer

    # Modificamos los permisos por defecto: Crear requiere estar anónimo/permitido
    def get_permissions(self):
        if self.action == 'create':
            # Permite el registro de nuevos estudiantes sin autenticación previa
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]
