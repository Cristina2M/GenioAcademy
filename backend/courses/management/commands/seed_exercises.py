from django.core.management.base import BaseCommand
from courses.models import Course, Lesson, Exercise

class Command(BaseCommand):
    help = 'Siembra lecciones y ejercicios reales en los cursos existentes.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Iniciando siembra de lecciones y ejercicios...')

        # --- 1. MATEMÁTICAS: SUMAS GALÁCTICAS ---
        curso_sumas = Course.objects.filter(title="Sumas Galácticas").first()
        if curso_sumas:
            # Lección 1
            l1, _ = Lesson.objects.get_or_create(
                course=curso_sumas, 
                title="Aritmética de Asteroides",
                defaults={'content': "<p>La suma es la operación base del universo. Si tienes 5 asteroides y atraes 3 más con tu rayo tractor, tendrás 8.</p>", 'order': 1}
            )
            Exercise.objects.get_or_create(
                lesson=l1, question="¿Cuánto es 5 + 7?",
                defaults={'options': ["10", "11", "12", "13"], 'correct_answer': "12"}
            )
            Exercise.objects.get_or_create(
                lesson=l1, question="Si una nave tiene 3 motores y le acoplamos otros 3, ¿cuántos tiene en total?",
                defaults={'options': ["3", "6", "9", "12"], 'correct_answer': "6"}
            )
            Exercise.objects.get_or_create(
                lesson=l1, question="Sumar 15 + 10 da como resultado:",
                defaults={'options': ["20", "25", "30", "35"], 'correct_answer': "25"}
            )

            # Lección 2
            l2, _ = Lesson.objects.get_or_create(
                course=curso_sumas, 
                title="Suma de Decenas Espaciales",
                defaults={'content': "<p>Cuando sumamos decenas, nos movemos más rápido por la galaxia.</p>", 'order': 2}
            )
            Exercise.objects.get_or_create(
                lesson=l2, question="¿Cuánto es 20 + 30?",
                defaults={'options': ["40", "50", "60", "70"], 'correct_answer': "50"}
            )
            Exercise.objects.get_or_create(
                lesson=l2, question="45 + 5 es igual a:",
                defaults={'options': ["40", "45", "50", "55"], 'correct_answer': "50"}
            )

        # --- 2. FÍSICA: FUERZA Y MOVIMIENTO ---
        curso_fisica = Course.objects.filter(title="Fuerza y Movimiento").first()
        if curso_fisica:
            l3, _ = Lesson.objects.get_or_create(
                course=curso_fisica, 
                title="Primera Ley de Newton",
                defaults={'content': "<p>Un objeto en reposo permanecerá en reposo a menos que una fuerza externa actúe sobre él.</p>", 'order': 1}
            )
            Exercise.objects.get_or_create(
                lesson=l3, question="¿Qué científico formuló las leyes del movimiento?",
                defaults={'options': ["Einstein", "Newton", "Galileo", "Tesla"], 'correct_answer': "Newton"}
            )
            Exercise.objects.get_or_create(
                lesson=l3, question="La inercia es la resistencia de un cuerpo a cambiar su estado de:",
                defaults={'options': ["Color", "Masa", "Movimiento", "Temperatura"], 'correct_answer': "Movimiento"}
            )

        # --- 3. HISTORIA: EGIPTO Y LOS FARAONES ---
        curso_egipto = Course.objects.filter(title="Egipto y los Faraones").first()
        if curso_egipto:
            l4, _ = Lesson.objects.get_or_create(
                course=curso_egipto, 
                title="Las Grandes Pirámides",
                defaults={'content': "<p>Las pirámides eran tumbas monumentales para los faraones, construidas con bloques de piedra gigantescos.</p>", 'order': 1}
            )
            Exercise.objects.get_or_create(
                lesson=l4, question="¿En qué río se desarrolló la civilización egipcia?",
                defaults={'options': ["Tígris", "Éufrates", "Nilo", "Amazonas"], 'correct_answer': "Nilo"}
            )
            Exercise.objects.get_or_create(
                lesson=l4, question="¿Cómo se llamaban los reyes del Antiguo Egipto?",
                defaults={'options': ["Zares", "Emperadores", "Faraones", "Sultanes"], 'correct_answer': "Faraones"}
            )

        self.stdout.write(self.style.SUCCESS('Lecciones y ejercicios sembrados con exito.'))
