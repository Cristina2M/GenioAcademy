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
    'Multiplicación Cuántica': [
        {
            'title': 'Clonación de Materia',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">Sumar Rápido</h3><p class="mb-4 text-slate-300 text-lg">Multiplicar es sumar el mismo número varias veces. 3 x 4 es lo mismo que 3+3+3+3.</p>',
            'question': 'Si tienes 4 cajas con 5 raciones de comida cada una, ¿cuántas raciones tienes?',
            'options': ['20', '15', '25'],
            'answer': '20'
        },
        {
            'title': 'Las Tablas de Navegación',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">Patrones Numéricos</h3><p class="mb-4 text-slate-300 text-lg">Dominar las tablas del 1 al 10 te permite calcular órbitas en milisegundos.</p>',
            'question': '¿Cuánto es 7 x 8?',
            'options': ['56', '54', '64'],
            'answer': '56'
        },
        {
            'title': 'Multiplicando por Cero y Uno',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">La Singularidad</h3><p class="mb-4 text-slate-300 text-lg">Cualquier número multiplicado por 0 es 0 (la nada). Multiplicado por 1, se queda igual (identidad).</p>',
            'question': '¿Cuánto es 450 x 0?',
            'options': ['0', '450', '1'],
            'answer': '0'
        }
    ],
    'División Cósmica': [
        {
            'title': 'Reparto Equitativo',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">Justicia Galáctica</h3><p class="mb-4 text-slate-300 text-lg">Dividir es repartir una cantidad en partes iguales. Si tienes 10 gemas para 2 exploradores, cada uno recibe 5.</p>',
            'question': 'Tienes 12 cristales de energía y 3 naves. ¿Cuántos cristales le das a cada nave?',
            'options': ['4', '3', '6'],
            'answer': '4'
        },
        {
            'title': 'El Resto del Cargamento',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">Divisiones Inexactas</h3><p class="mb-4 text-slate-300 text-lg">A veces sobra algo. Ese "algo" se llama resto. Si repartes 7 manzanas entre 3 personas, sobran 1.</p>',
            'question': 'Si divides 10 entre 3, ¿cuál es el resto?',
            'options': ['1', '0', '2'],
            'answer': '1'
        },
        {
            'title': 'La División por Cero',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">¡Peligro: Agujero Negro!</h3><p class="mb-4 text-slate-300 text-lg">Nunca intentes dividir por cero. Es una operación imposible que rompería las leyes matemáticas del universo.</p>',
            'question': '¿Se puede dividir 50 entre 0?',
            'options': ['No, es imposible', 'Sí, da 0', 'Sí, da 50'],
            'answer': 'No, es imposible'
        }
    ],
    'Ecuaciones de 1er Grado': [
        {
            'title': 'El Misterio de la X',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">La Incógnita Estelar</h3><p class="mb-4 text-slate-300 text-lg">Una ecuación es una balanza en equilibrio. La "X" es un valor oculto que debemos despejar para que ambos lados sigan pesando lo mismo.</p>',
            'question': 'En la ecuación X + 5 = 12, ¿cuánto vale X?',
            'options': ['7', '8', '5'],
            'answer': '7'
        },
        {
            'title': 'Despejando el Radier',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">El Salto del Igual</h3><p class="mb-4 text-slate-300 text-lg">Cuando un número cruza el signo "=", cambia su operación: si estaba sumando, pasa restando; si multiplicaba, pasa dividiendo.</p>',
            'question': 'Si 2X = 10, ¿cuál es el siguiente paso para despejar X?',
            'options': ['X = 10 / 2', 'X = 10 - 2', 'X = 10 * 2'],
            'answer': 'X = 10 / 2'
        },
        {
            'title': 'Equilibrio de Antimateria',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">Operaciones en Ambos Lados</h3><p class="mb-4 text-slate-300 text-lg">Lo que hagas a un lado del igual, DEBES hacerlo al otro. Si restas 3 a la izquierda, resta 3 a la derecha para no romper el equilibrio cósmico.</p>',
            'question': 'En 3X - 1 = 8, ¿cuánto vale 3X antes de despejar la X final?',
            'options': ['9', '7', '10'],
            'answer': '9'
        }
    ],
    'Fracciones Interestelares': [
        {
            'title': 'Partes de la Galaxia',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Numerador y Denominador</h3><p class="mb-4 text-slate-300 text-lg">Una fracción representa una parte de un todo. El denominador (abajo) dice en cuántas partes dividimos la pizza galáctica. El numerador (arriba) dice cuántas nos comemos.</p>',
            'question': 'En la fracción 3/4, ¿cuál es el denominador?',
            'options': ['4', '3', '7'],
            'answer': '4'
        },
        {
            'title': 'Fracciones Equivalentes',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Diferentes Formas, Misma Masa</h3><p class="mb-4 text-slate-300 text-lg">1/2 planeta es lo mismo que 2/4 de planeta. Aunque los números cambien, la cantidad de materia es la misma.</p>',
            'question': '¿Cuál de estas fracciones es equivalente a 1/2?',
            'options': ['2/4', '1/3', '2/3'],
            'answer': '2/4'
        },
        {
            'title': 'Suma de Fragmentos Cósmicos',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Mismo Denominador</h3><p class="mb-4 text-slate-300 text-lg">Si las partes son del mismo tamaño (mismo denominador), solo tienes que sumar los numeradores. ¡Fácil como contar estrellas!</p>',
            'question': '¿Cuánto es 1/5 + 2/5?',
            'options': ['3/5', '3/10', '2/5'],
            'answer': '3/5'
        }
    ],
    'Geometría de Órbitas': [
        {
            'title': 'Formas en el Vacío',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Puntos, Rectas y Planos</h3><p class="mb-4 text-slate-300 text-lg">La geometría estudia el espacio. Un punto es una coordenada, una recta es la trayectoria de un fotón y un plano es la superficie de un panel solar.</p>',
            'question': '¿Cómo se llama la línea que une el centro de un círculo con cualquier punto de su borde?',
            'options': ['Radio', 'Diámetro', 'Perímetro'],
            'answer': 'Radio'
        },
        {
            'title': 'Áreas de Campos de Fuerza',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Superficies Proyectadas</h3><p class="mb-4 text-slate-300 text-lg">Calcular el área es saber cuánto espacio ocupa una forma. Para un cuadrado, multiplicamos lado por lado.</p>',
            'question': '¿Cuál es el área de un cuadrado de lado 5 unidades?',
            'options': ['25', '20', '10'],
            'answer': '25'
        },
        {
            'title': 'Perímetros y Órbitas',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">El Borde del Universo</h3><p class="mb-4 text-slate-300 text-lg">El perímetro es la longitud del contorno. Si caminas alrededor de un asteroide rectangular, la distancia total recorrida es su perímetro.</p>',
            'question': '¿Qué operación realizas para hallar el perímetro de un triángulo?',
            'options': ['Sumar sus tres lados', 'Multiplicar sus lados', 'Dividir la base por la altura'],
            'answer': 'Sumar sus tres lados'
        }
    ],
    'Polinomios Estelares': [
        {
            'title': 'Monomios de Energía',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Expresiones Simples</h3><p class="mb-4 text-slate-300 text-lg">Un monomio es un número y una letra pegados, como 3x. El número es el coeficiente y la letra es la parte literal.</p>',
            'question': 'En el monomio 5y, ¿cuál es el coeficiente?',
            'options': ['5', 'y', '5y'],
            'answer': '5'
        },
        {
            'title': 'Sumas de Términos Semejantes',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Agrupando Materia</h3><p class="mb-4 text-slate-300 text-lg">Solo puedes sumar monomios si tienen la misma letra. 2x + 3x = 5x. ¡Pero no puedes sumar 2x + 3y!</p>',
            'question': '¿Cuánto es 4a + 2a - a?',
            'options': ['5a', '6a', '4a'],
            'answer': '5a'
        },
        {
            'title': 'Grado de un Polinomio',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Nivel de Potencia</h3><p class="mb-4 text-slate-300 text-lg">El grado es el exponente más alto de la letra. En x² + 3x + 1, el grado es 2 porque el mayor exponente es el 2.</p>',
            'question': '¿Cuál es el grado del polinomio: x³ + 4x - 5?',
            'options': ['3', '1', '4'],
            'answer': '3'
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
        print(f"Course {course_title} populated successfully")
        return True
    except Exception as e:
        print(f"Error in {course_title}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        populate(sys.argv[1])
    else:
        print("Uso: python populate_one.py 'Nombre del Curso'")
