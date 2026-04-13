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
