from django.contrib import admin
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(KnowledgeLevel)
class KnowledgeLevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'knowledge_level', 'is_active')
    list_filter = ('is_active', 'knowledge_level')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    ordering = ('course', 'order')

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'lesson', 'order')
    list_filter = ('lesson',)
    ordering = ('lesson', 'order')
