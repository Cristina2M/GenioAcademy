# ============================================================
# ARCHIVO: users/models.py
# FUNCIÓN: Define el modelo del alumno (usuario personalizado).
#
# Usamos "AbstractUser" de Django (el usuario base con nombre,
# contraseña, email, etc.) y le añadimos nuestros campos extra
# de gamificación y suscripción.
# ============================================================

from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Nuestro modelo de alumno personalizado.
    Hereda todo lo que ya tiene Django por defecto (username, email,
    password, is_active...) y añade los campos del sistema RPG.
    """

    # ── PLAN DE SUSCRIPCIÓN ──
    # Controla qué funcionalidades tiene acceso el alumno.
    # Se elige durante el registro y se almacena como número entero (1, 2 o 3).
    class SubscriptionLevel(models.IntegerChoices):
        LEVEL_1 = 1, 'Órbita Base — Solo teoría y quiz básico (6,99€/mes)'
        LEVEL_2 = 2, 'Velocidad Luz — + IA Búho Genio 24/7 (12,99€/mes)'
        LEVEL_3 = 3, 'Agujero de Gusano — + Tutorías con profesor real (24,99€/mes)'

    subscription_level = models.IntegerField(
        choices=SubscriptionLevel.choices,
        default=SubscriptionLevel.LEVEL_1,
        verbose_name='Plan de Suscripción',
        help_text='Controla qué funciones ve el alumno en la plataforma.'
    )

    # ── GAMIFICACIÓN (Sistema RPG) ──

    # Puntos de experiencia acumulados a lo largo de todos los cursos completados
    experience_points = models.IntegerField(
        default=0,
        verbose_name='Puntos de Experiencia (XP)'
    )

    # Nivel actual del alumno, calculado a partir de los XP:
    # Para pasar al siguiente nivel se necesitan (nivel_actual × 500) XP acumulados.
    current_student_level = models.IntegerField(
        default=1,
        verbose_name='Nivel RPG del Alumno',
        help_text='Sube automáticamente al acumular XP. Desbloquea niveles de dificultad.'
    )

    # El búho/avatar que el alumno tiene activo.
    # Se almacena como un identificador de texto (ej: "buho1", "buho3").
    # Los búhos disponibles están definidos en frontend/src/utils/avatarUtils.js
    selected_avatar = models.CharField(
        max_length=50,
        default='buho1',
        verbose_name='Avatar Activo (Búho)',
        help_text='Identificador del búho seleccionado. Ejemplo: "buho1", "buho2".'
    )

    def __str__(self):
        # Cómo se ve este alumno en el panel de administración de Django
        return f"{self.username} — Nivel {self.current_student_level} (Plan {self.get_subscription_level_display()})"
