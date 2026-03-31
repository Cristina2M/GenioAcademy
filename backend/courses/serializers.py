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
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise


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


# ── SERIALIZADOR DE CURSOS ──
# Incluye sus lecciones anidadas y calcula si el alumno ya lo completó.
class CourseSerializer(serializers.ModelSerializer):
    # Igual que con ejercicios: devuelve todas las lecciones del curso con sus datos completos.
    lessons = LessonSerializer(many=True, read_only=True)

    # "SerializerMethodField" es un campo especial que se calcula al vuelo con una función.
    # En este caso, nos permite saber si el alumno que está pidiendo los datos ha completado el curso.
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_is_completed(self, obj):
        """
        Esta función se llama automáticamente por Django REST para calcular "is_completed".
        Comprueba si existe un registro de completitud para este alumno + este curso.
        """
        # Obtenemos la petición HTTP para saber quién está preguntando
        request = self.context.get('request')

        # Si no hay petición o el usuario no está conectado, devolvemos False por defecto
        if not request or not request.user.is_authenticated:
            return False

        # Buscamos en la tabla de "completitudes" si existe una fila para este par (alumno, curso)
        from .models import CourseCompletion
        return CourseCompletion.objects.filter(user=request.user, course=obj).exists()


# ── SERIALIZADOR DE NIVELES DE CONOCIMIENTO ──
# Incluye los cursos anidados y calcula si el nivel está bloqueado para el alumno.
class KnowledgeLevelSerializer(serializers.ModelSerializer):
    # Todos los cursos del nivel, con sus datos completos
    courses = CourseSerializer(many=True, read_only=True)

    # Campo calculado: ¿puede acceder el alumno a este nivel segun su nivel RPG?
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = KnowledgeLevel
        fields = '__all__'

    def get_is_locked(self, obj):
        """
        Compara el "orden" del nivel con el "nivel RPG" del alumno.
        Si el nivel exige más de lo que el alumno tiene, devolvemos True (bloqueado).
        """
        request = self.context.get('request')

        # Si no hay alumno conectado, todos los niveles están bloqueados
        if not request or not request.user.is_authenticated:
            return True

        # El nivel está bloqueado si su dificultad (order) supera el nivel del alumno
        return obj.order > request.user.current_student_level


# ── SERIALIZADOR DE CATEGORÍAS ──
# Es el serializador raíz: devuelve la asignatura completa con todos sus niveles y cursos.
# Este es el que usa el Dashboard y el Catálogo para mostrar todo el árbol de contenido.
class CategorySerializer(serializers.ModelSerializer):
    # Todos los niveles de conocimiento de esta categoría, con sus cursos y ejercicios
    knowledge_levels = KnowledgeLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'
