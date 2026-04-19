# ============================================================
# ARCHIVO: teachers/views.py
# FUNCIÓN: Define los endpoints para el Claustro de Profesores.
# ============================================================

from rest_framework import viewsets, permissions
from .models import Professor
from .serializers import ProfessorSerializer

class ProfessorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista para el catálogo de profesores.
    - Visitantes (Padres): Solo ven profesores destacados (is_featured=True).
    - Alumnos: Ven el claustro completo.
    """
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Professor.objects.filter(is_active=True)
        # Si no está logueado, solo retornamos los destacados para la Home
        return Professor.objects.filter(is_active=True, is_featured=True)

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Consultation
from .serializers import ConsultationSerializer
from courses.models import CourseCompletion
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class ConsultationViewSet(viewsets.ModelViewSet):
    """
    Vista CRUD para Tutorías.
    - Alumnos (Nivel 3): Crean y ven sus propias consultas.
    - Profesores: Ven consultas dirigidas a ellos y pueden responder.
    """
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'professor_profile'):
            return Consultation.objects.filter(professor=user.professor_profile)
        return Consultation.objects.filter(student=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.subscription_level < 3:
            raise PermissionDenied("Se requiere Nivel 3 (Agujero de Gusano) para solicitar tutorías.")
        serializer.save(student=user)

    @action(detail=False, methods=['get'])
    def my_students(self, request):
        """
        Retorna los estudiantes que han participado en materias de este profesor.
        """
        user = request.user
        if not hasattr(user, 'professor_profile'):
            return Response({"error": "No Autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        prof = user.professor_profile
        # Encontramos los cursos asociados a las materias que imparte
        categories = prof.subjects.all()
        completions = CourseCompletion.objects.filter(course__knowledge_level__category__in=categories)
        student_ids = completions.values_list('user_id', flat=True).distinct()
        students = CustomUser.objects.filter(id__in=student_ids)

        data = [{
            "id": s.id,
            "username": s.username,
            "level": s.current_student_level,
            "xp": s.experience_points,
            "lives": s.lives_count,
            "avatar": s.selected_avatar
        } for s in students]

        return Response(data)

    @action(detail=True, methods=['post'])
    def start_call(self, request, pk=None):
        """Profesor inicia la videollamada de Jitsi"""
        user = request.user
        if not hasattr(user, 'professor_profile'):
            return Response({"error": "No Autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        consultation = self.get_object()
        if consultation.professor != user.professor_profile:
            return Response({"error": "No es tu consulta."}, status=status.HTTP_403_FORBIDDEN)

        # Generar "room" única en Jitsi
        import uuid
        room_name = f"GenioAcademy_{consultation.id}_{uuid.uuid4().hex[:8]}"
        meeting_link = f"https://meet.jit.si/{room_name}"

        consultation.status = 'IN_CALL'
        consultation.is_live_call = True
        consultation.meeting_link = meeting_link
        consultation.save()

        return Response(self.get_serializer(consultation).data)

    @action(detail=True, methods=['post'])
    def end_call(self, request, pk=None):
        """Profesor finaliza la videollamada resolviendo la consulta"""
        user = request.user
        if not hasattr(user, 'professor_profile'):
            return Response({"error": "No Autorizado."}, status=status.HTTP_403_FORBIDDEN)
        
        consultation = self.get_object()
        if consultation.professor != user.professor_profile:
            return Response({"error": "No es tu consulta."}, status=status.HTTP_403_FORBIDDEN)

        consultation.status = 'ANSWERED'
        consultation.is_live_call = False
        consultation.response = request.data.get('response', 'Videollamada finalizada con éxito.')
        consultation.save()

        return Response(self.get_serializer(consultation).data)

    @action(detail=False, methods=['get'])
    def active_calls(self, request):
        """Alumno comprueba si tiene alguna videollamada activa"""
        user = request.user
        if hasattr(user, 'professor_profile'):
            return Response([])

        active = Consultation.objects.filter(
            student=user,
            is_live_call=True,
            status='IN_CALL'
        ).first()

        if active:
            return Response(self.get_serializer(active).data)
        return Response({})
