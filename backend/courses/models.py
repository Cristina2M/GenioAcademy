# Importamos el módulo base de base de datos de Django
from django.db import models
from django.conf import settings

# ==========================================
# Modelo Categoría (Ejemplo: Matemáticas, Lengua)
# ==========================================
class Category(models.Model):
    # Nombre de la categoría (único)
    name = models.CharField(max_length=100, unique=True, verbose_name="Categoría")
    # Descripción detallada opcional de lo que abarca
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")

    # Metadatos para mostrar nombres legibles en el panel de administrador
    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    # Retorna el nombre para imprimir en listas
    def __str__(self):
        return self.name

# ==========================================
# Modelo Nivel de Conocimiento (Ejemplo: Sumas Básicas)
# ==========================================
class KnowledgeLevel(models.Model):
    # Relación con categoría, un nivel siempre pertenece a una Categoría paraguas
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='knowledge_levels', verbose_name="Categoría")
    # Nombre del nivel específico 
    name = models.CharField(max_length=150, verbose_name="Nivel de Conocimiento (Tema)")
    # Más detalles sobre el nivel de conocimiento
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    # Número para ordenar cronológicamente o por dificultad de aprendizaje
    order = models.PositiveIntegerField(default=0, verbose_name="Orden Sugerido")

    class Meta:
        verbose_name = "Nivel de Conocimiento"
        verbose_name_plural = "Niveles de Conocimiento"
        ordering = ['category', 'order'] # Orden por defecto al obtenerlos de base de datos

    def __str__(self):
        return f"{self.category.name} - {self.name}"

# ==========================================
# Modelo Curso Concreto (Un pack de contenido y ejercicios)
# ==========================================
class Course(models.Model):
    # Relación con el nivel al que pertenece
    knowledge_level = models.ForeignKey(KnowledgeLevel, on_delete=models.CASCADE, related_name='courses', verbose_name="Nivel de Conocimiento")
    # Título principal del curso
    title = models.CharField(max_length=200, verbose_name="Título del Curso")
    # Explicación extensa del curso
    description = models.TextField(verbose_name="Descripción")
    # Gamificación: Cantidad de XP que otorga completar este curso
    xp_reward = models.PositiveIntegerField(default=100, verbose_name="Recompensa de XP")
    
    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"

    def __str__(self):
        return self.title

# ==========================================
# Modelo Lección (Teoría en texto y/o video)
# ==========================================
class Lesson(models.Model):
    # Relación del curso padre al que responde esta lección
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name="Curso")
    # Título de las lecciones (ej: "Propiedades de las raíces")
    title = models.CharField(max_length=200, verbose_name="Título de la Lección")
    # Explicación en formato de texto largo
    content = models.TextField(blank=True, null=True, verbose_name="Contenido Teórico")
    # Enlace a YouTube o CDN (Premium)
    video_url = models.URLField(blank=True, null=True, verbose_name="URL del Vídeo")
    # Define si necesita ser suscriptor Nivel 2 o 3 para acceder
    is_premium = models.BooleanField(default=True, verbose_name="Requiere Nivel 2 o 3")

    class Meta:
        verbose_name = "Lección"
        verbose_name_plural = "Lecciones"

    def __str__(self):
        return f"{self.course.title} - {self.title}"

# ==========================================
# Modelo Ejercicio Interactivo (Pregunta y Respuestas)
# ==========================================
class Exercise(models.Model):
    # Una lección puede contener múltiples ejercicios
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises', verbose_name="Lección")
    # El texto del problema o pregunta a resolver
    question = models.TextField(verbose_name="Pregunta / Enunciado")
    # Guarda un Formato JSON con las posibles respuestas a dar
    options = models.JSONField(verbose_name="Opciones (JSON)", help_text="Formato: ['Opcion A', 'Opcion B']")
    # String representativo de la respuesta acertada para validación
    correct_answer = models.CharField(max_length=255, verbose_name="Respuesta Correcta")

    class Meta:
        verbose_name = "Ejercicio"
        verbose_name_plural = "Ejercicios"

    def __str__(self):
        return f"Ejercicio de: {self.lesson.title}"


# ==========================================
# Modelo de Registro (Completitud y Anti-Trampas)
# ==========================================
class CourseCompletion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='completed_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='completions')
    completed_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Completado")

    class Meta:
        verbose_name = "Curso Completado"
        verbose_name_plural = "Historial de Cursos Completados"
        # UNIQUE TOGETHER: Clave del motor RPG. Obliga a la base de datos a rechazar intentos 
        # duplicados si el usuario Juanita ya completó el curso de Matemáticas Básicas. 
        # Evita que repita el mismo endpoint 50 veces para ganar XP infinito.
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} finalizó {self.course.title}"
