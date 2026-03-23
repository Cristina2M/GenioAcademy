from rest_framework import serializers
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

class KnowledgeLevelSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = KnowledgeLevel
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    knowledge_levels = KnowledgeLevelSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = '__all__'
