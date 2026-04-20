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
from django.utils import timezone


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

    # ── SISTEMA DE VIDAS (PLANETAS) ──

    # Número de planetas (vidas) actuales del alumno. Máximo: 3.
    lives_count = models.IntegerField(
        default=3,
        verbose_name='Planetas (Vidas)',
        help_text='Máximo 3. Se pierden al fallar una evaluación y se regeneran con el tiempo.'
    )

    # Reloj maestro de regeneración pasiva.
    # Cuando el alumno pierde una vida, guardamos el instante exacto.
    # Cada 2 horas que pasen desde ese momento, se recupera 1 planeta automáticamente
    # sin necesidad de tareas en segundo plano (calculamos la diferencia al vuelo cuando el alumno conecta).
    last_life_lost_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Momento de pérdida de la última vida',
        help_text='Punto de partida del reloj de regeneración de 2 horas.'
    )

    def __str__(self):
        # Cómo se ve este alumno en el panel de administración de Django
        return f"{self.username} — Nivel {self.current_student_level} (Plan {self.get_subscription_level_display()}) | Vidas: {self.lives_count}/3"


# ============================================================
# MODELO: MinigameLog
# FUNCIÓN: Registra cadáver vez que un alumno juega un minijuego.
#
# De esta forma podemos aplicar el cooldown de 24 horas por minijuego:
# si el registro de hoy ya existe en esta tabla, el alumno no puede volver a jugar.
# ============================================================
class MinigameLog(models.Model):

    # El alumno que jugó (si se borra el alumno, sus registros de juego se borran también)
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='minigame_logs',
        verbose_name='Alumno'
    )

    # Identificador único del minijuego jugado (ej: 'pairs', 'arcade', 'wordsearch', 'fill_word', 'true_false')
    minigame_id = models.CharField(
        max_length=50,
        verbose_name='ID del minijuego'
    )

    # Instante exacto en que se jugó para calcular el cooldown de 24 horas
    played_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Jugado el'
    )

    def __str__(self):
        return f"{self.user.username} — {self.minigame_id} — {self.played_at.strftime('%d/%m/%Y %H:%M')}"
