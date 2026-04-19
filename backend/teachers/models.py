# ============================================================
# ARCHIVO: teachers/models.py
# FUNCIÓN: Define el modelo de los Profesores de la academia.
#
# Cada profesor tiene una biografía, un título académico y está
# vinculado a una o varias asignaturas (ManyToManyField).
# ============================================================

from django.db import models
from django.conf import settings

class Professor(models.Model):
    # Opcionalmente, cada profesor puede ser un usuario del sistema 
    # (para futuro login/chat).
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='professor_profile',
        verbose_name='Usuario asociado'
    )

    full_name = models.CharField(max_length=255, verbose_name='Nombre completo')
    title = models.CharField(max_length=255, verbose_name='Título académico', help_text='Ej: PhD en Astrofísica')
    bio = models.TextField(verbose_name='Biografía profesional')
    
    # Usaremos una ruta de imagen para los avatares premium generados por IA
    avatar_url = models.CharField(
        max_length=500, 
        blank=True, 
        verbose_name='URL del Avatar',
        help_text='Ruta a la imagen del profesor (estética galáctica).'
    )

    # RELACIÓN M2M: Un profesor puede enseñar varias materias.
    subjects = models.ManyToManyField(
        'courses.Category',
        related_name='professors',
        verbose_name='Asignaturas que imparte'
    )

    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_featured = models.BooleanField(
        default=False, 
        verbose_name='Destacado en Home',
        help_text='Si está marcado, el profesor aparecerá en la landing page pública para los padres.'
    )

    # Nuevo campo para el Currículum Estructurado
    cv_json = models.JSONField(
        default=dict, 
        blank=True, 
        verbose_name='Datos del Currículum',
        help_text='Almacena formación, experiencia y habilidades en formato JSON.'
    )

    class Meta:
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'

    def __str__(self):
        return f'{self.full_name} — {self.title}'

class Consultation(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('ANSWERED', 'Respondida'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consultations',
        verbose_name='Estudiante'
    )
    professor = models.ForeignKey(
        Professor,
        on_delete=models.CASCADE,
        related_name='consultations',
        verbose_name='Profesor'
    )
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='consultations',
        verbose_name='Curso relacionado'
    )
    
    message = models.TextField(verbose_name='Mensaje / Duda')
    response = models.TextField(blank=True, verbose_name='Respuesta del Profesor')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', verbose_name='Estado')
    meeting_link = models.CharField(max_length=500, blank=True, verbose_name='Enlace de Videollamada (Jitsi)')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado el')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Actualizado el')

    class Meta:
        verbose_name = 'Consulta'
        verbose_name_plural = 'Consultas'
        ordering = ['-created_at']

    def __str__(self):
        return f'Consulta de {self.student.username} a {self.professor.full_name} ({self.get_status_display()})'
