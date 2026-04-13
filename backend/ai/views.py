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
# Le decimos cómo actuar ('Astro' el Búho), qué no hacer (nunca dar la respuesta final) y qué es lo que el alumno está estudiando.
Estás ayudando a un alumno que estudia el curso "{course_name}", específicamente la lección "{lesson_name}".

REGLAS ESTRICTAS:
- Si el alumno pide que le expliques un concepto, SÍ debes explicárselo de forma didáctica (ej: "La suma es la unión de dos cantidades...").
- SIN EMBARGO, si el alumno te pide la respuesta FINAL de un problema o cálculo concreto, NUNCA se la des directamente. Guíalo para que la descubra él.
- Habla en español, con lenguaje sencillo y amable.
- No contestes TODO con una pregunta, solo usa preguntas para que el alumno relacione conceptos lógicos que ya le has explicado.
- Adapta la dificultad al nivel del alumno.
- Tus respuestas deben ser cortas (máximo 4 frases) para no abrumarle.
- Eres un búho muy sabio, puedes usar de vez en cuando alguna referencia espacial o de aves si encaja.
"""

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # Protegemos la ruta: Comprobamos si el alumno tiene un plan Avanzado (2 o superior)
        if user.subscription_level < 2:
            # Si tiene un plan gratuito (1), le denegamos el acceso
            return Response(
                {"detail": "Acceso denegado. Astro está disponible a partir del Plan Velocidad Luz."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Extraemos los datos que nos envía el React: los mensajes que ya se han escrito y dónde está el alumno
        data = request.data
        messages = data.get("messages", [])
        course_title = data.get("courseTitle", "General")
        lesson_title = data.get("lessonTitle", "Consulta")
        
        if not messages:
            return Response({"detail": "Faltan los mensajes."}, status=status.HTTP_400_BAD_REQUEST)

        # Preparamos el system prompt con el contexto
        sys_msg = SYSTEM_PROMPT.format(course_name=course_title, lesson_name=lesson_title)
        
        # Construimos el formato que espera la IA (una lista de mensajes guardada en forma de diccionario)
        # El primero siempre es la instrucción secreta
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
