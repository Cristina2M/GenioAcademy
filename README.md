# 📝 Genio Academy - Plataforma de Aprendizaje Incremental

Este proyecto es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, Genio Academy organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, permitiendo un aprendizaje personalizado.

#### ✨ HITO V: Despliegue y Pruebas Reales (Expansión Final)
Ajustes finos, auditorías y puesta en órbita.
* Testing E2E (Simular que un alumno se registra, compra/abre un curso, ve las lecciones y chatea con IA).
* Despliegue en un VPS modesto o usando servicios en nube accesibles.
* Documentación pulida para que el día de mañana otros desarrolladores puedan hacer crecer Genio Academy.
* **Sistema de Vidas (Planetas):** Implementar mecánica Roguelike global. Los fallos en el simulador descuentan planetas/vidas.
* **Minijuegos de Recuperación:** Crear motores en JavaScript (Módulos independientes) para auto-generar Sudokus y Sopas de Letras con palabras clave del temario (ej: "Pitágoras") para que los alumnos ganen nuevas vidas al estar a punto de morir en combate.

## 🚀 Entorno y Puesta en Marcha

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


### 📑 Master Plan de Ingeniería: Genio Academy

El ciclo de vida de este proyecto se estructura en 5 grandes hitos, abarcando desde la infraestructura base hasta la integración de Inteligencia Artificial en local.

#### 🏗️ HITO I: Fundamentos e Infraestructura DevOps
El objetivo de esta etapa es crear un entorno de trabajo sólido, replicable y escalable.

* **Fase 1: Conceptualización y Arquitectura Lógica** (✅ Completado)
  * Definición estricta de los 3 niveles de conocimiento (Nivel 1, 2 y 3) para la ESO.
  * Diseño de diagramas de flujo (User Journey) desde el registro hasta el uso de la IA.

* **Fase 2: Infraestructura y Orquestación** (✅ Completado)
  * Configuración del archivo `docker-compose.yml` para microservicios.
  * Aislamiento de entornos: Frontend (Node), Backend (Python) y Base de Datos (PostgreSQL).
  * Creación de volúmenes persistentes para evitar pérdida de datos.

* **Fase 3: Sistema de Diseño y UI Core** (✅ Completado)
  * Inicialización del entorno cliente con React + Vite.
  * Implementación del motor de estilos moderno Tailwind CSS v4.
  * Integración de la librería de componentes DaisyUI para estandarizar la interfaz.

#### 🧠 HITO II: El Cerebro de Datos y Backend
Desarrollo de la lógica de negocio, seguridad y persistencia de la información.

* **Fase 4: Modelado de la Base de Datos Relacional** (✅ Completado)
  * Desarrollo del modelo `CustomUser` en Django integrando el campo `knowledge_level`.
  * Creación de los modelos de aprendizaje: Curso, Tema, Lección y Recurso.
  * Ejecución de migraciones iniciales en PostgreSQL.

* **Fase 5: Sistema de Autenticación y Seguridad** (✅ Completado)
  * Implementación de JWT (JSON Web Tokens) para sesiones seguras sin estado. *(Completado en Backend)*
  * Creación de los endpoints de registro y login de alumnos. *(Login y Registro completados)*
  * Configuración de políticas de CORS para proteger las peticiones entre puertos. *(Completado)*

* **Fase 6: Desarrollo de la API REST Core** (✅ Completado)
  * Configuración de Django REST Framework (DRF) y serializadores.
  * Creación del CRUD (Crear, Leer, Actualizar, Borrar) para el contenido educativo.

* **Fase 7: Motor de Lógica Incremental** (✅ Completado)
  * Programación del algoritmo que valida si un alumno cumple los requisitos para subir de nivel. *(Gamificación RPG aplicada)*
  * Filtros de seguridad en el backend para bloquear contenido superior al nivel del usuario. *(Excepción 403 Forbidden programada)*

#### 💻 HITO III: Interfaz y Experiencia del Alumno (Frontend)
Conexión visual de los datos para que el estudiante interactúe con la plataforma.

* **Fase 8: Enrutamiento y Protección del Cliente** (✅ Completado)
  * Crear sistema de inicio y cierre de sesión conectado al backend.
  * *Nota Arquitectónica:* Se ha optado por implementar la librería **Axios** en conjunto con **jwt-decode** en lugar del nativo `fetch`. El motivo es que Axios soporta Interceptores HTTP (HTTP Interceptors) que permitirán, de forma invisible para el alumno, inyectar el Token en cada petición de forma automática y renovarlo ("refresh") si se caduca. Esto reduce un volumen titánico de código trampa manual.
  * Configuración de React Router para la navegación SPA (Single Page Application). *(Completado)*
  * Creación de "Rutas Privadas" que redirigen al login si el usuario no tiene token válido. *(Completado)*

* **Fase 9: Panel de Control del Estudiante (Dashboard)** (✅ Completado)
  * Maquetación de la vista principal adaptada al nivel actual del alumno. *(Inicio y Misión completados)*
  * Tarjetas de resumen para mostrar puntos de experiencia (XP) y últimos cursos tomados. *(Estética Glassmorphism implementada con datos simulados)*

