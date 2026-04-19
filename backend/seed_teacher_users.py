# ============================================================
# ARCHIVO: seed_teacher_users.py
# FUNCIÓN: Crea las cuentas de usuario para los profesores
# existentes en la base de datos y los enlaza.
# ============================================================

import os
import django
import unicodedata
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from teachers.models import Professor

CustomUser = get_user_model()

def clean_username(name):
    """
    Convierte 'Dr. Valerius Prime' en 'valerius.prime'.
    Minúsculas, quita acentos, símbolos y espacios extra.
    """
    # Quitar 'Dr. ', 'Dra. ', 'Prof. ', etc.
    name = name.replace('Dr. ', '').replace('Dra. ', '')
    
    # Quitar acentos
    name = ''.join(c for c in unicodedata.normalize('NFD', name)
                  if unicodedata.category(c) != 'Mn')
    
    # Minúsculas y reemplazar espacios por puntos
    name = name.lower().strip()
    name = re.sub(r'\s+', '.', name)
    return name

def seed_teacher_users():
    print("--- Generando Cuentas de Usuario para Profesores ---")
    
    professors = Professor.objects.all()
    if professors.count() == 0:
        print("No hay profesores en la base de datos. Ejecuta seed_teachers.py primero.")
        return

    password_default = "Genio2026!"
    created_count = 0
    updated_count = 0

    for prof in professors:
        username = clean_username(prof.full_name)
        email = f"{username}@genioacademy.edu"
        
        # Buscar si ya existe el usuario
        user, created = CustomUser.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': prof.full_name.split(' ')[0], # primer nombre aproximado
                'is_staff': True, # Los profes podrían ser staff
            }
        )
        
        if created:
            user.set_password(password_default)
            user.save()
            created_count += 1
            print(f"✅ Creado usuario: {username} (Contraseña: {password_default})")
        else:
            updated_count += 1
            print(f"Usuario {username} ya existía.")

        # Vincular al profesor si no lo está
        if prof.user != user:
            prof.user = user
            prof.save()
            print(f"   -> Vinculado '{prof.full_name}' con el usuario '{username}'")

    print(f"\n--- Completado! Creados: {created_count}, Actualizados: {updated_count} ---")

if __name__ == "__main__":
    seed_teacher_users()
