# 📝 Genio Academy - Plataforma de Aprendizaje Incremental

Este proyecto es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, Genio Academy organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, permitiendo un aprendizaje personalizado.

## 🚀 Fase 1: Cimentación y Entorno (Docker & Estructura)

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción.

### 🏗️ Arquitectura del Sistema

El sistema se compone de tres contenedores principales:

1. **Frontend**: React + Vite (SPA). *Puerto: `5173` (localhost:5173)*
2. **Backend**: Django + Django REST Framework. *Puerto: `8000` (localhost:8000)*
3. **Database**: PostgreSQL. *Puerto interno: `5432`*

### 🔐 Gestión de Credenciales y Entorno (.env)

Por normativas de seguridad, los secretos del marco de trabajo no se vuelcan al repositorio público.
Debe preexistir o ser inyectado por Docker un contexto de variables (`.env` o compose environment) que defina:
* La firma secreta criptográfica de Django (`SECRET_KEY`).
* Las credenciales de levantamiento y conexión inter-contenedor de PostgreSQL (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).


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


* **Fase 5: Desarrollo del Frontend e Integración (Semanas 7-9)** 🟢
* Maquetación de la interfaz de usuario con los componentes de DaisyUI y temática espacial ("Glassmorphism").
* Consumo de la API desde React (`fetch` a endpoints de Django).
* Gestión de estados locales y navegación global de la aplicación (React Router DOM).
* Creación de Vistas: Inicio (Home), Catálogo Estelar interactivo y "La Misión" (Landing page).


* **Fase 6: Autenticación, Pruebas y Documentación (Semanas 10-12)** 🟡 **[ACTUAL]**
* Implementación de formularios de Inicio de Sesión y Registro en React.
* Conexión con los JWT generados por el backend.
* Carga de contenido educativo final.
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

* **Ejecutar Migraciones:** `docker-compose exec backend python manage.py migrate` *(Prepara las tablas SQL en base a los modelos)*
* **Poblar Base de Datos (Seed):** `docker-compose exec backend python seed_data.py` *(Imprescindible la primera vez para cargar Categorías y Cursos de prueba y evitar arrancar con el Frontend en blanco)*
* **Crear Superusuario:** `docker-compose exec backend python manage.py createsuperuser` *(Para acceso a `http://localhost:8000/admin/`)*
* **Crear App:** `docker-compose exec backend python manage.py startapp nombre_de_la_app`

#### 🔹 Comandos de Frontend (React)

* **Instalar librerías (si el contenedor está corriendo):** `docker-compose exec frontend npm install nombre-libreria`
* **Instalar librerías (si el contenedor está parado):** `docker-compose run --rm frontend npm install nombre-libreria`

---

### 🛠️ Detalles Técnicos y Documentación de Fases Producidas

#### Frontend (Fase 2)
1. **Tailwind v4 Config**: Debido a la arquitectura de Docker, la configuración se ha centralizado en `src/index.css` mediante `@import "tailwindcss";` y `@plugin "daisyui";`.
2. **PostCSS**: Se utiliza `@tailwindcss/postcss` para procesar los estilos correctamente dentro de Vite.

#### Backend y Modelado (Fase 3 y 4)
1. **Estructura de Datos (Aprendizaje Incremental)**: El núcleo educativo de la plataforma se modela como:
   * `Categoría` ➔ `Nivel de Conocimiento` ➔ `Curso` ➔ `Lección` ➔ `Ejercicio`
   * Los `Usuarios` disponen de roles jerárquicos basados en su tipo de suscripción (`Nivel 1`, `Nivel 2` o `Nivel 3`) para limitar el acceso al contenido premium.
2. **Autenticación Segura (JWT)**: Todo el control de sesiones se ha delegado a JSON Web Tokens mediante la biblioteca *SimpleJWT*.
3. **CORS habilitado**: El servidor Django permite peticiones procedentes del frontend React (`localhost:5173`).

#### Endpoints Principales Disponibles (API REST)
* **Gestión de Sesión:**
  * `POST /api/token/` ➔ Para iniciar sesión proporcionando credenciales. Devuelve los tokens `access` y `refresh`.
  * `POST /api/token/refresh/` ➔ Para renovar el token de acceso cuando expira.
* **Catálogo Educativo (Cursos):**
  * `GET /api/courses/categories/` ➔ Devuelve todo el árbol anidado de asignaturas, niveles y cursos.
  * `GET /api/courses/courses/` ➔ Cursos específicos.
  * `GET /api/courses/lessons/` ➔ Lecciones (teoría y vídeo). Solo lectura.
* **Gestión de Usuarios:**
  * `GET, POST /api/users/users/` ➔ Operaciones CRUD completas sobre la tabla de alumnos.

### 📍 Estado Actual

* [x] Configuración de Docker y Docker Compose.
* [x] Inicialización de Proyecto Django y React con Vite.
* [x] Conexión establecida con PostgreSQL.
* [x] Instalación y configuración de Tailwind CSS v4 y DaisyUI.
* [x] Creación del Modelo de Usuario Personalizado (Niveles 1, 2 y 3).
* [x] Creación de modelos de Cursos (Categoría, Niveles, Cursos, Lecciones, Ejercicios).
* [x] Implementación de API REST con Django REST Framework.
* [x] Autenticación con JSON Web Tokens (JWT) en Backend.
* [x] **Fase 5 Completada:** Maquetación e Integración de la Navbar, Inicio, Misión y Catálogo Estelar.
* [ ] **Desarrollo de Autenticación Frontend (Login/Signup).**

---

### 💡 Notas de Desarrollo

* **Extensiones de Archivo**: Para las configuraciones de PostCSS y Tailwind en esta estructura, se recomienda usar `.js` o `.cjs` según la necesidad de compatibilidad con CommonJS detectada durante la Fase 2.
* **Hot Reload**: Los cambios en el CSS y JSX se reflejan al instante.

---

