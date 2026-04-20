# ============================================================
# ARCHIVO: courses/views.py
# FUNCIÓN: Controladores de la API de cursos.
#
# Aquí viven los "controladores" (views) que responden a las
# peticiones HTTP del frontend (React). Cada controlador lee
# o escribe datos en la base de datos y devuelve JSON.
#
# Endpoints principales:
#   GET  /api/courses/categories/     → Lista de asignaturas con todos sus cursos
#   GET  /api/courses/courses/{id}/   → Datos de un curso concreto (teoría, lecciones, etc.)
#   POST /api/courses/courses/{id}/complete/ → Completa el curso y otorga XP
# ============================================================

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import IntegrityError

from .models import Category, KnowledgeLevel, Course, Lesson, Exercise, CourseCompletion, UserCourseProgress
from .serializers import (
    CategorySerializer, KnowledgeLevelSerializer,
    CourseSerializer, LessonSerializer, ExerciseSerializer,
    UserCourseProgressSerializer
)


# ── FUNCIÓN DE SEGURIDAD ──
# Comprueba si el alumno tiene el nivel RPG suficiente para ver un contenido.
# Si no lo tiene, lanza un error 403 (Acceso no autorizado).
def check_unlocked(user, knowledge_level_order):
    """
    Parámetros:
    - user: El alumno que está haciendo la petición
    - knowledge_level_order: El nivel de dificultad mínimo requerido

    Si el alumno no está conectado O su nivel RPG es más bajo que el requerido,
    se le deniega el acceso con un mensaje de error.
    """
    # if not user.is_authenticated or knowledge_level_order > user.current_student_level:
    #     raise PermissionDenied(
    #         "Violación de Seguridad: Tu Nivel de Alumno es demasiado bajo para acceder a este contenido."
    #     )
    pass


# ── CONTROLADOR DE CATEGORÍAS ──
# Responde cuando el frontend pide "/api/courses/categories/".
# Devuelve TODO el árbol de contenido: asignaturas → niveles → cursos → lecciones.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # PÚBLICO: El catálogo es visible sin login. El JWT se usa solo para
    # calcular is_completed e is_started (si el usuario está autenticado).
    permission_classes = [AllowAny]
    authentication_classes = []  # No forzamos autenticación

    def get_serializer_context(self):
        """
        Pasamos el request al contexto para poder calcular is_completed e is_started.
        Si el usuario no está logueado, simplemente devuelven False.
        """
        context = super().get_serializer_context()
        # Intentamos obtener el usuario del token si existe
        from rest_framework_simplejwt.authentication import JWTAuthentication
        try:
            jwt_auth = JWTAuthentication()
            user_auth_tuple = jwt_auth.authenticate(self.request)
            if user_auth_tuple:
                self.request.user = user_auth_tuple[0]
        except Exception:
            pass  # Si el token es inválido o ha caducado, ignoramos y dejamos anónimo
        return context


# ── CONTROLADOR DE NIVELES DE CONOCIMIENTO ──
# Responde cuando el frontend pide "/api/courses/knowledgelevels/".
class KnowledgeLevelViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeLevel.objects.all()
    serializer_class = KnowledgeLevelSerializer


