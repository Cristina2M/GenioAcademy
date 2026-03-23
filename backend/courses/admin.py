# Importaciones del decorador administrador
from django.contrib import admin
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise

# Personalizamos la visualización de la categoría en el Django Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # Mostramos su nombre en formato tabla
    list_display = ('name',)

# Configuración del panel para Niveles de Conocimiento
@admin.register(KnowledgeLevel)
class KnowledgeLevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'order')
    list_filter = ('category',) # Filtro lateral rápido guiado por la categoría

# Configuración del panel de Cursos 
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'knowledge_level')
    list_filter = ('knowledge_level__category',) # Filtro avanzado por la categoría abuela

# Mostramos un resumen eficaz de qué lecciones están protegidas bajo suscripción Premium
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'is_premium')
    list_filter = ('is_premium', 'course') # Útil para localizar fugas de contenido público 

# Personalización para facilitar la edición de ejercicios
@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('question', 'lesson')
