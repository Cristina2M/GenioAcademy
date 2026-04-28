# ============================================================
# ARCHIVO: teachers/urls.py
# FUNCIÓN: Define las rutas de la API para los Profesores.
# ============================================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfessorViewSet, ConsultationViewSet,
    TeacherCourseViewSet, TeacherLessonViewSet, TeacherExerciseViewSet
)

router = DefaultRouter()
router.register(r'professors', ProfessorViewSet, basename='professor')
router.register(r'consultations', ConsultationViewSet, basename='consultation')
# Editor de cursos para profesores
router.register(r'mis-cursos', TeacherCourseViewSet, basename='teacher-course')
router.register(r'lecciones', TeacherLessonViewSet, basename='teacher-lesson')
router.register(r'ejercicios', TeacherExerciseViewSet, basename='teacher-exercise')

urlpatterns = [
    path('', include(router.urls)),
]
