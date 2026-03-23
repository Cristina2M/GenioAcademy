# 📝 Genio Academy - Plataforma de Aprendizaje Incremental

Este proyecto es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, Genio Academy organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, permitiendo un aprendizaje personalizado.

## 🚀 Fase 1: Cimentación y Entorno (Docker & Estructura)

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción.

### 🏗️ Arquitectura del Sistema

El sistema se compone de tres contenedores principales:

1. **Frontend**: React + Vite (SPA).
2. **Backend**: Django + Django REST Framework.
3. **Database**: PostgreSQL.


### 📑 Fases del Proyecto (Roadmap)

A continuación se detalla el progreso del proyecto siguiendo la planificación establecida:

* **Fase 1: Análisis y Requisitos (Semanas 1-2)** 🟢
* Definición de la idea principal: Aprendizaje incremental para alumnos de la ESO.
* Identificación de los niveles de conocimiento (Nivel 1, 2 y 3).
* Diseño de la arquitectura técnica (Docker + React + Django).


* **Fase 2: Infraestructura y Diseño Base (Semanas 3-4)** 🟢
* **Dockerización**: Configuración de contenedores para Frontend, Backend y Base de Datos.
* **Frontend Setup**: Inicialización de React con Vite.
* **Sistemas de Estilos**: Implementación y configuración de Tailwind CSS v4 y DaisyUI.
* **Control de Versiones**: Establecimiento del flujo de trabajo con ramas en Git (`develop` y `feature`).


* **Fase 3: Diseño de BD y Modelo de Datos (Semanas 3-5)** 🟢
* Diseño del modelo relacional en PostgreSQL.
* Creación del `CustomUser` en Django para gestionar los niveles de suscripción.
* Definición de permisos y roles de usuario.


* **Fase 4: Desarrollo del Backend y API (Semanas 5-7)** 🟢
* Creación de la API REST con Django REST Framework (Serializadores y ViewSets).
* Endpoints para la gestión de alumnos, rutas de cursos jerárquicos y lecciones.
* Implementación de Autenticación de seguridad mediante JSON Web Tokens (JWT).


* **Fase 5: Desarrollo del Frontend e Integración (Semanas 7-9)** 🟡 **[ACTUAL]**
* Maquetación de la interfaz de usuario con los componentes de DaisyUI.
* Consumo de la API desde React.
* Gestión de estados y navegación de la aplicación.


* **Fase 6: Pruebas, Contenido y Documentación (Semanas 10-12)** 🔴
* Pruebas unitarias e integración de sistemas.
* Carga de contenido educativo real (vídeos, ejercicios).
* Preparación de la memoria final y materiales de la exposición.







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
* [x] Creación del Modelo de Usuario Personalizado (Niveles 1, 2 y 3).
* [x] Creación de modelos de Cursos (Categoría, Niveles, Cursos, Lecciones, Ejercicios).
* [x] Implementación de API REST con Django REST Framework.
* [x] Autenticación con JSON Web Tokens (JWT) y pruebas automáticas.
* [ ] Maquetación de la Navbar y Página de Inicio.

---

### 💡 Notas de Desarrollo

* **Extensiones de Archivo**: Para las configuraciones de PostCSS y Tailwind en esta estructura, se recomienda usar `.js` o `.cjs` según la necesidad de compatibilidad con CommonJS detectada durante la Fase 2.
* **Hot Reload**: Los cambios en el CSS y JSX se reflejan al instante.

---

