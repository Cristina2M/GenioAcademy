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

    # --- 1. Crear Categorías de Asignaturas si no existen ---
    cat_math, _ = Category.objects.get_or_create(
        name='Misiones Matemáticas',
        defaults={'description': 'Cálculo, Álgebra y Geometría aplicada a la navegación estelar.'}
    )
    cat_lang, _ = Category.objects.get_or_create(
        name='Lengua y Literatura',
        defaults={'description': 'Gramática, Literatura y Comunicación efectiva.'}
    )
    cat_phys, _ = Category.objects.get_or_create(
        name='Leyes de la Física',
        defaults={'description': 'Mecánica, Energía y el estudio del Cosmos.'}
    )
    cat_hist, _ = Category.objects.get_or_create(
        name='Historia y Civilizaciones',
        defaults={'description': 'Crónicas de la Tierra y evolución de las sociedades humanas.'}
    )
    cat_bio, _ = Category.objects.get_or_create(
        name='Bio-Ciencias Estelares',
        defaults={'description': 'Biología molecular, ecosistemas y vida en el universo.'}
    )
    cat_idioms, _ = Category.objects.get_or_create(
        name='Idiomas Galácticos',
        defaults={'description': 'Inglés y sistemas de comunicación interplanetaria.'}
    )
    cat_chem, _ = Category.objects.get_or_create(
        name='Química y Alquimia',
        defaults={'description': 'Ciencia de los materiales, reacciones y química estelar.'}
    )
    cat_art, _ = Category.objects.get_or_create(
        name='Artes y Creación',
        defaults={'description': 'Expresión visual, música y diseño de realidades.'}
    )

    # --- 2. Preparar Datos de Profesores ---
    professors_data = [
        {
            'full_name': 'Dr. Valerius Prime',
            'title': 'Doctor en Ciencias Físicas y Matemáticas',
            'bio': 'Con más de 20 años de experiencia en la investigación de agujeros de gusano y cálculo multivariable, el Dr. Valerius lidera el departamento de ciencias exactas. Su enfoque se centra en hacer que lo complejo sea intuitivo y emocionante para los jóvenes exploradores.',
            'avatar_url': '/assets/professors/prof_math.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2005', 'degree': 'Doctorado en Astrofísica', 'institution': 'MIT'},
                    {'year': '2000', 'degree': 'Grado en Matemáticas Puras', 'institution': 'Universidad de Stanford'}
                ],
                'experience': [
                    {'period': '2015 - Presente', 'role': 'Director Académico', 'company': 'Genio Academy'},
                    {'period': '2008 - 2015', 'role': 'Investigador Principal', 'company': 'CERN'}
                ],
                'methods': [
                    'Visualización geométrica en 3D',
                    'Resolución de problemas por analogía cósmica',
                    'Gamificación de sistemas de ecuaciones'
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
                    {'year': '2012', 'degree': 'Máster en Filología Hispánica', 'institution': 'UAM Madrid'}
                ],
                'experience': [
                    {'period': '2018 - Presente', 'role': 'Directora de Contenidos Lingüísticos', 'company': 'Genio Academy'},
                    {'period': '2015 - 2018', 'role': 'Tutora de Bachillerato Literario', 'company': 'Instituto Cervantes'}
                ],
                'methods': [
                    'Análisis crítico textual por capas',
                    'Debate Socrático aplicado a la literatura',
                    'Escritura creativa gamificada'
                ]
            },
            'subjects': [cat_lang]
        },
        {
            'full_name': 'Dr. Aris Thorne',
            'title': 'Especialista en Historia Universal y Crónicas de la Tierra',
            'bio': 'Apasionado explorador de las civilizaciones humanas y su evolución técnica. El Dr. Thorne transforma la historia en una aventura épica, conectando el pasado con el futuro galáctico para que el alumno comprenda no solo qué pasó, sino por qué es vital para su propia misión estelar.',
            'avatar_url': '/assets/professors/prof_hist.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Doctorado en Arqueología Digital', 'institution': 'Oxford University'}
                ],
                'experience': [
                    {'period': '2020 - Presente', 'role': 'Conservador de Memoria Histórica', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Storytelling histórico inmersivo',
                    'Cartografía crítica interactiva'
                ]
            },
            'subjects': [cat_hist]
        },
        {
            'full_name': 'Dra. Lyra Nova',
            'title': 'Experta en Biología Molecular y Ecosistemas Estelares',
            'bio': 'Pionera en el estudio de la vida en entornos extremos. La Dra. Nova hace que la biología sea una exploración de nuestro propio diseño biológico en contacto con el cosmos. Su metodología se basa en la curiosidad científica extrema y la observación directa de sistemas complejos.',
            'avatar_url': '/assets/professors/prof_bio.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2016', 'degree': 'Doctorado en Bioquímica', 'institution': 'Stanford University'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Investigadora de Bio-Entornos', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Laboratorios virtuales de alta precisión',
                    'Simulación de ecosistemas auto-sostenibles'
                ]
            },
            'subjects': [cat_bio]
        },
        {
            'full_name': 'Dra. Sarah Moon',
            'title': 'Especialista en Comunicación Interplanetaria e Inglés Avanzado',
            'bio': 'Capitana de la comunicación global. La Dra. Moon enseña inglés no como una lengua estática, sino como la herramienta definitiva para conectar civilizaciones. Su enfoque práctico elimina las barreras del idioma mediante la inmersión lingüística en escenarios galácticos.',
            'avatar_url': '/assets/professors/prof_eng.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Máster en Lingüística Aplicada', 'institution': 'Cambridge University'}
                ],
                'experience': [
                    {'period': '2018 - Presente', 'role': 'Coordinadora de Idiomas', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Inmersión lingüística situacional',
                    'Debates diplomáticos simulados'
                ]
            },
            'subjects': [cat_idioms]
        },
        {
            'full_name': 'Dra. Kiara Stone',
            'title': 'Geóloga Planetaria y Cartógrafa de Mundos Distantes',
            'bio': 'Exploradora de la materia que sostiene el universo. La Dra. Stone enseña geología como la historia escrita en las rocas de cada planeta. Sus alumnos aprenden a leer el terreno y a comprender las fuerzas que moldean los mundos que habitamos.',
            'avatar_url': '/assets/professors/prof_geo.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2015', 'degree': 'Doctorado en Geología Planetaria', 'institution': 'Arizona State University'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Especialista en Análisis de Suelos', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Análisis mineralógico mediante espectroscopía',
                    'Modelado 3D de tectónica planetaria'
                ]
            },
            'subjects': [cat_phys]
        },
        {
            'full_name': 'Dr. Felix Quantum',
            'title': 'Doctor en Química Estelar y Alquimia Moderna',
            'bio': 'Maestro de la transformación de la materia. El Dr. Quantum desvela los secretos químicos que ocurren en el corazón de las estrellas y cómo aplicarlos en la tecnología del día a día. Su laboratorio es un portal a la comprensión de los elementos que nos componen.',
            'avatar_url': '/assets/professors/prof_chem.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2013', 'degree': 'Doctorado en Química Cuántica', 'institution': 'Heidelberg University'}
                ],
                'experience': [
                    {'period': '2017 - Presente', 'role': 'Jefe de Laboratorio de Química', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Simulación molecular cuántica',
                    'Síntesis de materiales mediante pulsos de luz'
                ]
            },
            'subjects': [cat_chem]
        },
        {
            'full_name': 'Dr. Theo Canvas',
            'title': 'Diseñador de Realidades Holográficas y Bellas Artes del Futuro',
            'bio': 'Arquitecto de la expresión visual en la era espacial. El Dr. Canvas fusiona las técnicas clásicas de pintura y escultura con las herramientas digitales más avanzadas, enseñando que el arte es la máxima expresión de la inteligencia y el espíritu humano.',
            'avatar_url': '/assets/professors/prof_art.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2011', 'degree': 'Máster en Artes Digitales', 'institution': 'Royal College of Art'}
                ],
                'experience': [
                    {'period': '2016 - Presente', 'role': 'Director Artístico Vocal', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Escultura de luz en espacios 3D',
                    'Historia del arte desde la perspectiva de la IA'
                ]
            },
            'subjects': [cat_art]
        },
        {
            'full_name': 'Dra. Aria Sound',
            'title': 'Ingeniera de Frecuencias Cósmicas y Musicología Espacial',
            'bio': 'Experta en la armonía que conecta el universo. La Dra. Sound enseña cómo el sonido y la música son lenguajes universales capaces de influir en el bienestar y el aprendizaje. Sus clases combinan la teoría acústica con la creación sonora de vanguardia.',
            'avatar_url': '/assets/professors/prof_music.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Doctorado en Acústica y Vibración', 'institution': 'Berklee College of Music'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Especialista en Educación Sonora', 'company': 'Genio Academy'}
                ],
                'methods': [
                    'Diseño sonoro holístico',
                    'Psicoacústica aplicada al aprendizaje',
                    'Síntesis sonora mediante datos estelares'
                ]
            },
            'subjects': [cat_art]
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
