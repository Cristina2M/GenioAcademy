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
        },
        {
            'full_name': 'Dr. Aris Thorne',
            'title': 'Especialista en Historia Universal y Crónicas de la Tierra',
            'bio': 'Apasionado explorador de las civilizaciones humanas y su evolución técnica. El Dr. Thorne transforma la historia en una aventura épica, conectando el pasado con el futuro galáctico para que el alumno comprenda no solo qué pasó, sino por qué es vital para su propia misión estelar.',
            'avatar_url': '/assets/professors/prof_hist.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Doctorado en Arqueología Digital', 'institution': 'Oxford University'},
                    {'year': '2010', 'degree': 'Máster en Historia Contemporánea', 'institution': 'Sorbona de París'},
                    {'year': '2008', 'degree': 'Grado en Antropología', 'institution': 'Universidad de Salamanca'}
                ],
                'experience': [
                    {'period': '2020 - Presente', 'role': 'Conservador de Memoria Histórica', 'company': 'Genio Academy'},
                    {'period': '2016 - 2020', 'role': 'Guía de Expediciones Académicas', 'company': 'Geo-Astro Research'},
                    {'period': '2012 - 2016', 'role': 'Profesor de Geo-Política', 'company': 'Escuela Diplomática Mundial'}
                ],
                'methods': [
                    'Storytelling histórico inmersivo',
                    'Análisis de fuentes mediante Big Data',
                    'Cartografía crítica interactiva',
                    'Juegos de rol de gestión de crisis históricas',
                    'Paleontología digital comparada'
                ]
            },
            'subjects': [cat_lang] # Reutilizando categorías existentes o añadir nuevas si se desea
        },
        {
            'full_name': 'Dra. Lyra Nova',
            'title': 'Experta en Biología Molecular y Ecosistemas Estelares',
            'bio': 'Pionera en el estudio de la vida en entornos extremos. La Dra. Nova hace que la biología sea una exploración de nuestro propio diseño biológico en contacto con el cosmos. Su metodología se basa en la curiosidad científica extrema y la observación directa de sistemas complejos.',
            'avatar_url': '/assets/professors/prof_bio.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2016', 'degree': 'Doctorado en Bioquímica', 'institution': 'Stanford University'},
                    {'year': '2013', 'degree': 'Máster en Biología Sintética', 'institution': 'MIT'},
                    {'year': '2011', 'degree': 'Grado en Ciencias Biológicas', 'institution': 'Universidad de Buenos Aires'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Investigadora de Bio-Entornos', 'company': 'Genio Academy'},
                    {'period': '2016 - 2019', 'role': 'Analista de Bio-Seguridad', 'company': 'Star-Med Center'},
                    {'period': '2013 - 2016', 'role': 'Asistente de Laboratorio de Genética', 'company': 'Global Flora Foundation'}
                ],
                'methods': [
                    'Laboratorios virtuales de alta precisión',
                    'Mapas genéticos mediante Realidad Aumentada',
                    'Bio-ética en entornos tecnológicos',
                    'Simulación de ecosistemas auto-sostenibles',
                    'Análisis de patrones biológicos complejos'
                ]
            },
            'subjects': [cat_phys]
        },
        {
            'full_name': 'Dra. Sarah Moon',
            'title': 'Especialista en Comunicación Interplanetaria e Inglés Avanzado',
            'bio': 'Capitana de la comunicación global. La Dra. Moon enseña inglés no como una lengua estática, sino como la herramienta definitiva para conectar civilizaciones. Su enfoque práctico elimina las barreras del idioma mediante la inmersión lingüística en escenarios galácticos.',
            'avatar_url': '/assets/professors/prof_eng.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Máster en Lingüística Aplicada', 'institution': 'Cambridge University'},
                    {'year': '2011', 'degree': 'Grado en Estudios Internacionales', 'institution': 'Yale University'}
                ],
                'experience': [
                    {'period': '2018 - Presente', 'role': 'Coordinadora de Idiomas', 'company': 'Genio Academy'},
                    {'period': '2014 - 2018', 'role': 'Instructora de Vuelo y Lenguaje', 'company': 'Aero-Global Training'}
                ],
                'methods': [
                    'Inmersión lingüística situacional',
                    'Técnicas de comunicación asertiva',
                    'Aprendizaje acelerado mediante audio-estímulos',
                    'Debates diplomáticos simulados'
                ]
            },
            'subjects': [cat_lang]
        },
        {
            'full_name': 'Dra. Kiara Stone',
            'title': 'Geóloga Planetaria y Cartógrafa de Mundos Distantes',
            'bio': 'Exploradora de la materia que sostiene el universo. La Dra. Stone enseña geología como la historia escrita en las rocas de cada planeta. Sus alumnos aprenden a leer el terreno y a comprender las fuerzas que moldean los mundos que habitamos.',
            'avatar_url': '/assets/professors/prof_geo.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2015', 'degree': 'Doctorado en Geología Planetaria', 'institution': 'Arizona State University'},
                    {'year': '2012', 'degree': 'Grado en Ciencias de la Tierra', 'institution': 'UNAM'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Especialista en Análisis de Suelos', 'company': 'Genio Academy'},
                    {'period': '2015 - 2019', 'role': 'Investigadora de Campo', 'company': 'Exploración Minera Galáctica'}
                ],
                'methods': [
                    'Análisis mineralógico mediante espectroscopía',
                    'Prospección geofísica interactiva',
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
                    {'year': '2013', 'degree': 'Doctorado en Química Cuántica', 'institution': 'Heidelberg University'},
                    {'year': '2009', 'degree': 'Grado en Ingeniería Química', 'institution': 'Universidad Politécnica de Valencia'}
                ],
                'experience': [
                    {'period': '2017 - Presente', 'role': 'Jefe de Laboratorio de Química', 'company': 'Genio Academy'},
                    {'period': '2013 - 2017', 'role': 'Científico de Materiales Avanzados', 'company': 'Nano-Tech Soluciones'}
                ],
                'methods': [
                    'Simulación molecular cuántica',
                    'Experimentos químicos en microgravedad virtual',
                    'Síntesis de materiales mediante pulsos de luz'
                ]
            },
            'subjects': [cat_phys]
        },
        {
            'full_name': 'Dr. Theo Canvas',
            'title': 'Diseñador de Realidades Holográficas y Bellas Artes del Futuro',
            'bio': 'Arquitecto de la expresión visual en la era espacial. El Dr. Canvas fusiona las técnicas clásicas de pintura y escultura con las herramientas digitales más avanzadas, enseñando que el arte es la máxima expresión de la inteligencia y el espíritu humano.',
            'avatar_url': '/assets/professors/prof_art.png',
            'is_featured': True,
            'cv_json': {
                'education': [
                    {'year': '2011', 'degree': 'Máster en Artes Digitales', 'institution': 'Royal College of Art'},
                    {'year': '2008', 'degree': 'Grado en Bellas Artes', 'institution': 'Academia de San Carlos'}
                ],
                'experience': [
                    {'period': '2016 - Presente', 'role': 'Director Artístico Vocal', 'company': 'Genio Academy'},
                    {'period': '2012 - 2016', 'role': 'Concept Artist', 'company': 'Estudios de Cine Intergaláctico'}
                ],
                'methods': [
                    'Escultura de luz en espacios 3D',
                    'Composición visual transmedia',
                    'Historia del arte desde la perspectiva de la IA'
                ]
            },
            'subjects': [cat_lang]
        },
        {
            'full_name': 'Dra. Aria Sound',
            'title': 'Ingeniera de Frecuencias Cósmicas y Musicología Espacial',
            'bio': 'Experta en la armonía que conecta el universo. La Dra. Sound enseña cómo el sonido y la música son lenguajes universales capaces de influir en el bienestar y el aprendizaje. Sus clases combinan la teoría acústica con la creación sonora de vanguardia.',
            'avatar_url': '/assets/professors/prof_music.png',
            'is_featured': False,
            'cv_json': {
                'education': [
                    {'year': '2014', 'degree': 'Doctorado en Acústica y Vibración', 'institution': 'Berklee College of Music'},
                    {'year': '2010', 'degree': 'Grado en Composición Musical', 'institution': 'Conservatorio de Viena'}
                ],
                'experience': [
                    {'period': '2019 - Presente', 'role': 'Especialista en Educación Sonora', 'company': 'Genio Academy'},
                    {'period': '2015 - 2019', 'role': 'Ingeniera de Sonido en Misiones Estelares', 'company': 'Agencia Espacial Europea'}
                ],
                'methods': [
                    'Diseño sonoro holístico',
                    'Psicoacústica aplicada al aprendizaje',
                    'Síntesis sonora mediante datos estelares'
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
