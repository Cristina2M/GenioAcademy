from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, KnowledgeLevelViewSet, CourseViewSet, LessonViewSet, ExerciseViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'knowledge-levels', KnowledgeLevelViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'exercises', ExerciseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
