from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    class SubscriptionLevel(models.IntegerChoices):
        LEVEL_1 = 1, 'Nivel 1 - Ejercicios'
        LEVEL_2 = 2, 'Nivel 2 - Ejercicios, Teoría y Vídeos'
        LEVEL_3 = 3, 'Nivel 3 - Ejercicios, Teoría, Vídeos y Tutorías'

    subscription_level = models.IntegerField(
        choices=SubscriptionLevel.choices,
        default=SubscriptionLevel.LEVEL_1,
        verbose_name='Nivel de Suscripción'
    )

    def __str__(self):
        return f"{self.username} - Nivel {self.subscription_level}"
