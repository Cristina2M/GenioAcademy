# ============================================================
# ARCHIVO: users/views.py
# FUNCIÓN: Controladores de la API de usuarios.
#
# Gestiona tres funcionalidades principales:
#   1. Login: El alumno introduce usuario y contraseña y recibe un token JWT
#   2. Registro: El alumno crea su cuenta con el plan elegido
#   3. Cambio de avatar: El alumno elige su búho y se actualiza en tiempo real
# ============================================================

from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import UserSerializer, MyTokenObtainPairSerializer


# ── CONTROLADOR DE LOGIN (Token JWT) ──
# Cuando el alumno hace login, llamamos a este controlador.
# Usa nuestro serializador personalizado para que el token incluya XP, nivel, avatar, etc.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ── CONTROLADOR DE REGISTRO ──
# Cuando el alumno completa el formulario de registro, este controlador
# crea su cuenta en la base de datos con el plan de suscripción elegido.
# No requiere autenticación previa (AllowAny = cualquiera puede acceder).
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


# ── CONTROLADOR DE USUARIOS (CRUD completo) ──
# Para gestión interna de usuarios. El panel de admin de Django lo usa,
# y también se puede usar para consultas de perfil en el futuro.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Define quién puede hacer qué según el tipo de acción:
        - Crear (registro): cualquiera puede hacerlo
        - Resto (ver, editar, borrar): requiere estar conectado
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def update_avatar(self, request):
        """
        Endpoint POST: /api/users/users/update_avatar/

        Permite al alumno conectado cambiar su búho/avatar activo.
        
        Recibe en el cuerpo de la petición:
            { "selected_avatar": "buho3" }
        
        Devuelve un nuevo par de tokens JWT con el avatar actualizado,
        para que la barra de navegación y el perfil se refresquen al instante
        sin que el alumno tenga que volver a hacer login.
        """
        user = request.user
        new_avatar_id = request.data.get('selected_avatar')

        # Validamos que se haya mandado el ID del avatar
        if not new_avatar_id:
            return Response(
                {"error": "No se ha proporcionado un avatar en la petición."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # NOTA PARA EL FUTURO: Aquí podríamos añadir una comprobación para asegurarnos
        # de que el búho solicitado corresponde a un nivel que el alumno ha desbloqueado.
        # Por ahora confiamos en que el frontend ya bloquea los búhos no disponibles.

        # Guardamos el nuevo avatar en la base de datos
        user.selected_avatar = new_avatar_id
        user.save()

        # Generamos un nuevo token JWT con el avatar actualizado inyectado
        refresh = MyTokenObtainPairSerializer.get_token(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'detail': 'Avatar actualizado correctamente. Reactivando sistemas...'
        }, status=status.HTTP_200_OK)
