# ============================================================
# ARCHIVO: seed_teachers.py
# FUNCIÓN: Puebla la base de datos con los profesores del claustro.
# ============================================================

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from teachers.models import Professor
from courses.models import Category

def seed_teachers():
    print("--- Iniciando poblado de Profesores ---")

    # 1. Obtener o crear categorías
    cat_math, _ = Category.objects.get_or_create(name='Misiones Matemáticas')
    cat_lang, _ = Category.objects.get_or_create(name='Lengua y Literatura')
    cat_phys, _ = Category.objects.get_or_create(name='Leyes de la Física')

    # 2. Definir datos de profesores
    professors_data = [
        {
            'full_name': 'Dr. Valerius Prime',
            'title': 'Doctor en Ciencias Físicas y Matemáticas',
            'bio': 'Con más de 15 años de experiencia docente, el Dr. Valerius es especialista en pedagogía del cálculo avanzado. Su enfoque combina el rigor académico con una metodología adaptativa que asegura que ningún alumno se quede atrás en las materias de ciencias, transformando desafíos complejos en conceptos claros.',
            'avatar_url': '/assets/professors/prof_math.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2012', 'degree': 'Máster en Educación Secundaria', 'institution': 'Facultad de Pedagogía'},
                    {'year': '2010', 'degree': 'Doctorado en Física Teórica', 'institution': 'Universidad Central de Ciencias'},
                    {'year': '2008', 'degree': 'Grado en Matemáticas Puras', 'institution': 'Universidad Central de Ciencias'},
                    {'year': '2009', 'degree': 'Certificación en Diseño Instruccional', 'institution': 'E-Learning Global'}
                ],
                'experience': [
                    {'period': '2015 - Presente', 'role': 'Jefe de Departamento de Ciencias', 'company': 'Genio Academy / International Stem'},
                    {'period': '2012 - 2015', 'role': 'Coordinador Pedagógico', 'company': 'Colegio Mayor de Ciencias'},
                    {'period': '2008 - 2012', 'role': 'Profesor Titular de Álgebra', 'company': 'Centro Regional de Estudios Avanzados'},
                    {'period': '2006 - 2008', 'role': 'Investigador Junior', 'company': 'Laboratorio de Cuántica Aplicada'}
                ],
                'methods': [
                    'Aprendizaje basado en problemas (PBL)',
                    'Gamificación en entornos virtuales',
                    'Cálculo visual y nemotecnia avanzada',
                    'Método Singapur adaptado',
                    'Flipped Classroom (Clase invertida)',
                    'Evaluación continua por competencias'
                ]
            },
            'subjects': [cat_math, cat_phys]
        },
        {
            'full_name': 'Dra. Elara Vantaris',
            'title': 'Catedrática en Filología Hispánica y Literatura',
            'bio': 'Experta en análisis literario y competencias comunicativas transversales. La Dra. Elara ha dedicado su carrera a fomentar el pensamiento crítico en jóvenes, utilizando herramientas vanguardistas para que la lengua y la literatura sean asignaturas comprensibles, dinámicas y apasionantes.',
            'avatar_url': '/assets/professors/prof_lang.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2015', 'degree': 'Doctorado en Literatura Comparada', 'institution': 'Universidad Complutense'},
                    {'year': '2012', 'degree': 'Máster en Filología Hispánica', 'institution': 'UAM Madrid'},
                    {'year': '2010', 'degree': 'Grado en Humanidades y Lenguas', 'institution': 'Universidad de Sevilla'},
                    {'year': '2013', 'degree': 'Especialista en Escritura Creativa', 'institution': 'Escuela de Letras'}
                ],
                'experience': [
                    {'period': '2018 - Presente', 'role': 'Directora de Contenidos Lingüísticos', 'company': 'Genio Academy'},
                    {'period': '2015 - 2018', 'role': 'Tutora de Bachillerato Literario', 'company': 'Instituto Cervantes'},
                    {'period': '2012 - 2015', 'role': 'Lectora de Español', 'company': 'Universidad de Bolonia'},
                    {'period': '2010 - 2012', 'role': 'Editora de Textos Pedagógicos', 'company': 'Editorial Saber'}
                ],
                'methods': [
                    'Análisis crítico textual por capas',
                    'Debate Socrático aplicado a la literatura',
                    'Escritura creativa gamificada',
                    'Narrativa transmedia educativa',
                    'Aprendizaje cooperativo dinámico',
                    'Técnicas de oratoria y retórica'
                ]
            },
            'subjects': [cat_lang]
        }
    ]

    for data in professors_data:
        subjects = data.pop('subjects')
        prof, created = Professor.objects.update_or_create(
            full_name=data['full_name'],
            defaults=data
        )
        prof.subjects.set(subjects)
        if created:
            print(f"Creado profesor: {prof.full_name}")
        else:
            print(f"Actualizado profesor: {prof.full_name}")

    print("--- Poblado de Profesores finalizado con éxito ---")

if __name__ == '__main__':
    seed_teachers()
