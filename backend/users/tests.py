# Importaciones básicas para pruebas en Django
from django.test import TestCase
# Importamos utilidades de Django REST Framework para simular peticiones web
from rest_framework.test import APIClient
from rest_framework import status

# Importamos nuestro modelo de usuario personalizado a testear
from .models import CustomUser

# Clase que encapsula todas las pruebas automáticas para la app de usuarios
class UsersAPITest(TestCase):
    
    # Método "setUp": Se ejecuta siempre una vez ANTES de cada 'def test_...'
    # Prepara el entorno y crea datos temporales de prueba
    def setUp(self):
        # Creamos una instancia de APIClient para poder realizar peticiones (GET, POST, etc.)
        self.client = APIClient()
        
        # Creamos un usuario de prueba en la base de datos temporal
        self.user = CustomUser.objects.create_user(
            username="estudiante_prueba",
            password="password_secreto123",
            subscription_level=CustomUser.SubscriptionLevel.LEVEL_1
        )

    # Las funciones que empiezan con "test_" son las pruebas propiamente dichas.
    # Prueba para asegurarnos de que el endpoint de lista de usuarios funciona correctamente.
    def test_get_users(self):
        # Ejecutamos una petición GET a nuestra URL (la API REST generada por el router)
        response = self.client.get('/api/users/users/')
        
        # Aseguramos que la respuesta del servidor es correcta (HTTP 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Aseguramos que el resultado contiene al menos a nuestro usuario creado en el setUp
        self.assertEqual(len(response.data), 1)
        
        # Opcional: Validamos que el nombre del usuario insertado coincide con la respuesta
        self.assertEqual(response.data[0]['username'], "estudiante_prueba")

    # Prueba para asegurarnos de que el endpoint de Autenticación de JWT funciona.
    def test_get_jwt_token(self):
        # Ejecutamos una petición POST para intentar obtener un token
        response = self.client.post('/api/token/', {
            'username': 'estudiante_prueba',
            'password': 'password_secreto123'
        })
        
        # Validamos que nos han dado acceso (HTTP 200 OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Validamos que se incluyen las claves generadas
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    # Prueba para validar que un usuario nuevo puede registrarse desde la API de forma anónima
    def test_user_registration(self):
        response = self.client.post('/api/users/users/', {
            'username': 'nuevo_estudiante',
            'email': 'nuevo@genio.com',
            'password': 'password_segura',
            'subscription_level': 2
        })
        
        # Comprobar si se creó con éxito (201 Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Validar que podemos hacer login con la nueva cuenta (comprobando que la password se hasheó)
        login_response = self.client.post('/api/token/', {
            'username': 'nuevo_estudiante',
            'password': 'password_segura'
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
