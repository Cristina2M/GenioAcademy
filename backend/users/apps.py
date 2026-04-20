# Importamos la configuración base de las aplicaciones en Django
from django.apps import AppConfig

# Clase de configuración para la aplicación de usuarios
class UsersConfig(AppConfig):
    # Tipo de campo automático por defecto para la base de datos (claves primarias)
    default_auto_field = 'django.db.models.BigAutoField'
    # Nombre de la aplicación (debe coincidir con la carpeta)
    name = 'users'
