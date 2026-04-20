# Importaciones para configurar el panel de administrador
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Clase que personaliza cómo se ve el CustomUser en el panel de control de Django
class CustomUserAdmin(UserAdmin):
    # Especificamos el modelo que estamos gestionando
    model = CustomUser
    
    # Definimos qué columnas se mostrarán en la lista de usuarios
    list_display = ['username', 'email', 'subscription_level', 'is_staff']
    
    # Agregamos la sección de "Suscripción" a los formularios de edición de usuario
    fieldsets = UserAdmin.fieldsets + (
        ('Suscripción', {'fields': ('subscription_level',)}),
    )
    
    # Agregamos la sección de "Suscripción" a los formularios de creación de nuevo usuario
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Suscripción', {'fields': ('subscription_level',)}),
    )

# Registramos el modelo personalizado en el panel de administrador
admin.site.register(CustomUser, CustomUserAdmin)
