# ============================================================
# ARCHIVO: teachers/views.py
# FUNCIÓN: Endpoints de la API para todo lo relacionado con profesores.
#
# Gestiona tres áreas principales:
#   1. Catálogo de Profesores: La lista que ven padres y alumnos en el Claustro.
#   2. Tutorías (Consultas): Los alumnos de Nivel 3 envían preguntas a los profes.
#   3. Videollamadas Jitsi: El profesor inicia/termina la llamada; el alumno solo se une.
# ============================================================

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model

from .models import Professor, Consultation
from .serializers import ProfessorSerializer, ConsultationSerializer
from courses.models import CourseCompletion

# Obtenemos el modelo de usuario personalizado (CustomUser) de forma dinámica
# para no depender de una ruta fija e importación directa
UsuarioPersonalizado = get_user_model()


# ── CATÁLOGO DE PROFESORES ──
class ProfessorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista de solo lectura para el catálogo de profesores.

    Lógica de visibilidad:
    - Visitantes no logueados (padres): Solo ven los profesores marcados como
      destacados (is_featured=True), pensado para la sección pública.
    - Alumnos logueados: Ven el claustro completo.
    - Filtro opcional por ?course_id=X para el Modal de Tutorías (filtra por materia).
    """
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]  # Cualquiera puede consultar el catálogo

    def get_queryset(self):
        # Obtenemos el usuario que hace la petición
        usuario = self.request.user

        # Base: solo profesores activos (los que no han sido desactivados)
        profesores = Professor.objects.filter(is_active=True)

        # Comprobamos si el frontend pide filtrar por materia del curso
        # (lo usa el Modal de Tutoría para mostrar solo profes de esa asignatura)
        id_curso = self.request.query_params.get('course_id')
        if id_curso:
            from courses.models import Course
            try:
                # Buscamos el curso y sacamos su categoría (=asignatura)
                curso = Course.objects.get(id=id_curso)
                # Filtramos solo los profesores que impartan esa asignatura
                profesores = profesores.filter(subjects=curso.knowledge_level.category)
            except Course.DoesNotExist:
                # Si el curso no existe, ignoramos el filtro (devolvemos todos)
                pass

        if usuario.is_authenticated:
            # El alumno está logueado: devolvemos el claustro completo
            return profesores

        # Si no está logueado, solo devolvemos los destacados para la Home pública
        return profesores.filter(is_featured=True)


# ── SISTEMA DE TUTORÍAS (CONSULTAS) ──
class ConsultationViewSet(viewsets.ModelViewSet):
    """
    Vista CRUD para las Tutorías entre alumnos y profesores.

    Permisos:
    - Solo accesible para usuarios logueados (IsAuthenticated).
    - Al crear: Solo alumnos con Plan 3 (Agujero de Gusano) pueden enviar consultas.
    - Al listar: Cada usuario solo ve SUS consultas (alumno ve las suyas; profe las recibidas).
    """
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtra las consultas según quién hace la petición:
        - Si es un profesor: ve las consultas que le han dirigido a él.
        - Si es un alumno: ve las consultas que él mismo ha creado.
        """
        usuario = self.request.user
        if hasattr(usuario, 'professor_profile'):
            # Es un profesor: filtramos por SU perfil de profesor
            return Consultation.objects.filter(professor=usuario.professor_profile)
        # Es un alumno: filtramos por él mismo como estudiante
        return Consultation.objects.filter(student=usuario)

    def perform_create(self, serializer):
        """
        Se ejecuta al crear una consulta nueva.
        Si es un profesor: Se usa para llamadas directas desde la ficha del alumno.
        Si es un alumno: Se verifica que tenga Plan 3.
        """
        usuario = self.request.user
        
        if hasattr(usuario, 'professor_profile'):
            # El profesor inicia la consulta (llamada directa)
            # El id del alumno debe venir en el cuerpo del POST
            serializer.save(professor=usuario.professor_profile)
        else:
            # El alumno solicita la tutoría
            if usuario.subscription_level < 3:
                raise PermissionDenied("Se requiere Nivel 3 (Agujero de Gusano) para solicitar tutorías.")
            # Guardamos automáticamente al alumno conectado
            serializer.save(student=usuario)

    @action(detail=False, methods=['get'])
    def my_students(self, request):
        """
        Endpoint GET: /api/teachers/consultations/my_students/

        Solo para profes. Devuelve la lista de alumnos que han completado
        algún curso de las materias que imparte este profesor.
        Es lo que rellena la pestaña "Mis Alumnos" del panel docente.
        """
        usuario = request.user

        # Verificamos que quien hace la petición sea un profesor
        if not hasattr(usuario, 'professor_profile'):
            return Response({"error": "Acceso denegado. Solo para docentes."}, status=status.HTTP_403_FORBIDDEN)

        # Obtenemos el perfil de profesor vinculado al usuario
        perfil_profesor = usuario.professor_profile

        # Buscamos las categorías (asignaturas) que imparte este profesor
        materias = perfil_profesor.subjects.all()

        # Buscamos todos los alumnos que hayan completado algún curso de esas materias
        completitudes = CourseCompletion.objects.filter(course__knowledge_level__category__in=materias)

        # Extraemos los IDs únicos de esos alumnos (sin repeticiones)
        ids_alumnos = completitudes.values_list('user_id', flat=True).distinct()

        # Solo mostramos alumnos del Plan 3 (Agujero de Gusano): los únicos con acceso a tutorías
        # Los planes 1 y 2 no tienen esta funcionalidad habilitada, por eso no aparecen aquí
        alumnos = UsuarioPersonalizado.objects.filter(id__in=ids_alumnos, subscription_level=3)

        # Construimos la respuesta con los datos que necesita el frontend
        datos = [{
            "id": alumno.id,
            "username": alumno.username,
            "level": alumno.current_student_level,   # Nivel RPG del alumno
            "xp": alumno.experience_points,          # XP acumulado
            "lives": alumno.lives_count,             # Planetas (vidas) actuales
            "avatar": alumno.selected_avatar         # Búho seleccionado
        } for alumno in alumnos]

        return Response(datos)

    @action(detail=True, methods=['post'])
    def start_call(self, request, pk=None):
        """
        Endpoint POST: /api/teachers/consultations/{id}/start_call/

        El profesor inicia la videollamada de Jitsi Meet para esta consulta.
        Genera una sala única con un nombre aleatorio y actualiza el estado
        de la consulta a 'IN_CALL' para que el alumno pueda unirse.

        Solo el profesor titular de la consulta puede iniciarla.
        """
        usuario = request.user

        # Solo los profesores pueden iniciar llamadas
        if not hasattr(usuario, 'professor_profile'):
            return Response({"error": "Solo un docente puede iniciar la llamada."}, status=status.HTTP_403_FORBIDDEN)

        # Obtenemos la consulta concreta por su ID (pk = primary key = ID)
        consulta = self.get_object()

        # Verificamos que esta consulta le pertenezca a ESTE profesor, no a otro
        if consulta.professor != usuario.professor_profile:
            return Response({"error": "No puedes iniciar una llamada que no es tuya."}, status=status.HTTP_403_FORBIDDEN)

        # Generamos un nombre de sala único usando el ID de la consulta + un código aleatorio
        import uuid
        nombre_sala = f"GenioAcademy_{consulta.id}_{uuid.uuid4().hex[:8]}"
        enlace_reunion = f"https://meet.jit.si/{nombre_sala}"

        # Actualizamos el estado de la consulta en la base de datos
        consulta.status = 'IN_CALL'        # Estado: "En llamada"
        consulta.is_live_call = True       # Marcamos que hay una llamada activa
        consulta.meeting_link = enlace_reunion  # Guardamos el enlace para que el alumno pueda unirse
        consulta.save()

        # Devolvemos los datos actualizados de la consulta al frontend
        return Response(self.get_serializer(consulta).data)

    @action(detail=True, methods=['post'])
    def end_call(self, request, pk=None):
        """
        Endpoint POST: /api/teachers/consultations/{id}/end_call/

        El profesor finaliza la videollamada y marca la consulta como resuelta.
        El alumno ya no podrá ver el botón de "Unirse" al llamada.
        """
        usuario = request.user

        # Solo los profesores pueden terminar llamadas
        if not hasattr(usuario, 'professor_profile'):
            return Response({"error": "Solo un docente puede finalizar la llamada."}, status=status.HTTP_403_FORBIDDEN)

        consulta = self.get_object()

        # Verificamos que esta consulta le pertenezca a ESTE profesor
        if consulta.professor != usuario.professor_profile:
            return Response({"error": "No puedes finalizar una llamada que no es tuya."}, status=status.HTTP_403_FORBIDDEN)

        # Actualizamos el estado: la consulta queda cerrada y marcada como respondida
        consulta.status = 'ANSWERED'      # Estado: "Respondida"
        consulta.is_live_call = False     # Ya no hay llamada activa
        # Guardamos la respuesta escrita que el profe haya dejado (opcional)
        consulta.response = request.data.get('response', 'Videollamada finalizada con éxito.')
        consulta.save()

        return Response(self.get_serializer(consulta).data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """
        Endpoint POST: /api/teachers/consultations/{id}/resolve/

        El profesor resuelve la consulta enviando una respuesta de texto,
        sin necesidad de realizar una videollamada.
        """
        usuario = request.user
        if not hasattr(usuario, 'professor_profile'):
            return Response({"error": "Solo un docente puede resolver consultas."}, status=status.HTTP_403_FORBIDDEN)

        consulta = self.get_object()
        if consulta.professor != usuario.professor_profile:
            return Response({"error": "No puedes resolver una consulta que no es tuya."}, status=status.HTTP_403_FORBIDDEN)

        respuesta_texto = request.data.get('response')
        if not respuesta_texto:
            return Response({"error": "Debes escribir una respuesta para resolver el ticket."}, status=status.HTTP_400_BAD_REQUEST)

        consulta.status = 'ANSWERED'
        consulta.response = respuesta_texto
        consulta.is_live_call = False
        consulta.save()

        return Response(self.get_serializer(consulta).data)

    @action(detail=False, methods=['get'])
    def active_calls(self, request):
        """
        Endpoint GET: /api/teachers/consultations/active_calls/

        El alumno consulta periódicamente este endpoint (polling) para saber
        si su profesor ha iniciado una videollamada.

        Si encuentra una llamada activa, devuelve sus datos (incluido el enlace de Jitsi).
        Si no hay llamada activa, devuelve un objeto vacío {}.
        """
        usuario = request.user

        # Los profesores no necesitan este endpoint (ellos inician las llamadas, no las buscan)
        if hasattr(usuario, 'professor_profile'):
            return Response([])

        # Buscamos si hay alguna consulta de este alumno en estado 'IN_CALL'
        llamada_activa = Consultation.objects.filter(
            student=usuario,
            is_live_call=True,
            status='IN_CALL'
        ).first()  # .first() devuelve la primera que encuentre o None si no hay ninguna

        if llamada_activa:
            # Hay una llamada activa: devolvemos sus datos para que el banner aparezca
            return Response(self.get_serializer(llamada_activa).data)

        # No hay llamada activa: devolvemos objeto vacío
        return Response({})
