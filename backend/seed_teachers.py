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
            'title': 'PhD en Astrofísica y Algoritmos Puros',
            'bio': 'Experto en navegación estelar y cálculo avanzado. Ha dirigido misiones de rescate en el borde exterior del sector 7.',
            'avatar_url': '/assets/professors/prof_math.png',
            'is_featured': True,
            'subjects': [cat_math, cat_phys]
        },
        {
            'full_name': 'Dra. Elara Vantaris',
            'title': 'Licenciada en Filología Galáctica Comparada',
            'bio': 'Especialista en descifrado de glifos antiguos y comunicación interestelar. Cree que la palabra es el arma más potente del universo.',
            'avatar_url': '/assets/professors/prof_lang.png',
            'subjects': [cat_lang]
        }
    ]

    for data in professors_data:
        subjects = data.pop('subjects')
        prof, created = Professor.objects.get_or_create(
            full_name=data['full_name'],
            defaults=data
        )
        if created:
            prof.subjects.set(subjects)
            print(f"Creado profesor: {prof.full_name}")
        else:
            print(f"Profesor ya existente: {prof.full_name}")

    print("--- Poblado de Profesores finalizado con éxito ---")

if __name__ == '__main__':
    seed_teachers()