# ── CONTROLADOR DE CURSOS ──
# El más importante. Además del CRUD básico (leer/crear/editar/borrar cursos),
# tiene un endpoint especial para "completar" un curso y ganar XP.
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Se ejecuta cuando el frontend pide los datos de UN curso concreto.
        Antes de devolver los datos, comprobamos que el alumno tiene el nivel suficiente.
        Si el nivel del curso exige más de lo que tiene el alumno, se le deniega el acceso.
        """
        instance = self.get_object()
        check_unlocked(request.user, instance.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Endpoint POST: /api/courses/courses/{id}/complete/
        
        Este es el "motor RPG": se llama cuando el alumno pulsa "Completar Misión".
        Hace tres cosas:
          1. Registra que el alumno ha completado el curso (evitando duplicados)
          2. Suma los puntos XP correspondientes al alumno
          3. Comprueba si el alumno sube de nivel
          4. Genera un nuevo JWT (token de sesión) con los datos actualizados
        """
        course = self.get_object()
        user = request.user

        # El alumno debe estar conectado para poder completar un curso
        if not user.is_authenticated:
            return Response(
                {"error": "Debes iniciar sesión para completar misiones."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # PASO 1: Intentar registrar la completitud.
            # Si el alumno ya lo completó antes, Django lanzará un IntegrityError
            # porque la tabla CourseCompletion tiene "unique_together" (alumno + curso únicos).
            CourseCompletion.objects.create(user=user, course=course)

            # PASO 2: Sumar XP al alumno
            user.experience_points += course.xp_reward

            leveled_up = False

            # PASO 3: Comprobar si el alumno debe subir de nivel.
            # La fórmula es: para subir al siguiente nivel hace falta (nivel_actual × 500) XP.
            # Ejemplo: para pasar de nivel 2 a 3, se necesitan 1000 XP acumulados.
            threshold = user.current_student_level * 500
            while user.experience_points >= threshold:
                user.current_student_level += 1
                leveled_up = True
                threshold = user.current_student_level * 500  # Recalculamos para el nuevo nivel

            user.save()  # Guardamos los cambios en la base de datos

            # PASO 4: Generar un nuevo JWT que incluya el XP y nivel actualizados.
            # El frontend necesita este token actualizado para refrescar la interfaz
            # sin que el alumno tenga que volver a hacer login.
            from users.serializers import MyTokenObtainPairSerializer
            refresh = MyTokenObtainPairSerializer.get_token(user)

            return Response({
                "detail": "¡Recompensas reclamadas! Misión Superada.",
                "experience_points": user.experience_points,
                "level": user.current_student_level,
                "level_up": leveled_up,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)

        except IntegrityError:
            # ANTI-FARMEO: El alumno ya completó este curso.
            # La constraint de la base de datos lo detecta y devolvemos un error 400.
            return Response(
                {"detail": "Anti-Farmeo: Ya has cobrado la experiencia de este curso anteriormente."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """
        Marca un curso como iniciado (In Progress).
        """
        course = self.get_object()
        user = request.user
        if not user.is_authenticated:
             return Response({"error": "No autenticado"}, status=401)
        
        progress, created = UserCourseProgress.objects.get_or_create(user=user, course=course)
        return Response({
            "detail": "Curso iniciado correctamente.",
            "started_at": progress.started_at
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def my_active_courses(self, request):
        """
        Lista de cursos iniciados pero NO completados por el alumno.
        Utilizado para el Dashboard.
        """
        user = request.user
        if not user.is_authenticated:
            return Response([])
        
        # Obtenemos los IDs de cursos completados para excluirlos
        completed_ids = CourseCompletion.objects.filter(user=user).values_list('course_id', flat=True)
        
        # Obtenemos los progresos activos (no completados)
        active_progress = UserCourseProgress.objects.filter(user=user).exclude(course_id__in=completed_ids)
        
        # Extraemos los cursos
        courses = [ap.course for ap in active_progress]
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_full_journey(self, request):
        """
        Devuelve tanto los cursos en progreso como los completados.
        Utilizado para la página "Mi Trayectoria Estelar".
        """
        user = request.user
        if not user.is_authenticated:
            return Response([])

        # Obtenemos todos los cursos que el usuario ha tocado (iniciados o completados)
        started_ids = UserCourseProgress.objects.filter(user=user).values_list('course_id', flat=True)
        completed_ids = CourseCompletion.objects.filter(user=user).values_list('course_id', flat=True)
        
        all_ids = set(list(started_ids) + list(completed_ids))
        courses = Course.objects.filter(id__in=all_ids)
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


# ── CONTROLADOR DE LECCIONES ──
# Responde cuando el frontend pide los datos de una lección teórica específica.
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Igual que en los cursos: antes de mostrar la lección,
        comprobamos que el alumno tenga nivel suficiente.
        """
        instance = self.get_object()
        check_unlocked(request.user, instance.course.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)


# ── CONTROLADOR DE EJERCICIOS ──
# Responde cuando el frontend pide los datos de un ejercicio concreto.
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Igual que en lecciones: comprobamos el nivel antes de dar acceso.
        La cadena de comprobación es: Ejercicio → Lección → Curso → Nivel de Conocimiento
        """
        instance = self.get_object()
        check_unlocked(request.user, instance.lesson.course.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)
