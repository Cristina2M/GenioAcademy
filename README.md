# 📝 Genio Academy - Plataforma de Aprendizaje Incremental

Este proyecto es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, Genio Academy organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, permitiendo un aprendizaje personalizado.

## 🚀 Fase 1: Cimentación y Entorno (Docker & Estructura)

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción, facilitando la escalabilidad y el despliegue.

### 🏗️ Arquitectura del Sistema

El sistema se compone de tres contenedores principales:

1. **Frontend**: Desarrollado con **React + Vite** (SPA moderna y rápida).
2. **Backend**: Desarrollado con **Django + Django REST Framework** (API robusta).
3. **Database**: **PostgreSQL** para la persistencia de datos relacionales.

---

### 📋 Guía de Comandos (Cheat Sheet)

Para que el proyecto funcione, siempre debemos ejecutar estos comandos desde la raíz de la carpeta `GenioAcademy`.

#### 🔹 Gestión del Entorno (Docker)

* **Levantar el proyecto por primera vez (o tras cambios de configuración):**
`docker-compose up --build`
* **Levantar el proyecto normalmente (día a día):**
`docker-compose up`
* **Detener todos los servicios:**
`docker-compose down`
* **Limpieza total (borra contenedores y base de datos):**
`docker-compose down -v`

#### 🔹 Comandos de Backend (Django)

*Nota: Usamos `docker-compose exec backend` para lanzar comandos dentro del contenedor en ejecución.*

* **Crear la estructura del proyecto (Ejecutado al inicio):**
`docker-compose run backend django-admin startproject core .`
* **Sincronizar la Base de Datos (Migraciones):**
`docker-compose exec backend python manage.py migrate`
* **Crear un usuario Administrador (para acceder a /admin):**
`docker-compose exec backend python manage.py createsuperuser`
* **Crear un nuevo módulo (App):**
`docker-compose exec backend python manage.py startapp nombre_de_la_app`

#### 🔹 Comandos de Frontend (React + Vite)

* **Crear el proyecto base (Ejecutado al inicio):**
`npm create vite@latest . -- --template react`
* **Instalar nuevas librerías (ejemplo Tailwind):**
`docker-compose exec frontend npm install nombre-libreria`

---

### 🛠️ Detalles de Implementación

1. **Frontend (Vite)**: Configurado en el puerto `5173`. Se usa la bandera `--host` para permitir el acceso desde el contenedor.
2. **Backend (Django)**: Configurado en el puerto `8000`. Incluye `django-cors-headers` para permitir la comunicación con el frontend.
3. **Persistencia**: Se utiliza un volumen de Docker (`postgres_data`) para que los datos no se borren al apagar los contenedores.

### 📍 Estado Actual

* [x] Configuración de Docker y Docker Compose.
* [x] Inicialización de Proyecto Django.
* [x] Inicialización de Proyecto React con Vite.
* [x] Conexión establecida con PostgreSQL.
* [ ] Instalación de Tailwind CSS y DaisyUI.
* [ ] Creación del Modelo de Usuario Personalizado.

---

### 💡 Notas de Desarrollo

* **Hot Reload**: Los cambios en el código se reflejan automáticamente.
* **Versión de Node**: Se utiliza `Node 22-slim` para evitar errores de compatibilidad con Vite.

---
