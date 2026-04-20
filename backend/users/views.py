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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils import timezone
from datetime import timedelta
from .models import CustomUser, MinigameLog
from .serializers import UserSerializer, MyTokenObtainPairSerializer, SafeTokenRefreshSerializer


# ── CONTROLADOR DE LOGIN (Token JWT) ──
# Cuando el alumno hace login, llamamos a este controlador.
# Usa nuestro serializador personalizado para que el token incluya XP, nivel, avatar, etc.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class SafeTokenRefreshView(TokenRefreshView):
    serializer_class = SafeTokenRefreshSerializer


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


# ── SISTEMA DE VIDAS (PLANETAS) ──

LIFE_REGEN_SECONDS = 600       # ⏱️ 10 minutos (evita que se recupere vida mientras juegas)
MINIGAME_COOLDOWN_SECONDS = 30 # ⏱️ 30 segundos para pruebas
MAX_LIVES = 3                  # Límite de planetas que puede tener cualquier alumno


def sync_lives(user):
    """
    Motor de regeneración pasiva de vidas.

    Este helper se llama cada vez que el alumno hace una petición al servidor.
    Calcula cuántas fracciones de 2 horas han pasado desde que perdió la última vida
    y añade los planetas que le corresponden sin necesidad de tareas en segundo plano.
    """
    if user.lives_count >= MAX_LIVES:
        # Si ya tiene el máximo, no hay nada que calcular
        return

    if not user.last_life_lost_at:
        # Si nunca perdió una vida, nada que hacer
        return

    now = timezone.now()
    elapsed = now - user.last_life_lost_at  # Tiempo transcurrido desde la última pérdida
    lives_to_restore = int(elapsed.total_seconds() // LIFE_REGEN_SECONDS)

    if lives_to_restore > 0:
        new_lives = min(user.lives_count + lives_to_restore, MAX_LIVES)
        user.lives_count = new_lives
        if user.lives_count >= MAX_LIVES:
            user.last_life_lost_at = None  # Reloj apagado: ya está completo
        else:
            # Avanzamos el reloj solo el tiempo consumido (respetando el sobrante)
            user.last_life_lost_at += timedelta(seconds=LIFE_REGEN_SECONDS * lives_to_restore)
        user.save()
        
def get_lives_data(user):
    """
    Helper para obtener el estado completo de vidas y minijuegos de un usuario.
    Se usa en LivesView, DecreaseLivesView y MinigamePlayView para mantener
    al frontend siempre sincronizado con los datos más recientes.
    """
    sync_lives(user)

    # Calculamos el tiempo restante para el siguiente planeta
    seconds_until_next = None
    if user.lives_count < MAX_LIVES and user.last_life_lost_at:
        elapsed = (timezone.now() - user.last_life_lost_at).total_seconds()
        remaining = LIFE_REGEN_SECONDS - (elapsed % LIFE_REGEN_SECONDS)
        seconds_until_next = int(remaining)

    # Los minijuegos solo se desbloquean para alumnos Plan 3 con 0 vidas
    can_play_minigame = (user.subscription_level == 3 and user.lives_count == 0)

    # Calculamos el cooldown actual de cada minijuego consumido
    minigames_cooldowns = {}
    now = timezone.now()
    cooldown_limit = now - timedelta(seconds=MINIGAME_COOLDOWN_SECONDS)
    
    recent_logs = MinigameLog.objects.filter(
        user=user,
        played_at__gte=cooldown_limit
    )
    
    for log in recent_logs:
        elapsed_mg = (now - log.played_at).total_seconds()
        remaining_mg = MINIGAME_COOLDOWN_SECONDS - elapsed_mg
        if remaining_mg > 0:
            if log.minigame_id not in minigames_cooldowns or remaining_mg > minigames_cooldowns[log.minigame_id]:
                minigames_cooldowns[log.minigame_id] = int(remaining_mg)

    return {
        'lives': user.lives_count,
        'max_lives': MAX_LIVES,
        'seconds_until_next_life': seconds_until_next,
        'can_play_minigame': can_play_minigame,
        'minigames_cooldowns': minigames_cooldowns,
    }


class LivesView(APIView):
    """
    GET /api/users/lives/

    Devuelve el estado actual de los planetas del alumno conectado.
    Incluye cuántos tiene, cuánto tiempo falta para el siguiente y si tiene acceso a minijuegos.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_lives_data(request.user)
        return Response(data)


class DecreaseLivesView(APIView):
    """
    POST /api/users/lives/decrease/

    Invocado cuando el alumno falla una evaluación.
    Resta 1 planeta e inicia el reloj de regeneración si no estaba ya corriendo.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        sync_lives(user)  # Sincronizamos antes de modificar

        if user.lives_count <= 0:
            return Response(
                {'detail': 'Sin planetas disponibles. Juega un minijuego para recuperar uno.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.lives_count -= 1
        # Arrancamos el reloj solo si no estaba ya corriendo (no lo reseteamos)
        if not user.last_life_lost_at:
            user.last_life_lost_at = timezone.now()
        user.save()

        data = get_lives_data(user)
        data['detail'] = f'Has perdido un planeta. Te quedan {user.lives_count}/3.'
        return Response(data)


class MinigamePlayView(APIView):
    """
    POST /api/users/minigames/play/

    Endpoint de validación del minijuego. El frontend lo llama cuando el alumno
    ha completado correctamente el minijuego, indicando cuál fue:
        { "minigame_id": "pairs", "won": true }

    Reglas aplicadas:
    - Solo accesible para alumnos con Plan 3 (Agujero de Gusano)
    - Solo disponible cuando el alumno tiene 0 vidas
    - El mismo minijuego solo puede jugarse 1 vez cada 24 horas
    - Si gana: recupera 1 vida SIN resetear el reloj de regeneración pasiva
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        sync_lives(user)

        # Solo Plan 3 tiene acceso a los minijuegos
        if user.subscription_level < 3:
            return Response(
                {'detail': 'Los minijuegos de emergencia son exclusivos del Plan Agujero de Gusano.'},
                status=status.HTTP_403_FORBIDDEN
            )

        minigame_id = request.data.get('minigame_id')
        won = request.data.get('won', False)

        if not minigame_id:
            return Response({'detail': 'Falta el ID del minijuego.'}, status=status.HTTP_400_BAD_REQUEST)

        # Comprobamos el cooldown actual
        cooldown_limit = timezone.now() - timedelta(seconds=MINIGAME_COOLDOWN_SECONDS)
        recently_played = MinigameLog.objects.filter(
            user=user,
            minigame_id=minigame_id,
            played_at__gte=cooldown_limit
        ).exists()

        if recently_played:
            return Response(
                {'detail': f'Ya jugaste "{minigame_id}" recientemente.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        # Registramos la jugada SIEMPRE que se intente (para activar cooldown pase lo que pase)
        # Esto evita que el bloqueo falle si el alumno recupera una vida pasivamente mientras juega.
        MinigameLog.objects.create(user=user, minigame_id=minigame_id)

        # Si recuperó una vida pasivamente, le dejamos terminar pero no le damos otra adicional si ganó
        if user.lives_count > 0 and won:
            data = get_lives_data(user)
            data['detail'] = 'Ya habías recuperado un planeta automáticamente.'
            return Response(data)

        if won:
            # Recupera 1 vida SIN tocar el reloj de regeneración pasiva
            user.lives_count = 1
            user.save()

        data = get_lives_data(user)
        if won:
            data['detail'] = '¡Minijuego superado! Has recuperado 1 planeta.'
        else:
            data['detail'] = 'No superaste el minijuego esta vez. Cooldown activado.'
        
        return Response(data)
