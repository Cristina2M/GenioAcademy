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
