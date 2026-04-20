# ============================================================
# ARCHIVO: courses/serializers.py
# FUNCIÓN: Transforma los datos de la base de datos a formato JSON
#          (para enviarlos al navegador) y viceversa.
#
# Los "serializadores" son el equivalente a un traductor entre
# la base de datos y el frontend React.
#
# Orden de uso (de más pequeño a más grande):
#   Exercise → Lesson → Course → KnowledgeLevel → Category
# ============================================================

from rest_framework import serializers
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise, UserCourseProgress


# ── SERIALIZADOR DE EJERCICIOS ──
# Transforma un ejercicio (pregunta + opciones + respuesta) a JSON.
# El frontend lo usa en el componente LessonQuiz para mostrar las preguntas.
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'  # Expone todos los campos: id, pregunta, opciones, respuesta correcta


# ── SERIALIZADOR DE LECCIONES ──
# Incluye los ejercicios de cada lección de forma "anidada".
# Es decir, en lugar de devolver solo el ID del ejercicio, devuelve todos sus datos.
class LessonSerializer(serializers.ModelSerializer):
    # "many=True" porque una lección puede tener muchos ejercicios.
    # "read_only=True" porque este campo solo se usa para leer, no para crear/editar.
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    # Igual que con ejercicios: devuelve todas las lecciones del curso con sus datos completos.
    lessons = LessonSerializer(many=True, read_only=True)

    # "SerializerMethodField" es un campo especial que se calcula al vuelo con una función.
    is_completed = serializers.SerializerMethodField()
    # Nos permite saber si el alumno ya ha comenzado este curso.
    is_started = serializers.SerializerMethodField()

    # Campos extra para facilitar el filtrado en el frontend
    knowledge_level_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        # Listamos los campos explícitamente para incluir los calculados
        fields = [
            'id', 'knowledge_level', 'knowledge_level_name', 'category_name', 
            'title', 'description', 'xp_reward', 'lessons', 'is_completed', 'is_started'
        ]

    def get_knowledge_level_name(self, obj):
        try:
            return obj.knowledge_level.name
        except:
            return "Sin Nivel"

    def get_category_name(self, obj):
        try:
            return obj.knowledge_level.category.name
        except:
            return "Sin Asignatura"

    def get_is_completed(self, obj):
        """
        Comprueba si existe un registro de completitud para este alumno + este curso.
        """
        request = self.context.get('request')
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return False

        from .models import CourseCompletion
        return CourseCompletion.objects.filter(user=request.user, course=obj).exists()

    def get_is_started(self, obj):
        """
        Comprueba si el alumno ha iniciado el curso (existe en UserCourseProgress).
        """
        request = self.context.get('request')
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return False
        return UserCourseProgress.objects.filter(user=request.user, course=obj).exists()


# ── SERIALIZADOR DE PROGRESO DE CURSO ──
class UserCourseProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    category_name = serializers.ReadOnlyField(source='course.knowledge_level.category.name')

    class Meta:
        model = UserCourseProgress
        fields = ['id', 'course', 'course_title', 'category_name', 'started_at', 'updated_at']


# ── SERIALIZADOR DE NIVELES DE CONOCIMIENTO ──
# Incluye los cursos anidados y calcula si el nivel está bloqueado para el alumno.
class KnowledgeLevelSerializer(serializers.ModelSerializer):
    # Todos los cursos del nivel, con sus datos completos
    courses = CourseSerializer(many=True, read_only=True)

    # Campo calculado: ¿puede acceder el alumno a este nivel segun su nivel RPG?
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = KnowledgeLevel
        # Incluimos los campos del modelo + los calculados (courses, is_locked)
        fields = ['id', 'category', 'name', 'order', 'courses', 'is_locked']

    def get_is_locked(self, obj):
        """
        Compara el "orden" del nivel con el "nivel RPG" del alumno.
        """
        request = self.context.get('request')

        # Si el usuario no está autenticado o es None, el nivel está bloqueado
        if not request or not getattr(request, 'user', None) or not request.user.is_authenticated:
            return True

        # ELIMINACIÓN DE RESTRICCIONES: Ahora todos los niveles están abiertos.
        return False


# ── SERIALIZADOR DE CATEGORÍAS ──
# Es el serializador raíz: devuelve la asignatura completa con todos sus niveles y cursos.
class CategorySerializer(serializers.ModelSerializer):
    # Todos los niveles de conocimiento de esta categoría, con sus cursos y ejercicios
    knowledge_levels = KnowledgeLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        # Incluimos los campos del modelo + los calculados (knowledge_levels)
        fields = ['id', 'name', 'description', 'knowledge_levels']
