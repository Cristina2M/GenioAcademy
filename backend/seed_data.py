from courses.models import Category, KnowledgeLevel, Course

# Limpiar para evitar duplicados
Category.objects.all().delete()

# Misiones Matemáticas
cat_mates = Category.objects.create(name="Misiones Matemáticas", description="El lenguaje del universo, desde aritmética hasta trigonometría.")
nivel1_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Aritmética Básica", order=1)
nivel2_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Álgebra Intermedia", order=2)
Course.objects.create(knowledge_level=nivel1_mates, title="Sumas Galácticas", description="Aprende a sumar con asteroides.")
Course.objects.create(knowledge_level=nivel1_mates, title="Restas Espaciales", description="Aprende a restar viajando a la velocidad de la luz.")
Course.objects.create(knowledge_level=nivel2_mates, title="Ecuaciones de 1er Grado", description="Encuentra la incógnita X para ganar combustible.")

# Leyes de la Física
cat_fisica = Category.objects.create(name="Leyes de la Física", description="Entiende cómo se comportan los planetas y la materia.")
nivel1_fisica = KnowledgeLevel.objects.create(category=cat_fisica, name="Leyes de Newton", order=1)
Course.objects.create(knowledge_level=nivel1_fisica, title="Fuerza y Movimiento", description="Descubre cómo se propulsan los cohetes.")

print("Base de datos cósmica poblada con éxito.")
