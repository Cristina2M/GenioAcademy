# Herramientas base para vistas (controladores) orientadas a bases de datos con Django REST Framework
from rest_framework import viewsets

# Importaciones de todos los modelos y serializadores recien creados
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise
from .serializers import CategorySerializer, KnowledgeLevelSerializer, CourseSerializer, LessonSerializer, ExerciseSerializer

# ViewSet de Categorías (Permite peticiones GET, POST, PUT, DELETE por defecto)
class CategoryViewSet(viewsets.ModelViewSet):
    # Lista base que obtiene todo el espectro de categorías
    queryset = Category.objects.all()
    # Serializador que formatea la respuesta de este modelo
    serializer_class = CategorySerializer

# Controlador de vista de Niveles de Conocimiento
class KnowledgeLevelViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeLevel.objects.all()
    serializer_class = KnowledgeLevelSerializer

# Controlador de vista de Cursos
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

# Controlador de vista de Lecciones Teóricas
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

# Controlador de vista de Ejercicios Autocorregibles
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
