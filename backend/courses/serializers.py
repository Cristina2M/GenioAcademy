# Importamos Django REST Framework para gestionar Serializaciones
from rest_framework import serializers

# Importamos todos nuestros modelos de base de datos
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise

# Serializador para los ejercicios de una lección
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__' # Expone todos los campos del modelo en la API (ej: pregunta, respuestas)

# Serializador de las Lecciones, incluyendo sus ejercicios anidados (solo lectura)
class LessonSerializer(serializers.ModelSerializer):
    # Relación inversa: Trae todos los ejercicios vinculados a esta lección de forma anidada
    exercises = ExerciseSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

# Serializador para cursos. Expone la información del curso y las lecciones disponibles
class CourseSerializer(serializers.ModelSerializer):
    # Relación Inversa para devolver las lecciones anidadas al curso
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

# Mapea y serializa los "Niveles de Conocimiento" anidando los cursos disponibles en ese nivel
class KnowledgeLevelSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = KnowledgeLevel
        fields = '__all__'

# Serializador RAÍZ que devuelve las Categorías Generales (Matemáticas, Lengua...) y lo que contienen
class CategorySerializer(serializers.ModelSerializer):
    # Traemos los niveles hijos asociados a esta categoría en JSON
    knowledge_levels = KnowledgeLevelSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = '__all__'
