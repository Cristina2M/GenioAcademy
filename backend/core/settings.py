"""
Django settings for core project.
Configurado para funcionar tanto en desarrollo (Docker local) como en
producción (Render + Supabase) usando variables de entorno.
"""

import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# Cargamos las variables de entorno del archivo .env (solo en desarrollo)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── SEGURIDAD ──
# En producción estas variables vienen de Render. En local, del .env de Docker.
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-clave-local-solo-para-dev')

# DEBUG = False en producción. Render inyecta PRODUCTION=True.
DEBUG = os.environ.get('PRODUCTION', 'False') != 'True'

# Hosts permitidos: localhost para Docker + dominios de producción
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    '.onrender.com',          # El backend en Render (xxxx.onrender.com)
    'api.cristina2daw.es',    # Subdominio personalizado del backend
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'courses',
    'ai',
    'teachers',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoise debe ir justo después de SecurityMiddleware para servir
    # los archivos estáticos del panel de admin de Django en producción.
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# ── BASE DE DATOS ──
# En Docker local: usa la PostgreSQL del contenedor db via DATABASE_URL del compose.
# En Render: usa Supabase via DATABASE_URL inyectada como variable de entorno.
# Si no hay DATABASE_URL, cae a SQLite (útil para tests rápidos).
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
    )
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'Europe/Madrid'
USE_I18N = True
USE_TZ = True


# ── ARCHIVOS ESTÁTICOS ──
# STATIC_URL: URL pública desde donde se sirven los estáticos.
# STATIC_ROOT: Carpeta donde `collectstatic` los reúne todos.
# WhiteNoise los sirve desde ahí sin necesidad de Nginx.
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Modelo de usuario personalizado
AUTH_USER_MODEL = 'users.CustomUser'

# ── DJANGO REST FRAMEWORK ──
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
}

# ── SIMPLE JWT ──
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── AUTENTICACIÓN ──
AUTHENTICATION_BACKENDS = [
    'users.backends.EmailOrUsernameBackend',  # Intentar login por Email o Usuario
    'django.contrib.auth.backends.ModelBackend', # Fallback al sistema estándar
]

# ── CORS ──
# En producción solo permitimos peticiones desde nuestro frontend.
# En desarrollo (DEBUG=True) permitimos cualquier origen para comodidad.
CORS_ALLOW_ALL_ORIGINS = DEBUG  # True en local, False en producción

CORS_ALLOWED_ORIGINS = [
    # Desarrollo local
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Producción: dominio personalizado
    "https://cristina2daw.es",
    "https://www.cristina2daw.es",
    # Vercel: dominio principal del proyecto
    "https://genio-academy.vercel.app",
]

# Acepta cualquier subdominio de Vercel (cada preview tiene una URL única)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

# ── LOGGING ──
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# ── EMAIL ──
# En local (DEBUG): los emails se imprimen en la consola en lugar de enviarse.
# Perfecto para probar con cuentas de email que no existen.
# En producción (Render): configurar estas variables de entorno:
#   EMAIL_HOST_USER     → tu cuenta de Gmail (ej: genio.academy.noreply@gmail.com)
#   EMAIL_HOST_PASSWORD → contraseña de aplicación de Gmail (no la contraseña normal)
PRODUCTION_MODE = os.environ.get('PRODUCTION', 'False') == 'True'

if PRODUCTION_MODE:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
    DEFAULT_FROM_EMAIL = os.environ.get('EMAIL_HOST_USER', 'noreply@genio-academy.com')
else:
    # En desarrollo: los emails aparecen en la consola del servidor Django
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'noreply@genio-academy.com'

# URL base del frontend (para construir el enlace de reset en el email)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

