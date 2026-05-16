# ============================================================
# ARCHIVO: ai/urls.py
# FUNCIÓN: Define la ruta del endpoint del tutor virtual Astro.
#
# Endpoint disponible bajo /api/ai/:
#   /chat/   → POST — El alumno envía un mensaje y Astro (Groq/LLaMA) responde.
#              Solo accesible para alumnos con Plan 2 o superior.
# ============================================================

from django.urls import path
from .views import ChatView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='ai_chat'),
]
