from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    LEVEL_CHOICES = (
        (1, 'Nivel 1 - Ejercicios'),
        (2, 'Nivel 2 - Ejercicios + Teoría/Videos'),
        (3, 'Nivel 3 - Ejercicios + Teoría/Videos + Tutorías'),
    )
    subscription_level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    
    def __str__(self):
        return self.username
