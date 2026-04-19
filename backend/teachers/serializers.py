# ============================================================
# ARCHIVO: teachers/serializers.py
# FUNCIÓN: Convierte los modelos de Profesores a JSON.
# ============================================================

from rest_framework import serializers
from .models import Professor
from courses.models import Category

class ProfessorCategorySerializer(serializers.ModelSerializer):
    """Serializer simplificado para mostrar las materias en la tarjeta del profesor."""
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProfessorSerializer(serializers.ModelSerializer):
    # Incluimos el detalle de las materias
    subjects_detail = ProfessorCategorySerializer(source='subjects', many=True, read_only=True)
    
    class Meta:
        model = Professor
        fields = [
            'id', 'full_name', 'title', 'bio', 
            'avatar_url', 'subjects', 'subjects_detail', 'is_active', 'cv_json'
        ]
        # 'subjects' se usa para escritura (IDs) y 'subjects_detail' para lectura

from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id', 'student', 'student_name', 'professor', 'professor_name', 
            'course', 'course_title', 'message', 'response', 'status', 
            'meeting_link', 'created_at', 'updated_at'
        ]
        read_only_fields = ['student', 'status', 'created_at', 'updated_at']
