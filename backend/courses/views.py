# Herramientas base para vistas (controladores) orientadas a bases de datos con Django REST Framework
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db import IntegrityError

# Importaciones de todos los modelos y serializadores recien creados
from .models import Category, KnowledgeLevel, Course, Lesson, Exercise, CourseCompletion
from .serializers import CategorySerializer, KnowledgeLevelSerializer, CourseSerializer, LessonSerializer, ExerciseSerializer

# Filtro general de Seguridad Backend (Anti-Hacking)
def check_unlocked(user, knowledge_level_order):
    if not user.is_authenticated or knowledge_level_order > user.current_student_level:
        raise PermissionDenied("Violación de Seguridad: Tu Nivel de Alumno es demasiado bajo para acceder a los datos de este contenido.")

# ViewSet de Categorías (Permite peticiones GET, POST, PUT, DELETE por defecto)
class CategoryViewSet(viewsets.ModelViewSet):
    # Lista base que obtiene todo el espectro de categorías
    queryset = Category.objects.all()
    # Serializador que formatea la respuesta de este modelo
    serializer_class = CategorySerializer

# Controlador de vista de Niveles de Conocimiento
class KnowledgeLevelViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeLevel.objects.all()
    serializer_class = KnowledgeLevelSerializer

# Controlador de vista de Cursos
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # Sobrescribimos el acceso individual para inyectar el Cortafuegos de Nivel
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        check_unlocked(request.user, instance.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)

    # El Motor Lógico RPG: Endpoint para completar un curso y ganar XP
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        course = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({"error": "Debes iniciar sesión con tu Token para jugar."}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            # 1. Registrar completitud (falla si ya existe gracias al unique_together en BBDD)
            CourseCompletion.objects.create(user=user, course=course)
            
            # 2. Otorgar XP al alumno
            user.experience_points += course.xp_reward
            leveled_up = False
            
            # 3. Fórmula RPG: Subir al siguiente nivel requiere (Nivel Actual * 500) XP
            threshold = user.current_student_level * 500
            while user.experience_points >= threshold:
                user.current_student_level += 1
                leveled_up = True
                threshold = user.current_student_level * 500
                
            user.save()
            
            # 4. Generar nuevo JWT con nuestro serializador personalizado para inyectar XP y Nivel
            from users.serializers import MyTokenObtainPairSerializer
            refresh = MyTokenObtainPairSerializer.get_token(user)
            
            return Response({
                "detail": f"¡Recompensas reclamadas! Misión Superada.",
                "experience_points": user.experience_points,
                "level": user.current_student_level,
                "level_up": leveled_up,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
            
        except IntegrityError:
            # Interceptamos si un Hacker/Tramposo intenta mandar el POST 20 veces al mismo curso
            return Response({"detail": "Anti-Farmeo: Ya has cobrado la experiencia de este curso anteriormente."}, status=status.HTTP_400_BAD_REQUEST)

# Controlador de vista de Lecciones Teóricas
class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        check_unlocked(request.user, instance.course.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)

# Controlador de vista de Ejercicios Autocorregibles
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        check_unlocked(request.user, instance.lesson.course.knowledge_level.order)
        return super().retrieve(request, *args, **kwargs)
