# ============================================================
# ARCHIVO: teachers/urls.py
# FUNCIÓN: Define las rutas de la API para los Profesores.
# ============================================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfessorViewSet, ConsultationViewSet

router = DefaultRouter()
router.register(r'professors', ProfessorViewSet, basename='professor')
router.register(r'consultations', ConsultationViewSet, basename='consultation')

urlpatterns = [
    path('', include(router.urls)),
]
