#!/bin/bash
# ==============================================================================
# SCRIPT: generate_docs.sh
# FUNCIÓN: Generación automática de documentación técnica para Backend y Frontend.
#
# Genera:
#   1. Docs del Backend (Python/Django) usando 'pdoc' en formato HTML interactivo.
#   2. Docs del Frontend (React/Vite) usando 'jsdoc' para componentes y funciones.
# ==============================================================================

# Colores para salida en consola
VERDE='\033[0;32m'
AZUL='\033[0;34m'
ROJO='\033[0;31m'
RESET='\033[0m'

echo -e "${AZUL}======================================================${RESET}"
echo -e "${AZUL}      GENERADOR DE DOCUMENTACIÓN DE GENIO ACADEMY      ${RESET}"
echo -e "${AZUL}======================================================${RESET}"

# Crear directorio de destino para la documentación si no existe
mkdir -p docs/backend
mkdir -p docs/frontend

# ── 1. GENERAR DOCUMENTACIÓN DEL BACKEND ──
echo -e "\n${AZUL}[1/2] Generando documentación del Backend (Python/Django)...${RESET}"
if ! command -v pip &> /dev/null; then
    echo -e "${ROJO}Error: 'pip' no está instalado en el sistema. Saltando docs de backend.${RESET}"
else
    # Aseguramos que 'pdoc' está instalado
    echo "Instalando/actualizando pdoc..."
    pip install --quiet pdoc

    # Generamos la documentación en docs/backend
    # Nota: excluimos carpetas de migraciones y librerías internas para que sea limpia
    echo "Analizando código del backend..."
    pdoc --html --output-dir docs/backend --force backend/courses backend/users backend/ai backend/teachers
    
    # Movemos los archivos generados a la raíz de la carpeta backend para mejor acceso
    if [ -d "docs/backend/backend" ]; then
        mv docs/backend/backend/* docs/backend/
        rm -rf docs/backend/backend
    fi
    echo -e "${VERDE}✔ Documentación del Backend generada correctamente en docs/backend/index.html${RESET}"
fi

# ── 2. GENERAR DOCUMENTACIÓN DEL FRONTEND ──
echo -e "\n${AZUL}[2/2] Generando documentación del Frontend (React/JS)...${RESET}"
if ! command -v npm &> /dev/null; then
    echo -e "${ROJO}Error: 'npm' no está instalado. Saltando docs de frontend.${RESET}"
else
    # Creamos un archivo de configuración básico para jsdoc si no existe
    echo "Instalando jsdoc localmente..."
    cd frontend
    npm install --save-dev --quiet jsdoc
    
    echo "Generando documentación con JSDoc..."
    # Ejecutamos jsdoc sobre la carpeta src/
    npx jsdoc -r src/ -d ../docs/frontend
    cd ..
    echo -e "${VERDE}✔ Documentación del Frontend generada correctamente en docs/frontend/index.html${RESET}"
fi

echo -e "\n${VERDE}======================================================${RESET}"
echo -e "${VERDE}  ¡PROCESO FINALIZADO CON ÉXITO!                      ${RESET}"
echo -e "${VERDE}  Puedes consultar la documentación abriendo:         ${RESET}"
echo -e "${VERDE}  - Backend:  docs/backend/index.html                 ${RESET}"
echo -e "${VERDE}  - Frontend: docs/frontend/index.html                ${RESET}"
echo -e "${VERDE}======================================================${RESET}"
