# ============================================================
# ARCHIVO: courses/models.py
# FUNCIÓN: Define las "tablas" de la base de datos para los cursos.
#
# La estructura jerárquica es:
#   Categoría → Nivel de Conocimiento → Curso → Lección → Ejercicio
#
# Por ejemplo:
#   Matemáticas → Nivel 1 → "Fracciones" → "Suma de fracciones" → "¿Cuánto es 1/2 + 1/4?"
#
# También hay una tabla de "Completitud de Cursos" que guarda qué
# alumnos han superado qué cursos (para otorgar XP y evitar el farmeo).
# ============================================================

from django.db import models
from django.conf import settings


# ── CATEGORÍA ──
# Es la asignatura: Matemáticas, Lengua, Física, etc.
class Category(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nombre de la asignatura')
    description = models.TextField(blank=True, verbose_name='Descripción')

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.name


# ── NIVEL DE CONOCIMIENTO ──
# Es la dificultad dentro de una asignatura (Básico, Intermedio, Avanzado...).
# Cada nivel tiene un número de orden que lo compara con el nivel RPG del alumno:
# si order=2 y el alumno es nivel RPG 1, este nivel está bloqueado.
class KnowledgeLevel(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,       # Si se borra la asignatura, se borran sus niveles
        related_name='knowledge_levels' # Para acceder como: categoria.knowledge_levels.all()
    )
    name = models.CharField(max_length=200, verbose_name='Nombre del nivel')
    order = models.IntegerField(
        default=1,
        verbose_name='Orden / Dificultad',
        help_text='Se compara con el nivel RPG del alumno. Si es mayor, el nivel está bloqueado.'
    )

    class Meta:
        verbose_name = 'Nivel de Conocimiento'
        verbose_name_plural = 'Niveles de Conocimiento'
        ordering = ['order']  # Siempre ordenados de menor a mayor dificultad

    def __str__(self):
        return f'{self.category.name} — {self.name} (Orden {self.order})'


# ── CURSO ──
# Es una "cápsula" de conocimiento muy específica dentro de un nivel.
# Ejemplo: "División de fracciones" dentro de Matemáticas → Nivel Básico.
class Course(models.Model):
    knowledge_level = models.ForeignKey(
        KnowledgeLevel,
        on_delete=models.CASCADE,
        related_name='courses'  # Para acceder como: nivel.courses.all()
    )
    title = models.CharField(max_length=300, verbose_name='Título del curso')
    description = models.TextField(blank=True, verbose_name='Descripción del curso')
    xp_reward = models.IntegerField(
        default=300,
        verbose_name='Puntos XP que da al completar'
    )

    class Meta:
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'

    def __str__(self):
        return self.title


# ── LECCIÓN ──
# Es una unidad de contenido dentro de un Curso.
# Tiene texto teórico y puede tener ejercicios asociados.
class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'  # Para acceder como: curso.lessons.all()
    )
    title = models.CharField(max_length=300, verbose_name='Título de la lección')
    content = models.TextField(
        blank=True,
        verbose_name='Contenido teórico',
        help_text='El texto de teoría que verá el alumno en la pestaña "Manual Teórico".'
    )
    order = models.IntegerField(default=1, verbose_name='Posición en el curso')

    class Meta:
        verbose_name = 'Lección'
        verbose_name_plural = 'Lecciones'
        ordering = ['order']  # Las lecciones se muestran en orden

    def __str__(self):
        return f'{self.course.title} — {self.title}'


# ── EJERCICIO ──
# Es una pregunta tipo test (opción múltiple) dentro de una lección.
# El campo "options" almacena las posibles respuestas separadas por comas.
# Por ejemplo: "3,6,9,12" → cuatro opciones.
class Exercise(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='exercises'  # Para acceder como: leccion.exercises.all()
    )
    question = models.TextField(verbose_name='Pregunta')
    options = models.JSONField(
        verbose_name='Opciones de respuesta',
        help_text='Lista de opciones en formato JSON. Ejemplo: ["A", "B", "C", "D"]'
    )
    correct_answer = models.CharField(
        max_length=500,
        verbose_name='Respuesta correcta',
        help_text='Debe coincidir exactamente con una de las opciones del campo "options".'
    )

    class Meta:
        verbose_name = 'Ejercicio'
        verbose_name_plural = 'Ejercicios'

    def __str__(self):
        return f'Ejercicio de "{self.lesson.title}": {self.question[:60]}...'


# ── COMPLETITUD DE CURSO ──
# Registra qué alumno ha completado qué curso.
# La combinación (user + course) es ÚNICA: un alumno solo puede completar un curso UNA VEZ.
# Esto es lo que impide que el alumno haga farmeo de XP (completar el mismo curso mil veces).
class CourseCompletion(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,       # Apunta al modelo de usuario personalizado (CustomUser)
        on_delete=models.CASCADE,
        related_name='completed_courses'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='completions'
    )
    completed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de completitud'
    )

    class Meta:
        verbose_name = 'Completitud de Curso'
        verbose_name_plural = 'Completitudes de Curso'
        # LA CLAVE DE SEGURIDAD: Django impedirá insertar dos filas con el mismo usuario+curso
        unique_together = ('user', 'course')

    def __str__(self):
        return f'{self.user.username} completó "{self.course.title}" el {self.completed_at.strftime("%d/%m/%Y")}'
