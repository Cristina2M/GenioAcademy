from rest_framework import viewsets
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise
from .serializers import CategorySerializer, KnowledgeLevelSerializer, CourseSerializer, LessonSerializer, ExerciseSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class KnowledgeLevelViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeLevel.objects.all()
    serializer_class = KnowledgeLevelSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
