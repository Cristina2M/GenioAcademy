from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Categoría")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.name

class KnowledgeLevel(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='knowledge_levels', verbose_name="Categoría")
    name = models.CharField(max_length=150, verbose_name="Nivel de Conocimiento (Tema)")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    order = models.PositiveIntegerField(default=0, verbose_name="Orden Sugerido")

    class Meta:
        verbose_name = "Nivel de Conocimiento"
        verbose_name_plural = "Niveles de Conocimiento"
        ordering = ['category', 'order']

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class Course(models.Model):
    knowledge_level = models.ForeignKey(KnowledgeLevel, on_delete=models.CASCADE, related_name='courses', verbose_name="Nivel de Conocimiento")
    title = models.CharField(max_length=200, verbose_name="Título del Curso")
    description = models.TextField(verbose_name="Descripción")
    
    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', verbose_name="Curso")
    title = models.CharField(max_length=200, verbose_name="Título de la Lección")
    content = models.TextField(blank=True, null=True, verbose_name="Contenido Teórico")
    video_url = models.URLField(blank=True, null=True, verbose_name="URL del Vídeo")
    is_premium = models.BooleanField(default=True, verbose_name="Requiere Nivel 2 o 3")

    class Meta:
        verbose_name = "Lección"
        verbose_name_plural = "Lecciones"

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Exercise(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises', verbose_name="Lección")
    question = models.TextField(verbose_name="Pregunta / Enunciado")
    options = models.JSONField(verbose_name="Opciones (JSON)", help_text="Formato: ['Opcion A', 'Opcion B']")
    correct_answer = models.CharField(max_length=255, verbose_name="Respuesta Correcta")

    class Meta:
        verbose_name = "Ejercicio"
        verbose_name_plural = "Ejercicios"

    def __str__(self):
        return f"Ejercicio de: {self.lesson.title}"
