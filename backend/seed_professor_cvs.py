"""
Script: seed_professor_cvs.py
Rellena el cv_json de los profesores si está vacío.
Es IDEMPOTENTE: si ya tienen datos, no los sobreescribe.
Se ejecuta desde build.sh en el despliegue de Render.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from teachers.models import Professor

CVS = {
    "Dr. Aris Thorne": {
        "education": [
            {"year": "2005", "degree": "Doctorado en Matemáticas Puras", "institution": "Universidad Autónoma de Madrid"},
            {"year": "2001", "degree": "Licenciatura en Matemáticas", "institution": "Universidad Complutense de Madrid"},
        ],
        "experience": [
            {"period": "2015 - Presente", "role": "Catedrático de Matemáticas ESO/Bachillerato", "company": "IES Severo Ochoa, Madrid"},
            {"period": "2008 - 2015", "role": "Profesor Asociado de Álgebra", "company": "Universidad Autónoma de Madrid"},
            {"period": "2005 - 2008", "role": "Investigador Postdoctoral", "company": "Instituto de Ciencias Matemáticas (ICMAT)"},
        ],
        "methods": ["Aprendizaje Socrático", "Gamificación", "Resolución de Problemas", "Pensamiento Crítico", "Flipped Classroom"],
    },
    "Dr. Felix Quantum": {
        "education": [
            {"year": "2007", "degree": "Doctorado en Física Teórica", "institution": "Universidad de Granada"},
            {"year": "2002", "degree": "Licenciatura en Física", "institution": "Universidad de Valencia"},
        ],
        "experience": [
            {"period": "2016 - Presente", "role": "Jefe del Departamento de Física", "company": "IES Isaac Newton, Valencia"},
            {"period": "2010 - 2016", "role": "Investigador en Física de Partículas", "company": "CERN, Ginebra (colaboración)"},
            {"period": "2007 - 2010", "role": "Profesor de Física y Química", "company": "IES Juan de la Cierva, Murcia"},
        ],
        "methods": ["Experimentación Activa", "Laboratorio Virtual", "Aprendizaje Basado en Proyectos", "Simulaciones", "Debate Científico"],
    },
    "Dra. Elara Vantaris": {
        "education": [
            {"year": "2009", "degree": "Doctorado en Biología Molecular", "institution": "Universidad de Barcelona"},
            {"year": "2004", "degree": "Licenciatura en Biología", "institution": "Universidad de Salamanca"},
        ],
        "experience": [
            {"period": "2017 - Presente", "role": "Profesora de Biología y Geología ESO", "company": "IES Goya, Zaragoza"},
            {"period": "2011 - 2017", "role": "Investigadora en Genómica", "company": "Centro Nacional de Investigaciones Oncológicas (CNIO)"},
            {"period": "2009 - 2011", "role": "Profesora Adjunta de Biología Celular", "company": "Universidad de Barcelona"},
        ],
        "methods": ["Aprendizaje Basado en Casos", "Prácticas de Laboratorio", "Mapas Conceptuales", "Aprendizaje Cooperativo", "Gamificación Científica"],
    },
    "Dra. Sarah Moon": {
        "education": [
            {"year": "2010", "degree": "Doctorado en Filología Hispánica", "institution": "Universidad de Sevilla"},
            {"year": "2005", "degree": "Licenciatura en Filología", "institution": "Universidad de Córdoba"},
        ],
        "experience": [
            {"period": "2018 - Presente", "role": "Profesora de Lengua y Literatura ESO/Bachillerato", "company": "IES Blas Infante, Sevilla"},
            {"period": "2013 - 2018", "role": "Coordinadora del Departamento de Lengua", "company": "Colegio Sagrada Familia, Córdoba"},
            {"period": "2010 - 2013", "role": "Profesora de Español para Extranjeros (ELE)", "company": "Instituto Cervantes, Berlín"},
        ],
        "methods": ["Lectura Dialógica", "Escritura Creativa", "Análisis de Textos", "Debate y Oratoria", "Aprendizaje por Descubrimiento"],
    },
    "Dra. Kiara Stone": {
        "education": [
            {"year": "2008", "degree": "Doctorado en Historia Medieval", "institution": "Universidad Complutense de Madrid"},
            {"year": "2003", "degree": "Licenciatura en Geografía e Historia", "institution": "Universidad de Alcalá de Henares"},
        ],
        "experience": [
            {"period": "2015 - Presente", "role": "Profesora de Geografía e Historia ESO", "company": "IES Cervantes, Madrid"},
            {"period": "2009 - 2015", "role": "Investigadora en Historia Social", "company": "CSIC - Centro de Ciencias Humanas y Sociales"},
            {"period": "2008 - 2009", "role": "Guía Cultural e Historiadora", "company": "Museo Arqueológico Nacional, Madrid"},
        ],
        "methods": ["Historia Viva", "Análisis de Fuentes Primarias", "Role-Playing Histórico", "Cartografía Digital", "Aprendizaje Basado en Proyectos"],
    },
    "Dr. Theo Canvas": {
        "education": [
            {"year": "2011", "degree": "Máster en Bellas Artes", "institution": "Escuela de Arte y Superior de Diseño de Valencia"},
            {"year": "2006", "degree": "Licenciatura en Historia del Arte", "institution": "Universidad de Granada"},
        ],
        "experience": [
            {"period": "2019 - Presente", "role": "Profesor de Educación Plástica y Visual ESO", "company": "IES Picasso, Málaga"},
            {"period": "2014 - 2019", "role": "Artista y Diseñador Gráfico Freelance", "company": "Estudios propios, Berlín y Valencia"},
            {"period": "2011 - 2014", "role": "Monitor de Artes Plásticas", "company": "Centre Civic El Carmel, Barcelona"},
        ],
        "methods": ["Aprendizaje Visual", "Proyectos de Arte Digital", "Visitas Virtuales a Museos", "Arte Colaborativo", "Técnicas Mixtas"],
    },
}

updated = 0
for professor in Professor.objects.all():
    # Idempotente: solo actualiza si el cv_json está vacío
    if not professor.cv_json and professor.full_name in CVS:
        professor.cv_json = CVS[professor.full_name]
        professor.save()
        print(f"[seed_professor_cvs] ✅ CV rellenado: {professor.full_name}")
        updated += 1
    elif professor.full_name in CVS:
        print(f"[seed_professor_cvs] ⏭  Ya tiene CV: {professor.full_name}")
    else:
        print(f"[seed_professor_cvs] ⚠️  Sin datos para: {professor.full_name}")

print(f"[seed_professor_cvs] Completado. {updated} profesores actualizados.")
