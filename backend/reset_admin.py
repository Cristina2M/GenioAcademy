import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
admin, created = User.objects.get_or_create(username='admin', defaults={'is_superuser': True, 'is_staff': True, 'email': 'admin@genioacademy.com'})

admin.is_superuser = True
admin.is_staff = True
admin.set_password('admin123')
admin.save()

print("✅ Superusuario 'admin' reseteado con contraseña 'admin123'")
