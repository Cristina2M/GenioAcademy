from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LivesView, DecreaseLivesView, MinigamePlayView

router = DefaultRouter()
router.register(r'management', UserViewSet, basename='user-management')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    # Sistema de vidas (planetas)
    path('lives/', LivesView.as_view(), name='lives_status'),
    path('lives/decrease/', DecreaseLivesView.as_view(), name='lives_decrease'),
    path('minigames/play/', MinigamePlayView.as_view(), name='minigame_play'),
    path('', include(router.urls)),
]
