#!/usr/bin/env bash
# =============================================================
# build.sh — Script de construcción para Render (producción)
# =============================================================
# Render ejecuta este script automáticamente en cada deploy.
# Hace tres cosas en orden:
#   1. Instala las dependencias de Python
#   2. Reúne todos los archivos estáticos del admin de Django
#   3. Aplica todas las migraciones de base de datos pendientes
# No necesit as hacer nada de esto a mano: Render lo ejecuta solo.
# =============================================================

set -o errexit  # Sale del script si algún comando falla

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

# Siembra categorías y cursos si la BD está vacía (idempotente)
python manage.py seed_production

# Expande el contenido de las lecciones existentes (idempotente)
python expand_lessons.py
