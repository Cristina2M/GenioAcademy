# 📝 Genio Academy - Plataforma de Aprendizaje Incremental

Este proyecto es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, Genio Academy organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, permitiendo un aprendizaje personalizado.

## 🚀 Fase 1: Cimentación y Entorno (Docker & Estructura)

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción.

### 🏗️ Arquitectura del Sistema

El sistema se compone de tres contenedores principales:

1. **Frontend**: React + Vite (SPA).
2. **Backend**: Django + Django REST Framework.
3. **Database**: PostgreSQL.

## 🎨 Fase 2: Identidad Visual y UI

Hemos integrado un sistema de diseño moderno basado en utilidades que permite un desarrollo rápido de interfaces.

* **Tailwind CSS v4**: Motor de estilos de última generación.
* **DaisyUI**: Librería de componentes basada en Tailwind para botones, formularios y layouts preconfigurados.

---

### 📋 Guía de Comandos (Cheat Sheet)

Para que el proyecto funcione, siempre debemos ejecutar estos comandos desde la raíz de la carpeta `GenioAcademy`.

#### 🔹 Gestión del Entorno (Docker)

* **Levantar el proyecto / Reconstruir:** `docker-compose up --build`
* **Levantar el proyecto normalmente:** `docker-compose up`
* **Detener todos los servicios:** `docker-compose down`
* **Limpieza total (borra contenedores y BD):** `docker-compose down -v`

#### 🔹 Comandos de Backend (Django)

* **Migraciones:** `docker-compose exec backend python manage.py migrate`
* **Crear Superusuario:** `docker-compose exec backend python manage.py createsuperuser`
* **Crear App:** `docker-compose exec backend python manage.py startapp nombre_de_la_app`

#### 🔹 Comandos de Frontend (React)

* **Instalar librerías (si el contenedor está corriendo):** `docker-compose exec frontend npm install nombre-libreria`
* **Instalar librerías (si el contenedor está parado):** `docker-compose run --rm frontend npm install nombre-libreria`

---

### 🛠️ Detalles Técnicos de la Fase Actual

1. **Tailwind v4 Config**: Debido a la arquitectura de Docker, la configuración se ha centralizado en `src/index.css` mediante `@import "tailwindcss";` y `@plugin "daisyui";`.
2. **PostCSS**: Se utiliza `@tailwindcss/postcss` para procesar los estilos correctamente dentro de Vite.
3. **CORS**: El backend está preparado para aceptar peticiones desde el origen del frontend (`localhost:5173`).

### 📍 Estado Actual

* [x] Configuración de Docker y Docker Compose.
* [x] Inicialización de Proyecto Django y React con Vite.
* [x] Conexión establecida con PostgreSQL.
* [x] **Instalación y configuración de Tailwind CSS v4 y DaisyUI.**
* [ ] Creación del Modelo de Usuario Personalizado (Niveles 1, 2 y 3).
* [ ] Maquetación de la Navbar y Página de Inicio.

---

### 💡 Notas de Desarrollo

* **Extensiones de Archivo**: Para las configuraciones de PostCSS y Tailwind en esta estructura, se recomienda usar `.js` o `.cjs` según la necesidad de compatibilidad con CommonJS detectada durante la Fase 2.
* **Hot Reload**: Los cambios en el CSS y JSX se reflejan al instante.

---

