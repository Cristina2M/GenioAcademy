import os
import django

# Configuraciones para usar los modelos de Django directamente
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course, Lesson, Exercise
from django.db import transaction

def popullate_course_lessons(course_title, lessons_data):
    try:
        course = Course.objects.get(title=course_title)
        print(f"Borrando lecciones previas de '{course_title}'...")
        course.lessons.all().delete()
        
        print(f"Poblando '{course_title}'...")
        for index, data in enumerate(lessons_data, start=1):
            lesson = Lesson.objects.create(
                course=course,
                title=data['title'],
                content=data['content'],
                order=index
            )
            # Create the respective exercise (quiz)
            Exercise.objects.create(
                lesson=lesson,
                question=data['question_text'],
                options=[data['option_a'], data['option_b'], data['option_c']],
                correct_answer=data['correct_option_text']
            )
        print(f"✅ {course_title} poblado con {len(lessons_data)} lecciones/pestañas.")
    except Course.DoesNotExist:
        print(f"❌ El curso '{course_title}' no existe en la BD. Ejecuta seed_data.py primero.")

@transaction.atomic
def seed_content():
    # DATOS DE FÍSICA: Fuerza y Movimiento
    fisica_data = [
        {
            'title': '¿Qué es la Fuerza?',
            'content': """
                <h3 class="text-2xl text-cyan-400 font-bold mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Impulsando Naves Espaciales</h3>
                <p class="mb-4 text-slate-300 text-lg leading-relaxed">
                    Imagina que estás flotando en medio de la nada. Si no haces nada, te quedarás ahí para siempre. Para moverte necesitas una 
                    <span class="text-pink-400 font-bold bg-pink-900/30 px-2 py-1 rounded">Fuerza</span>.
                </p>
                <div class="bg-indigo-900/30 border-l-4 border-indigo-500 p-5 rounded-r-xl mb-4">
                    <p class="text-indigo-200">💡 <strong>Definición Astro:</strong> Una fuerza es todo aquel empuje o tracción que puede cambiar el estado de movimiento de un objeto planetario.</p>
                </div>
                <p class="text-slate-400 italic">Presta atención para el simulador: Las fuerzas son vectores, es decir, tienen dirección y sentido (¡importa hacia dónde empujas el cohete!).</p>
            """,
            'question_text': 'Si dos asteroides chocan con fuerzas opuestas de la misma magnitud exacta, ¿qué le ocurre a su estado de reposo?',
            'option_a': 'Continúan moviéndose al doble de velocidad.',
            'option_b': 'Las fuerzas se anulan y se quedan quietos.',
            'option_c': 'Giran sin parar como peonzas.',
            'correct_option_text': 'Las fuerzas se anulan y se quedan quietos.'
        },
        {
            'title': 'La Inercia Cósmica',
            'content': """
                <h3 class="text-2xl text-[#a855f7] font-bold mb-4">El Misterio del Vacío</h3>
                <p class="mb-4 text-slate-300 text-lg">
                    En la Tierra, si pateas un balón, eventualmente se frena por culpa por la fricción del aire o del suelo. ¡En el espacio no hay aire! 
                </p>
                <div class="w-full bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 my-6 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div class="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                    <h4 class="text-white font-bold mb-2">☄️ ¿Qué es la inercia?</h4>
                    <p class="text-slate-300 text-sm">
                        La <span class="text-blue-400 font-bold">Primera Ley de Newton</span> nos dice que un objeto en movimiento seguirá moviéndose en línea recta a menos que otra fuerza (como la gravedad de un planeta gigante) lo atraiga o lo frene.
                    </p>
                </div>
            """,
            'question_text': 'Lanzas una llave inglesa al espacio vacío (sin gravedad cercana ni aire). ¿Qué le pasará?',
            'option_a': 'Se frenará por su cuenta en un par de horas.',
            'option_b': 'Se desintegrará por el vacío.',
            'option_c': 'Viajará indefinidamente en línea recta al no tener resistencia.',
            'correct_option_text': 'Viajará indefinidamente en línea recta al no tener resistencia.'
        },
        {
            'title': 'Acción y Reacción',
            'content': """
                <h3 class="text-2xl text-emerald-400 font-bold mb-4">Motores a Reacción</h3>
                <p class="mb-4 text-slate-300 text-lg">
                    Para que nuestra nave vaya hacia adelante, expulsamos los gases calientes violentamente hacia <strong>atrás</strong>. Esta es la fascinante Tercera Ley.
                </p>
                <div class="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                    <p class="text-white">🚀 <strong>ACCIÓN:</strong> Gases hacia atrás.</p>
                    <p class="text-white">🌠 <strong>REACCIÓN:</strong> Nave hacia adelante.</p>
                </div>
                <p class="mt-6 text-slate-400 text-sm">Por cada acción, ocurre una fuerza de reacción igual pero en dirección *completamente contraria*.</p>
            """,
            'question_text': 'Según el principio de Acción y Reacción, la fuerza proyectada hacia adelante se conoce comúnmente como:',
            'option_a': 'Inercia de la nave.',
            'option_b': 'Empuje.',
            'option_c': 'Fricción de aceleración.',
            'correct_option_text': 'Empuje.'
        }
    ]

    # DATOS DE BIOLOGÍA: Estructura de la Tierra
    bio_data = [
        {
            'title': 'Las Capas Planetarias',
            'content': """
                <h3 class="text-2xl text-amber-400 font-bold mb-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">¿Qué hay bajo nuestros pies?</h3>
                <p class="mb-4 text-slate-300 text-lg leading-relaxed">
                    Antes de colonizar mundos alienígenas, debemos conocer la estructura del nuestro. Nuestro planeta parece sólido pero, por dentro, es un caos ardiente de minerales divididos en tres niveles.
                </p>
                <ul class="list-disc list-inside text-slate-300 space-y-2 mt-4 ml-2">
                    <li><strong class="text-orange-300">Corteza:</strong> La piel rocosa exterior super fina (donde vivimos).</li>
                    <li><strong class="text-red-400">Manto:</strong> Roca semi-fundida, densa e hirviente.</li>
                    <li><strong class="text-yellow-500">Núcleo:</strong> Hierro ardiente, responsable del magnetismo que nos protege de la radiación solar.</li>
                </ul>
            """,
            'question_text': '¿Cuál es la capa que actúa como motor magnético para protegernos de la radiación estelar?',
            'option_a': 'La corteza rocosa externa.',
            'option_b': 'El manto superior de magma.',
            'option_c': 'El núcleo interno giratorio de hierro.',
            'correct_option_text': 'El núcleo interno giratorio de hierro.'
        },
        {
            'title': 'La Litosfera Despierta',
            'content': """
                <h3 class="text-2xl text-rose-400 font-bold mb-4">Placas Tectónicas</h3>
                <p class="mb-4 text-slate-300 text-lg">
                    La corteza y una porción rígida del manto forman la <strong>Litosfera</strong>. Al no ser un bloque unificado, está rota en pedazos como si fuera un <span class="bg-slate-800 px-2 py-1 italic rounded">rompecabezas gigante</span>.
                </p>
                <div class="bg-rose-900/20 border border-rose-500/30 p-5 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.1)] mb-4">
                    <p class="text-rose-100/80">Cuando la convección del calor del núcleo empuja este rompecabezas, estas placas chocan, se friccionan o se separan.</p>
                </div>
                <p class="text-slate-400">Este es el motivo de que la Tierra sea un planeta geológicamente "vivo".</p>
            """,
            'question_text': '¿Qué ocurre típicamente por el constante choque y fricción de las placas litosféricas?',
            'option_a': 'Mareas violentas en los océanos.',
            'option_b': 'Terremotos y la formación de grandes cadenas montañosas.',
            'option_c': 'Fluctuaciones en el ciclo biológico del clima.',
            'correct_option_text': 'Terremotos y la formación de grandes cadenas montañosas.'
        }
    ]

    popullate_course_lessons("Fuerza y Movimiento", fisica_data)
    popullate_course_lessons("Estructura de la Tierra", bio_data)

if __name__ == "__main__":
    seed_content()
