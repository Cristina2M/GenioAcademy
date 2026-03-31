# Importaciones necesarias para crear los controladores de la API (Vistas)
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import UserSerializer, MyTokenObtainPairSerializer

# Vista personalizada para generar el JWT enriquecido
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Endpoint dedicado exclusivamente para Registro de Alumnos
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

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

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def update_avatar(self, request):
        """
        Permite al usuario conectado cambiar su Búho/Avatar.
        Recibe {"selected_avatar": "buhoX"}
        Devuelve el nuevo par de Tokens para que React refresque sus estados invisibles.
        """
        user = request.user
        new_avatar_id = request.data.get('selected_avatar')
        
        if not new_avatar_id:
            return Response({"error": "No se ha proporcionado un avatar."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Podríamos añadir aquí una comprobación de que el buho requerido no supera el user.current_student_level
        # Pero nos fiaremos de que el frontend bloquea la compra por ahora.
        user.selected_avatar = new_avatar_id
        user.save()

        # Generamos un nuevo token JWT fresco con el nuevo Selected_avatar inyectado
        refresh = MyTokenObtainPairSerializer.get_token(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'detail': 'Avatar actualizado correctamente. Reactivando sistemas...'
        }, status=status.HTTP_200_OK)
