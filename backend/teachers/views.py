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
        Retorna los estudiantes del Plan 3 (Agujero de Gusano) que han
        completado cursos en las materias de este profesor.

        Solo se muestran alumnos de Plan 3 porque son los únicos que tienen
        acceso al sistema de tutorías con profesores. Los planes 1 y 2 no
        tienen esta funcionalidad habilitada.
        """
        user = request.user
        if not hasattr(user, 'professor_profile'):
            return Response({"error": "No Autorizado."}, status=status.HTTP_403_FORBIDDEN)

        prof = user.professor_profile
        # Filtramos los cursos de las materias que imparte este profesor
        categories = prof.subjects.all()
        completions = CourseCompletion.objects.filter(course__knowledge_level__category__in=categories)
        student_ids = completions.values_list('user_id', flat=True).distinct()

        # Solo alumnos con subscription_level=3 (Plan Agujero de Gusano)
        # Los planes 1 y 2 NO tienen acceso a tutorías, por eso no aparecen aquí
        students = CustomUser.objects.filter(id__in=student_ids, subscription_level=3)

        data = [{
            "id": s.id,
            "username": s.username,
            "level": s.current_student_level,
            "xp": s.experience_points,
            "lives": s.lives_count,
            "avatar": s.selected_avatar
        } for s in students]

        return Response(data)
