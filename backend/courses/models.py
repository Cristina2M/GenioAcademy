from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class KnowledgeLevel(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='knowledge_levels')
    name = models.CharField(max_length=100) # ej: Sumas, Restas, Textos argumentativos
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class Course(models.Model):
    knowledge_level = models.ForeignKey(KnowledgeLevel, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Exercise(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    question = models.TextField()
    options = models.JSONField(help_text="Lista de opciones JSON. Ej: ['Opcion A', 'Opcion B']")
    correct_option_index = models.IntegerField(help_text="Índice de la opción correcta (empezando en 0)")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Ejercicio {self.id} - {self.lesson.title}"
