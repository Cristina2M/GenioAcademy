# Módulo de utilidades web de Django
from django.urls import path, include
# El Router por defecto de Django REST Framework para generar URLs automáticamente a partir de los ViewSets
from rest_framework.routers import DefaultRouter

# Importamos nuestras Vistas para asociarlas a las rutas
from .views import CategoryViewSet, KnowledgeLevelViewSet, CourseViewSet, LessonViewSet, ExerciseViewSet

# Declaramos nuestro enrutador
router = DefaultRouter()

# Registramos las distintas ramas finales (endpoints) bajo sus respectivos prefijos. 
# Esto genera automáticamente las rutas GET / POST / PUT / DELETE de cada una.
router.register(r'categories', CategoryViewSet)
router.register(r'knowledge-levels', KnowledgeLevelViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'exercises', ExerciseViewSet)

# Lista obligatoria donde Django buscará las rutas
urlpatterns = [
    # Incluimos los endpoints generados por el enrutador en la raíz de esta aplicación
    path('', include(router.urls)),
]
