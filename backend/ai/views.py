import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from groq import Groq

# Recuperamos la API key del entorno
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
# Instanciamos el cliente (se recomienda hacerlo globalmente o por request)
# Si GROQ_API_KEY no está seteada, Groq() intentará leer la variable de entorno GROQ_API_KEY automáticamente.
client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """Eres el "Búho Genio", un tutor de Secundaria paciente y socrático.
Estás ayudando a un alumno que estudia el curso "{course_name}", específicamente la lección "{lesson_name}".

REGLAS ESTRICTAS:
- Nunca des la respuesta directa. Siempre guía con preguntas.
- Habla en español, con lenguaje sencillo y amable.
- Si el alumno insiste en que le des la solución, anímale con empatía pero sigue sin dársela. Explica por qué es mejor que llegue solo.
- Adapta la dificultad al nivel del alumno.
- Tus respuestas deben ser cortas (máximo 3-4 frases) para no abrumarle.
- Eres un búho muy sabio, puedes usar de vez en cuando palabras temáticas espaciales o de aves si encaja.
"""

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # Validar plan (Solo Plan 2 y Plan 3 tienen acceso a la IA)
        if user.subscription_level < 2:
            return Response(
                {"detail": "Acceso denegado. El Búho IA está disponible a partir del Plan Velocidad Luz."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        data = request.data
        messages = data.get("messages", [])
        course_title = data.get("courseTitle", "General")
        lesson_title = data.get("lessonTitle", "Consulta")
        
        if not messages:
            return Response({"detail": "Faltan los mensajes."}, status=status.HTTP_400_BAD_REQUEST)

        # Preparamos el system prompt con el contexto
        sys_msg = SYSTEM_PROMPT.format(course_name=course_title, lesson_name=lesson_title)
        
        # Construimos el array de mensajes para Groq
        # Añadimos el system prompt al inicio
        groq_messages = [{"role": "system", "content": sys_msg}]
        
        # Agregamos el historial recibido (se espera una lista de diccionarios { "role": "user" o "assistant", "content": "..." })
        for msg in messages:
            if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                groq_messages.append({"role": msg["role"], "content": msg["content"]})
                
        try:
            # Llamamos al modelo (usamos llama3-8b-8192 o llama3-70b-8192)
            chat_completion = client.chat.completions.create(
                messages=groq_messages,
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=600,
            )
            
            response_content = chat_completion.choices[0].message.content
            
            return Response({"content": response_content}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Capturamos cualquier error (falla de API, límite de tokens, etc.)
            return Response(
                {"detail": f"Error de comunicación con el Búho Genio: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