* **Fase 10: Consumo de Datos y Estado Global** (✅ Completado)
  * Integración de Axios/Fetch (con interceptores de tokens) para conectar React con Django. *(Completado)*
  * Desarrollo del Componente `CoursePlayer.jsx` como entorno de vídeo estilo Glassmorphism. *(Completado)*
  * Gestión del estado global mediante `AuthContext` actualizando progreso y avatares. *(Completado)*

#### 🤖 HITO IV: Inteligencia Artificial (Tutor Virtual Socrático)
El valor diferencial: un asistente llamado "Astro" integrado en el aula que guía a los alumnos usando el método socrático (respondiendo y guiando sin dar la respuesta final).

* **Fase 11: Despliegue de Infraestructura IA en la Nube (Groq)** (✅ Completado)
  * Registro e integración con **Groq Cloud** para utilizar modelos ultra-rápidos (LPU).
  * Uso del modelo oficial `llama-3.1-8b-instant` para procesar el lenguaje natural.
  * *Nota Arquitectónica:* Se descartó Ollama local a favor de Groq por cuestiones de rendimiento del servidor y extrema velocidad de respuesta en los chats.

* **Fase 12: Construcción del "Puente IA" (Backend Bridge)** (✅ Completado)
  * Creación de una aplicación Django (`ai/views.py`) que actúa de intermediario y protege la clave secreta de Groq.
  * Prompt Engineering Contextual: La IA recibe por detrás qué asignatura y tema está estudiando el alumno para dar ejemplos precisos (ej. Gravedad en Física).
  * Bloqueo de seguridad: El endpoint comprueba que el alumno tenga una suscripción activa (Plan Velocidad Luz o superior) o devuelve un error `403 Forbidden`.

* **Fase 13: Interfaz del Asistente Virtual (Chatbot UI)** (✅ Completado)
  * Construcción del panel interactivo `AIChatPanel.jsx` estilo Glassmorphism incrustado en el reproductor de cursos.
  * Personalización del chat conectándose con el contexto: carga dinámicamente el búho "Astro" y el avatar del piloto que ha seleccionado el alumno.
  * Gestión de estado de carga, animaciones de "Pensando..." y autoscroll.

#### 🚀 HITO V: Calidad, Contenido y Cierre Técnico
Afinación del proyecto para su entrega, exposición y uso real.

* **Fase 14: Inserción de Contenidos y Gamificación** (🔴 Pendiente)
  * Población de la base de datos con material educativo real de la ESO.
  * Implementación de recompensas visuales (alertas de éxito, cambios de rango) al subir de nivel.

* **Fase 15: Quality Assurance (QA) y Despliegue Final** (🔴 Pendiente)
  * Pruebas de integración: intentar vulnerar el sistema accediendo a cursos bloqueados.
  * Pruebas de estrés del contenedor de IA para asegurar que no colapsa el servidor.
  * Generación de documentación de la API (Swagger/Redoc) y preparación de la demo técnica.







## 🎨 Identidad Visual y UI

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

#### 1. Arquitectura Frontend (Configuración Base)
1. **Tailwind v4 Config**: Debido a la arquitectura de Docker, la configuración se ha centralizado en `src/index.css` mediante `@import "tailwindcss";` y `@plugin "daisyui";`.
2. **PostCSS**: Se utiliza `@tailwindcss/postcss` para procesar los estilos correctamente dentro de Vite.

#### 2. Lógica de Backend y Base de Datos
1. **Estructura de Datos (Aprendizaje Incremental)**: El núcleo educativo de la plataforma se modela como:
   * `Categoría` ➔ `Nivel de Conocimiento` ➔ `Curso` ➔ `Lección` ➔ `Ejercicio`
   * Los `Usuarios` disponen de roles jerárquicos basados en su tipo de suscripción (`Nivel 1`, `Nivel 2` o `Nivel 3`) para limitar el acceso al contenido premium.
2. **Autenticación Segura (JWT)**: Todo el control de sesiones se ha delegado a JSON Web Tokens mediante la biblioteca *SimpleJWT*.
3. **CORS habilitado**: El servidor Django permite peticiones procedentes del frontend React (`localhost:5173`).

#### 3. Integración SPA y UI Avanzada
1. **Enrutamiento Completo (SPA)**: Configuración en matriz usando `react-router-dom` para transiciones fluidas de página completas eliminando tiempos de carga (incluyendo gestión 404 y auto-scroll a cabecera).
2. **Consumo de API Reactivo**: Conexión al endpoint de Django de `categories/` gestionada mediante asincronía (`fetch`/`await`) encapsulada en Hooks (`useEffect`, `useState`) para control de estados de carga y error.
3. **Estética Avanzada (Glassmorphism)**: Creación de la identidad visual propia mediante utilidades avanzadas de Tailwind (opacidades, `backdrop-blur`, brillos internos y animaciones espaciales) aplicadas sobre las Vistas de "Inicio", "La Misión" y "Catálogo".

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

---

### 💡 Notas de Desarrollo

* **Extensiones de Archivo**: Para las configuraciones de PostCSS y Tailwind en esta estructura, se recomienda usar `.js` o `.cjs` según la necesidad de compatibilidad con CommonJS detectada durante la Fase 2.
* **Hot Reload**: Los cambios en el CSS y JSX se reflejan al instante.

---

