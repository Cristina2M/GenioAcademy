from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'subscription_level', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Suscripción', {'fields': ('subscription_level',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Suscripción', {'fields': ('subscription_level',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
