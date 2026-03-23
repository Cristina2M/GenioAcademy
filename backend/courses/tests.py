# Importaciones para pruebas unitarias en Django
from django.test import TestCase
# Importamos el cliente API de Django REST Framework y los códigos de estado HTTP
from rest_framework.test import APIClient
from rest_framework import status

# Importamos los modelos de cursos
from .models import Category, KnowledgeLevel, Course

# Clase principal de pruebas para el módulo de cursos
class CoursesAPITest(TestCase):
    
    # Preparación de datos simulados en base de datos antes de testear
    def setUp(self):
        # Inicializamos el cliente web de pruebas
        self.client = APIClient()
        
        # Creamos datos jerárquicos: Categoría -> Nivel de Conocimiento -> Curso
        self.category = Category.objects.create(
            name="Matemáticas", 
            description="Ciencias exactas y números"
        )
        self.level = KnowledgeLevel.objects.create(
            category=self.category,
            name="Sumas y Restas",
            order=1
        )
        self.course = Course.objects.create(
            knowledge_level=self.level,
            title="Curso introductorio de Sumas",
            description="Aprende a sumar desde cero"
        )

    # 1. Prueba: Verificar que se pueden listar las categorías y los niveles están anidados
    def test_get_categories(self):
        # Hacemos una llamada GET
        response = self.client.get('/api/courses/categories/')
        
        # Validamos código HTTP
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Comprobamos longitud de la lista
        self.assertEqual(len(response.data), 1)
        # Comprobamos que el atributo 'name' de la categoría coincide
        self.assertEqual(response.data[0]['name'], "Matemáticas")
        
    # 2. Prueba: Verificar la recuperación directa de cursos
    def test_get_courses(self):
        response = self.client.get('/api/courses/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Curso introductorio de Sumas")
