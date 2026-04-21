# Importamos herramientas necesarias para crear nuestro propio "endpoint" de la API y comunicarnos con la IA
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from groq import Groq

# 🔑 La llave mágica: sacamos nuestra clave secreta de las variables de entorno
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
# Creamos la conexión con la "nube" de la IA de Groq
client = Groq(api_key=GROQ_API_KEY)

# 🧠 "Prompt del Sistema": Son las instrucciones secretas y de comportamiento para la IA. 
SYSTEM_PROMPT = """Eres "Astro", un tutor de Secundaria paciente y socrático con forma de Búho.
Estás ayudando a un alumno que estudia el curso "{course_name}", específicamente la lección "{lesson_name}".

INFORMACIÓN DE TIEMPO:
- El momento actual del alumno es: {time_of_day} (son las {current_time}).
- Saluda adecuadamente según este horario (Buenos días/Buenas tardes/Buenas noches).

REGLAS ESTRICTAS:
- Si el alumno pide que le expliques un concepto, SÍ debes explicárselo de forma didáctica.
- NUNCA des la respuesta FINAL directamente. Guíalo para que la descubra él.
- Habla en español, con lenguaje sencillo y amable.
- No contestes TODO con una pregunta.
- Tus respuestas deben ser cortas (máximo 4 frases).
- Aunque seas un búho nocturno, eres consciente del horario del alumno y te adaptas a él.
"""

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # Protegemos la ruta: Comprobamos si el alumno tiene un plan Avanzado (2 o superior)
        if user.subscription_level < 2:
            return Response(
                {"detail": "Acceso denegado. Astro está disponible a partir del Plan Velocidad Luz."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # 1. Obtenemos la hora actual ajustada (España: UTC+2 en verano, UTC+1 en invierno)
        from django.utils import timezone
        import datetime
        ahora = timezone.now() + datetime.timedelta(hours=2) # Ajuste manual a CEST para la demo
        hora_str = ahora.strftime("%H:%M")
        hora_int = ahora.hour
        
        if 6 <= hora_int < 13:
            momento = "Mañana"
        elif 13 <= hora_int < 20:
            momento = "Tarde"
        else:
            momento = "Noche"
            
        data = request.data
        messages = data.get("messages", [])
        course_title = data.get("courseTitle", "General")
        lesson_title = data.get("lessonTitle", "Consulta")
        
        if not messages:
            return Response({"detail": "Faltan los mensajes."}, status=status.HTTP_400_BAD_REQUEST)

        # Preparamos el system prompt con el contexto y la hora
        sys_msg = SYSTEM_PROMPT.format(
            course_name=course_title, 
            lesson_name=lesson_title,
            time_of_day=momento,
            current_time=hora_str
        )
        
        groq_messages = [{"role": "system", "content": sys_msg}]
        
        # Después sumamos toda la charla que llevaba el alumno con Astro para que la IA no pierda el hilo
        for msg in messages:
            if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                groq_messages.append({"role": msg["role"], "content": msg["content"]})
                
        try:
            # Pedimos la respuesta a internet a "llama-3.1-8b-instant" (Una de las mentes brillantes de Groq)
            chat_completion = client.chat.completions.create(
                messages=groq_messages,
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=600,
            )
            
            response_content = chat_completion.choices[0].message.content
            
            return Response({"content": response_content}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Capturamos cualquier error (falla de API, límite de tokens, etc.)
            return Response(
                {"detail": f"Error de comunicación con Astro: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
