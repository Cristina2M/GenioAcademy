from courses.models import Category, KnowledgeLevel, Course

# Limpiar para evitar duplicados
Category.objects.all().delete()

# Misiones Matemáticas
cat_mates = Category.objects.create(name="Misiones Matemáticas", description="El lenguaje del universo, desde aritmética hasta trigonometría.")
nivel1_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Aritmética Básica", order=1)
nivel2_mates = KnowledgeLevel.objects.create(category=cat_mates, name="Álgebra Intermedia", order=2)
Course.objects.create(knowledge_level=nivel1_mates, title="Sumas Galácticas", description="Aprende a sumar con asteroides.")
Course.objects.create(knowledge_level=nivel1_mates, title="Restas Espaciales", description="Aprende a restar viajando a la velocidad de la luz.")
Course.objects.create(knowledge_level=nivel1_mates, title="Multiplicación Cuántica", description="Incrementa tus recursos multiplicando materia.")
Course.objects.create(knowledge_level=nivel1_mates, title="División Cósmica", description="Reparte provisiones equitativamente entre la tripulación.")
Course.objects.create(knowledge_level=nivel2_mates, title="Ecuaciones de 1er Grado", description="Encuentra la incógnita X para ganar combustible.")
Course.objects.create(knowledge_level=nivel2_mates, title="Fracciones Interestelares", description="Divide y conquista los recursos del universo.")
Course.objects.create(knowledge_level=nivel2_mates, title="Geometría de Órbitas", description="Calcula áreas y perímetros de campos de fuerza.")
Course.objects.create(knowledge_level=nivel2_mates, title="Polinomios Estelares", description="Maneja expresiones algebraicas de alta energía.")

# Leyes de la Física
cat_fisica = Category.objects.create(name="Leyes de la Física", description="Entiende cómo se comportan los planetas y la materia.")
nivel1_fisica = KnowledgeLevel.objects.create(category=cat_fisica, name="Leyes de Newton", order=1)
nivel2_fisica = KnowledgeLevel.objects.create(category=cat_fisica, name="Física Moderna", order=2)
Course.objects.create(knowledge_level=nivel1_fisica, title="Fuerza y Movimiento", description="Descubre cómo se propulsan los cohetes.")
Course.objects.create(knowledge_level=nivel1_fisica, title="Leyes de la Termodinámica", description="La energía no se crea ni se destruye.")
Course.objects.create(knowledge_level=nivel1_fisica, title="Electromagnetismo Básico", description="Campos magnéticos de los planetas alienígenas.")
Course.objects.create(knowledge_level=nivel1_fisica, title="Cinemática", description="Estudio del movimiento sideral.")
Course.objects.create(knowledge_level=nivel2_fisica, title="Relatividad Básica", description="Viaja a velocidades cercanas a la luz.")
Course.objects.create(knowledge_level=nivel2_fisica, title="Óptica Espacial", description="Refracción y lentes de telescopios interestelares.")
Course.objects.create(knowledge_level=nivel2_fisica, title="Dinámica de Fluidos", description="Comportamiento del plasma y gases nebulosos.")

# Biología y Geología
cat_bio = Category.objects.create(name="Biología y Geología", description="El estudio de la vida en nuestro planeta y la composición de los astros.")
nivel1_bio = KnowledgeLevel.objects.create(category=cat_bio, name="Planeta Tierra", order=1)
nivel2_bio = KnowledgeLevel.objects.create(category=cat_bio, name="Genética Espacial", order=2)
Course.objects.create(knowledge_level=nivel1_bio, title="Estructura de la Tierra", description="Minerales, rocas y placas tectónicas.")
Course.objects.create(knowledge_level=nivel1_bio, title="La Biosfera", description="Los ecosistemas y cómo sustentan la vida.")
Course.objects.create(knowledge_level=nivel1_bio, title="Célula Eucariota", description="El motor microscópico de la vida desarrollada.")
Course.objects.create(knowledge_level=nivel1_bio, title="Reinos de la Naturaleza", description="Clasifica las formas de vida extraterrestre y terrestre.")
Course.objects.create(knowledge_level=nivel2_bio, title="ADN Estelar", description="Los bloques constructores de las especies alienígenas y humanas.")
Course.objects.create(knowledge_level=nivel2_bio, title="Selección Natural", description="Adaptación a entornos hostiles en el espacio.")
Course.objects.create(knowledge_level=nivel2_bio, title="Virus y Bacterias", description="Microorganismos del universo profundo.")
Course.objects.create(knowledge_level=nivel2_bio, title="Anatomía Alienígena", description="Comparativa del interior celular en nuevos planetas.")

# Geografía e Historia
cat_historia = Category.objects.create(name="Geografía e Historia", description="Explora las civilizaciones antiguas y los mapas del universo.")
nivel1_historia = KnowledgeLevel.objects.create(category=cat_historia, name="Civilizaciones Antiguas", order=1)
nivel2_historia = KnowledgeLevel.objects.create(category=cat_historia, name="Historia Moderna", order=2)
Course.objects.create(knowledge_level=nivel1_historia, title="Egipto y los Faraones", description="Descifra los jeroglíficos y construye pirámides.")
Course.objects.create(knowledge_level=nivel1_historia, title="El Imperio Romano", description="La expansión del imperio y su legado.")
Course.objects.create(knowledge_level=nivel2_historia, title="La Revolución Industrial", description="Máquinas de vapor y cambios sociales.")
Course.objects.create(knowledge_level=nivel2_historia, title="Descubrimientos Geográficos", description="La ruta de las especias y el nuevo mundo.")

# Lengua y Literatura
cat_lengua = Category.objects.create(name="Lengua y Literatura", description="Domina el arte de la comunicación y las historias de la humanidad.")
nivel1_lengua = KnowledgeLevel.objects.create(category=cat_lengua, name="Gramática Vital", order=1)
nivel2_lengua = KnowledgeLevel.objects.create(category=cat_lengua, name="Análisis Sintáctico", order=2)
Course.objects.create(knowledge_level=nivel1_lengua, title="El Sustantivo y Adjetivo", description="Identifica las piezas clave de la oración.")
Course.objects.create(knowledge_level=nivel1_lengua, title="Acentuación Especial", description="No dejes que tu mensaje se pierda en el cosmos por una tilde.")
Course.objects.create(knowledge_level=nivel2_lengua, title="Sujeto y Predicado", description="Analiza el núcleo de la comunicación.")
Course.objects.create(knowledge_level=nivel2_lengua, title="Complementos Verbales", description="Cazadores de objetos directos e indirectos.")

print("Base de datos cósmica poblada con éxito.")
