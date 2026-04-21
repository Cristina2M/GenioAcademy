from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from courses.models import Category, KnowledgeLevel, Course
from teachers.models import Professor
from users.models import CustomUser


class Command(BaseCommand):
    """
    Comando de siembra de datos para producción.
    Uso: python manage.py seed_production
    Es idempotente: crea categorías, cursos y profesores si no existen.
    """
    help = 'Siembra las categorías, cursos y profesores iniciales en la base de datos.'

    def handle(self, *args, **kwargs):
        # 1. SIEMBRA DE CATEGORÍAS Y CURSOS
        if not Category.objects.exists():
            self.stdout.write('🌱 Sembrando categorías y cursos...')
            
            # ── Misiones Matemáticas ──
            cat_mates = Category.objects.create(
                name="Misiones Matemáticas",
                description="El lenguaje del universo, desde aritmética hasta trigonometría."
            )
            nivel1_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Aritmética Básica", order=1)
            nivel2_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Álgebra Intermedia", order=2)
            Course.objects.create(knowledge_level=nivel1_mates, title="Sumas Galácticas", description="Aprende a sumar con asteroides.")
            Course.objects.create(knowledge_level=nivel1_mates, title="Restas Espaciales", description="Aprende a restar viajando a la velocidad de la luz.")
            Course.objects.create(knowledge_level=nivel2_mates, title="Ecuaciones de 1er Grado", description="Encuentra la incógnita X para ganar combustible.")

            # ── Leyes de la Física ──
            cat_fisica = Category.objects.create(
                name="Leyes de la Física",
                description="Entiende cómo se comportan los planetas y la materia."
            )
            nivel1_fisica = KnowledgeLevel.objects.create(category=cat_fisica, name="Leyes de Newton", order=1)
            Course.objects.create(knowledge_level=nivel1_fisica, title="Fuerza y Movimiento", description="Descubre cómo se propulsan los cohetes.")

            # ── Biología y Geología ──
            cat_bio = Category.objects.create(
                name="Biología y Geología",
                description="El estudio de la vida en nuestro planeta y la composición de los astros."
            )
            nivel1_bio = KnowledgeLevel.objects.create(category=cat_bio, name="Planeta Tierra", order=1)
            Course.objects.create(knowledge_level=nivel1_bio, title="Estructura de la Tierra", description="Minerales, rocas y placas tectónicas.")

            # ── Geografía e Historia ──
            cat_historia = Category.objects.create(
                name="Geografía e Historia",
                description="Explora las civilizaciones antiguas y los mapas del universo."
            )
            nivel1_historia = KnowledgeLevel.objects.create(category=cat_historia, name="Civilizaciones Antiguas", order=1)
            Course.objects.create(knowledge_level=nivel1_historia, title="Egipto y los Faraones", description="Descifra los jeroglíficos.")

            # ── Lengua y Literatura ──
            cat_lengua = Category.objects.create(
                name="Lengua y Literatura",
                description="Domina el arte de la comunicación y las historias de la humanidad."
            )
            nivel1_lengua = KnowledgeLevel.objects.create(category=cat_lengua, name="Gramática Vital", order=1)
            Course.objects.create(knowledge_level=nivel1_lengua, title="El Sustantivo y Adjetivo", description="Identifica las piezas clave.")

            # ── Educación Plástica (Categoría extra para Theo Canvas) ──
            cat_arte = Category.objects.create(
                name="Expresión Artística",
                description="Creatividad visual y diseño en el espacio profundo."
            )

            self.stdout.write(self.style.SUCCESS('✅ Categorías y cursos creados.'))
        else:
            self.stdout.write('⚠️ Categorías ya existentes. Saltando...')
            cat_mates = Category.objects.get(name="Misiones Matemáticas")
            cat_fisica = Category.objects.get(name="Leyes de la Física")
            cat_bio = Category.objects.get(name="Biología y Geología")
            cat_historia = Category.objects.get(name="Geografía e Historia")
            cat_lengua = Category.objects.get(name="Lengua y Literatura")
            cat_arte, _ = Category.objects.get_or_create(name="Expresión Artística")

        # 2. SIEMBRA DE PROFESORES
        if not Professor.objects.exists():
            self.stdout.write('👨‍🏫 Sembrando claustro de profesores...')
            
            prof_data = [
                {
                    "username": "aris.thorne",
                    "full_name": "Dr. Aris Thorne",
                    "title": "Comandante de Misiones Matemáticas",
                    "avatar": "/assets/professors/prof_math.png",
                    "subjects": [cat_mates],
                    "bio": "Especialista en lógica pura y patrones estelares."
                },
                {
                    "username": "felix.quantum",
                    "full_name": "Dr. Felix Quantum",
                    "title": "Arquitecto de Física y Química",
                    "avatar": "/assets/professors/prof_chem.png",
                    "subjects": [cat_fisica],
                    "bio": "Explorador de la materia y la energía."
                },
                {
                    "username": "elara.vantaris",
                    "full_name": "Dra. Elara Vantaris",
                    "title": "Exploradora de Biología y Geología",
                    "avatar": "/assets/professors/prof_bio.png",
                    "subjects": [cat_bio],
                    "bio": "Bióloga marina y experta en exobiología."
                },
                {
                    "username": "sarah.moon",
                    "full_name": "Dra. Sarah Moon",
                    "title": "Embajadora de Lengua y Literatura",
                    "avatar": "/assets/professors/prof_lang.png",
                    "subjects": [cat_lengua],
                    "bio": "Lingüista experta en comunicación inter-cultural."
                },
                {
                    "username": "kiara.stone",
                    "full_name": "Dra. Kiara Stone",
                    "title": "Cronista de Geografía e Historia",
                    "avatar": "/assets/professors/prof_geo.png",
                    "subjects": [cat_historia],
                    "bio": "Historiadora y cartógrafa moderna."
                },
                {
                    "username": "theo.canvas",
                    "full_name": "Dr. Theo Canvas",
                    "title": "Maestro de Expresión Artística",
                    "avatar": "/assets/professors/prof_art.png",
                    "subjects": [cat_arte],
                    "bio": "Visionario del arte digital y tradicional."
                }
            ]

            for data in prof_data:
                # Crear usuario del profesor
                user, created = CustomUser.objects.get_or_create(
                    username=data['username'],
                    defaults={
                        'email': f"{data['username']}@genioacademy.es",
                        'password': make_password('Genio2026!'),
                        'is_staff': True
                    }
                )
                
                # Crear perfil de profesor
                prof = Professor.objects.create(
                    user=user,
                    full_name=data['full_name'],
                    title=data['title'],
                    bio=data['bio'],
                    avatar_url=data['avatar'],
                    is_featured=True
                )
                prof.subjects.set(data['subjects'])

            self.stdout.write(self.style.SUCCESS(f'✅ {len(prof_data)} profesores creados con éxito.'))
        else:
            self.stdout.write('⚠️ El claustro ya tiene integrantes. Saltando...')
