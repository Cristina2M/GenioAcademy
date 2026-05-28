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

import json

# 🔧 HERRAMIENTAS (TOOLS) DEL AGENTE IA:
# Estas funciones están a disposición de Astro. El Agente decide de forma autónoma
# cuándo llamarlas para responder con datos reales y precisos del alumno.
ASTRO_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "consultar_estadisticas_alumno",
            "description": "Obtiene las estadísticas de juego y estudio del alumno actual de la base de datos (nivel RPG, XP acumulada, planetas/vidas restantes y racha de conexión). Úsala si el alumno te saluda o quiere saber su progreso o te pregunta sobre su nivel de vidas.",
            "parameters": {
                "type": "object",
                "properties": {},
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "recomendar_ejercicio_refuerzo",
            "description": "Devuelve un consejo o pregunta socrática interactiva para reforzar la materia del curso en el que el alumno se encuentra atascado.",
            "parameters": {
                "type": "object",
                "properties": {
                    "materia": {
                        "type": "string",
                        "description": "La materia actual (por ejemplo: Matemáticas, Historia, Ciencias)."
                    }
                },
                "required": ["materia"]
            }
        }
    }
]

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
            # 1. Llamada inicial a Groq incluyendo la definición de herramientas (Tools)
            chat_completion = client.chat.completions.create(
                messages=groq_messages,
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=600,
                tools=ASTRO_TOOLS,
                tool_choice="auto"
            )
            
            response_message = chat_completion.choices[0].message
            tool_calls = response_message.tool_calls
            
            # Si el agente decide autónomamente ejecutar una herramienta para responder mejor...
            if tool_calls:
                # Añadimos la intención del modelo al hilo de mensajes
                groq_messages.append(response_message)
                
                # Ejecutamos cada una de las llamadas solicitadas por el Agente
                for tool_call in tool_calls:
                    funcion_nombre = tool_call.function.name
                    funcion_args = json.loads(tool_call.function.arguments) if tool_call.function.arguments else {}
                    
                    tool_response_content = ""
                    
                    if funcion_nombre == "consultar_estadisticas_alumno":
                        # Obtenemos las estadísticas en vivo de la base de datos para el usuario logueado
                        tool_response_content = json.dumps({
                            "usuario": user.username,
                            "nivel_rpg": user.current_student_level,
                            "xp_puntos": user.experience_points,
                            "vidas_planetas": user.lives_count,
                            "racha_dias": user.streak_count,
                            "plan": user.get_subscription_level_display()
                        })
                    
                    elif funcion_nombre == "recomendar_ejercicio_refuerzo":
                        materia = funcion_args.get("materia", "General")
                        # Proporcionamos una pista interactiva según la materia
                        consejos = {
                            "Matemáticas": "Para resolver una ecuación, recuerda el principio de la balanza: lo que haces a un lado debes hacerlo al otro para mantener la igualdad. ¿Has intentado restar el mismo número en ambos lados?",
                            "Historia": "En historia es vital entender la causa y efecto. Trata de ver el evento no como una fecha aislada, sino como una consecuencia de factores económicos o políticos anteriores.",
                            "Ciencias": "El método científico empieza por la observación. ¿Qué hipótesis formularías para explicar el fenómeno físico que estamos estudiando?"
                        }
                        consejo = consejos.get(materia, "Concéntrate en desglosar el problema en partes más pequeñas y hazte preguntas sencillas sobre cada fragmento.")
                        tool_response_content = json.dumps({
                            "consejo_socratico": consejo,
                            "materia": materia
                        })
                    
                    # Añadimos la respuesta de la herramienta al hilo para que la IA la procese
                    groq_messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": funcion_nombre,
                        "content": tool_response_content
                    })
                
                # Segunda llamada a Groq: La IA ya tiene los datos reales de la herramienta y formula la respuesta final socrática
                segunda_respuesta = client.chat.completions.create(
                    messages=groq_messages,
                    model="llama-3.1-8b-instant",
                    temperature=0.7,
                    max_tokens=600
                )
                response_content = segunda_respuesta.choices[0].message.content
            else:
                # Si no requirió herramientas, devolvemos la respuesta de texto normal
                response_content = response_message.content
            
            return Response({"content": response_content}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Capturamos cualquier error (falla de API, límite de tokens, etc.)
            return Response(
                {"detail": f"Error de comunicación con Astro: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

