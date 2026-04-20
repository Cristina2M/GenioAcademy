import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course, Lesson, Exercise

COURSES_DATA = {
    'Sumas Galácticas': [
        {
            'title': 'El Contador de Estrellas',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">Contando Astros</h3><p class="mb-4 text-slate-300 text-lg">Sumar es agrupar elementos. Si tienes 2 satélites y llegan 3 más, ahora tienes 5.</p><div class="bg-purple-900/30 p-4 rounded-xl border-l-4 border-purple-500"><p>✨ 2 + 3 = 5</p></div>',
            'question': 'Si en un sector hay 4 asteroides y detectamos 3 más, ¿cuántos hay en total?',
            'options': ['6', '7', '8'],
            'answer': '7'
        },
        {
            'title': 'Adiciones de Gran Alcance',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">Miles de Luces</h3><p class="mb-4 text-slate-300 text-lg">Al sumar números grandes, trabajamos por columnas galácticas: unidades, decenas y centenas.</p>',
            'question': '¿Cuánto es 120 + 35?',
            'options': ['150', '155', '165'],
            'answer': '155'
        },
        {
            'title': 'Propiedades Galácticas',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">El Orden no Altera el Cosmos</h3><p class="mb-4 text-slate-300 text-lg">La propiedad conmutativa dice que a + b = b + a. No importa si cuentas primero las estrellas rojas o las azules.</p>',
            'question': 'Si 10 + 5 = 15, ¿cuánto es 5 + 10?',
            'options': ['15', '20', '10'],
            'answer': '15'
        }
    ],
    'Restas Espaciales': [
        {
            'title': 'Evaporando Materia',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">La Diferencia Estelar</h3><p class="mb-4 text-slate-300 text-lg">Restar es quitar una cantidad a otra. Si tenías 10 litros de combustible y gastas 4, te quedan 6.</p>',
            'question': 'Si un cohete tiene 5 motores y se averían 2, ¿cuántos motores le quedan operativos?',
            'options': ['3', '2', '4'],
            'answer': '3'
        },
        {
            'title': 'Restas con Llevada (Agujeros de Gusano)',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">Pidiendo Prestado al Vecino</h3><p class="mb-4 text-slate-300 text-lg">Cuando la cifra de arriba es menor que la de abajo, pedimos una decena a la columna de al lado.</p>',
            'question': '¿Cuánto es 52 - 17?',
            'options': ['35', '45', '38'],
            'answer': '35'
        },
        {
            'title': 'Verificación de Sensores',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">La Prueba Cósmica</h3><p class="mb-4 text-slate-300 text-lg">Puedes comprobar una resta sumando el resultado con lo que quitaste. Si volvemos al inicio, ¡es correcto!</p>',
            'question': 'Si 20 - 8 = 12, ¿cómo lo compruebas?',
            'options': ['12 + 8 = 20', '20 + 8 = 28', '12 - 8 = 4'],
            'answer': '12 + 8 = 20'
        }
    ],
    # I will add more courses as I go to avoid giant files in one turn
}

def populate(course_title):
    if course_title not in COURSES_DATA:
        print(f"No hay datos para {course_title}")
        return False
    
    try:
        course = Course.objects.get(title=course_title)
        course.lessons.all().delete()
        
        for i, data in enumerate(COURSES_DATA[course_title], 1):
            lesson = Lesson.objects.create(
                course=course,
                title=data['title'],
                content=data['content'],
                order=i
            )
            Exercise.objects.create(
                lesson=lesson,
                question=data['question'],
                options=data['options'],
                correct_answer=data['answer']
            )
        print(f"✅ {course_title} poblado")
        return True
    except Exception as e:
        print(f"Error en {course_title}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        populate(sys.argv[1])
    else:
        print("Uso: python populate_one.py 'Nombre del Curso'")
