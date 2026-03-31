# Importaciones necesarias de Django y del modelo de usuario base
from django.db import models
from django.contrib.auth.models import AbstractUser

# Definimos nuestro modelo CustomUser que hereda del usuario por defecto de Django
class CustomUser(AbstractUser):
    
    # Clase interna para definir las opciones de nivel de suscripción
    class SubscriptionLevel(models.IntegerChoices):
        # Opciones disponibles en la base de datos y sus descripciones legibles
        LEVEL_1 = 1, 'Nivel 1 - Ejercicios'
        LEVEL_2 = 2, 'Nivel 2 - Ejercicios, Teoría y Vídeos'
        LEVEL_3 = 3, 'Nivel 3 - Ejercicios, Teoría, Vídeos y Tutorías'

    # Campo personalizado para guardar el nivel de suscripción del usuario
    subscription_level = models.IntegerField(
        choices=SubscriptionLevel.choices, # Asignamos las opciones anteriores
        default=SubscriptionLevel.LEVEL_1, # Nivel por defecto (1)
        verbose_name='Nivel de Suscripción' # Nombre descriptivo para el panel de administración
    )

    # Campos de Gamificación RPG (Motor Incremental)
    experience_points = models.IntegerField(default=0)
    # Nivel RPG actual, aumenta segun ganes XP
    current_student_level = models.IntegerField(default=1)
    # El avatar (búho) que el jugador ha seleccionado mostrar
    selected_avatar = models.CharField(max_length=50, default='buho1')

    # Método para representar el objeto como texto (ej: en el panel de administrador)
    def __str__(self):
        # Devuelve el nombre de usuario y su nivel
        return f"{self.username} - Nivel {self.current_student_level} (Sub: {self.get_subscription_level_display()})"
