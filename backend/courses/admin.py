from django.contrib import admin
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(KnowledgeLevel)
class KnowledgeLevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'order')
    list_filter = ('category',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'knowledge_level')
    list_filter = ('knowledge_level__category',)

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'is_premium')
    list_filter = ('is_premium', 'course')

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('question', 'lesson')
