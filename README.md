# 📝 Genio Academy — Plataforma de Aprendizaje Incremental

Genio Academy es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, lo que permite un aprendizaje personalizado y progresivo.

La plataforma incluye un sistema de **gamificación RPG** (XP, niveles, vidas Roguelike), **minijuegos educativos** de recuperación, un **tutor virtual socrático con IA** (Groq / LLaMA), un **claustro interactivo** de profesores y **videollamadas de tutoría en directo** via Jitsi Meet.

---

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
* La clave de API de Groq para el asistente Astro (`GROQ_API_KEY`).

### 🧪 Cuentas de Prueba

Para poder probar la plataforma sin registrarse, existen las siguientes cuentas predefinidas:

| Tipo | Usuario | Contraseña | Acceso |
|---|---|---|---|
| Alumno (Plan 1) | `al1` | `alumno123` | Catálogo básico |
| Alumno (Plan 2) | `al2` | `alumno123` | Catálogo + Astro IA |
| Alumno (Plan 3) | `al3` | `alumno123` | Todo + Tutorías |
| Profesor | `profe_mate` | `Genio2026!` | Panel docente |
| Superusuario | `admin` | (ver `.env`) | Admin de Django |

---

## 📑 Master Plan de Ingeniería: Genio Academy

El ciclo de vida de este proyecto se estructura en 7 grandes hitos, desde la infraestructura base hasta la calidad y el cierre técnico.

### 🏗️ HITO I: Fundamentos e Infraestructura DevOps
El objetivo de esta etapa es crear un entorno de trabajo sólido, replicable y escalable.

* **Fase 1: Conceptualización y Arquitectura Lógica** ✅
  * Definición estricta de los 3 niveles de conocimiento (Nivel 1, 2 y 3) para la ESO.
  * Diseño de diagramas de flujo (User Journey) desde el registro hasta el uso de la IA.

* **Fase 2: Infraestructura y Orquestación** ✅
  * Configuración del archivo `docker-compose.yml` para microservicios.
  * Aislamiento de entornos: Frontend (Node), Backend (Python) y Base de Datos (PostgreSQL).
  * Creación de volúmenes persistentes para evitar pérdida de datos.

* **Fase 3: Sistema de Diseño y UI Core** ✅
  * Inicialización del entorno cliente con React + Vite.
  * Implementación del motor de estilos moderno Tailwind CSS v4.
  * Integración de la librería de componentes DaisyUI para estandarizar la interfaz.

### 🧠 HITO II: El Cerebro de Datos y Backend
Desarrollo de la lógica de negocio, seguridad y persistencia de la información.

* **Fase 4: Modelado de la Base de Datos Relacional** ✅
  * Desarrollo del modelo `CustomUser` en Django integrando el campo `knowledge_level`.
  * Creación de los modelos de aprendizaje: `Category` → `KnowledgeLevel` → `Course` → `Lesson` → `Exercise`.
  * Ejecución de migraciones iniciales en PostgreSQL.

* **Fase 5: Sistema de Autenticación y Seguridad** ✅
  * Implementación de JWT (JSON Web Tokens) para sesiones seguras sin estado via `SimpleJWT`.
  * Creación de los endpoints de registro y login de alumnos.
  * Configuración de políticas de CORS para proteger las peticiones entre puertos.

* **Fase 6: Desarrollo de la API REST Core** ✅
  * Configuración de Django REST Framework (DRF) y serializadores.
  * Creación del CRUD para el contenido educativo.

* **Fase 7: Motor de Lógica Incremental** ✅
  * Algoritmo de progresión: XP acumulado → subida de nivel automática.
  * Filtros de seguridad 403 para bloquear contenido superior al nivel del usuario.

### 💻 HITO III: Interfaz y Experiencia del Alumno (Frontend)
Conexión visual de los datos para que el estudiante interactúe con la plataforma.

* **Fase 8: Enrutamiento y Protección del Cliente** ✅
  * Implementación de `Axios` con interceptores HTTP para inyección automática de JWT.
  * Configuración de React Router para navegación SPA.
  * Rutas Privadas (`PrivateRoute`) que redirigen al login si no hay token válido.

* **Fase 9: Panel de Control del Estudiante (Dashboard)** ✅
  * Tarjeta de perfil con avatar de búho personalizable, barra de XP y nivel RPG.
  * Misión sugerida automática (primer curso desbloqueado y sin completar).
  * Vitrina de medallas y acceso al Claustro (restringido por plan).

* **Fase 10: Consumo de Datos y Estado Global** ✅
  * Contexto global `AuthContext.jsx`: provee sesión, login, logout, XP y avatar a toda la app.
  * Desarrollo de `CoursePlayer.jsx`: reproductor de cursos con teoría, simulador de preguntas y sidebar de lecciones.

### 🤖 HITO IV: Inteligencia Artificial (Tutor Virtual Socrático)
Un asistente llamado "Astro" integrado en el aula que guía a los alumnos usando el método socrático.

* **Fase 11: Despliegue de Infraestructura IA en la Nube (Groq)** ✅
  * Integración con **Groq Cloud** para modelos ultra-rápidos (LPU).
  * Uso del modelo `llama-3.1-8b-instant` para procesar lenguaje natural.
  * *(Se descartó Ollama local por rendimiento y velocidad de respuesta.)*

* **Fase 12: Construcción del "Puente IA" (Backend Bridge)** ✅
  * App Django `ai/views.py` como intermediario que protege la clave de Groq.
  * Prompt Engineering contextual: la IA sabe qué asignatura y lección está viendo el alumno.
  * Bloqueo 403 si el alumno no tiene Plan 2 o superior.

* **Fase 13: Interfaz del Asistente Virtual (Chatbot UI)** ✅
  * Panel `AIChatPanel.jsx` estilo Glassmorphism incrustado en el reproductor de cursos.
  * Animación de "Pensando...", autoscroll y contexto visual con avatar del alumno.

### ✨ HITO V: Sistema de Rescate y Gamificación
Mecánica Roguelike y motores de minijuegos para fomentar la retención del alumno.

* **Fase 14: Lógica de Vidas y Mecánica Roguelike** ✅
  * 3 planetas (vidas) por alumno en el backend.
  * Regeneración pasiva de 1 planeta cada 2 horas (`last_life_lost_at`).
  * `LivesPanel.jsx` muestra la salud del alumno e integra los minijuegos.

* **Fase 15: Sistema de Rescate y Minijuegos Educativos** ✅
  * 5 motores de juego en React: Parejas, Cálculo, Sopa de Letras, Completar y Verdadero/Falso.
  * Cooldown de 24h por minijuego y ganancia inmediata de 1 planeta tras victoria.
  * Anti-farmeo: bloqueo si el alumno ya tiene 3 vidas.

### 🎓 HITO VI: Claustro Interactivo (Catálogo de Profesores)
Conexión humana y especializada para estudiantes de Plan 3.

* **Fase 16: Motor Relacional Multidimensional (M2M)** ✅
  * Catálogo de profesores organizados por materias (`subjects` M2M).
  * Página pública del Claustro con cards animadas y filtro por especialidad.

* **Fase 17: Suite de Comunicación (Exclusivo Plan 3)** ✅
  * Panel docente en `/teacher-dashboard` protegido por JWT con rol `is_teacher`.
  * Modal "Solicitar Tutoría" en el reproductor de cursos (solo si `subscription_level >= 3`).
  * Videollamadas con **Jitsi Meet** embebido: el profesor inicia la sala, el alumno recibe una notificación flotante en tiempo real (polling 30s) y se une con un clic.
  * Ficha de alumno para el profesor con estadísticas RPG.

### 🔧 HITO VII: Calidad, Contenido y Cierre Técnico
Afinación del proyecto para su entrega, exposición y uso real.

* **Fase 18: Inserción de Contenidos y Contenido Formateado** ✅
  * Más de 25 microcursos sembrados en todas las materias de la ESO via `seed_data.py`.
  * Sistema de lecciones con HTML enriquecido (colores, resaltados) y ejercicios interactivos via `seed_content.py`.
  * Soporte de renderizado HTML dinámico en `CoursePlayer.jsx` (`dangerouslySetInnerHTML`).

* **Fase 19: Correcciones Generales y Documentación Interna** ✅
  * Revisión y "españolización" de variables y funciones propias en todo el código.
  * Adición de comentarios exhaustivos en cada archivo para facilitar el mantenimiento.
  * Múltiples commits atómicos en la rama `release/correccionesGenerales`.

---

## 🎨 Identidad Visual y UI: El Universo Astro

La plataforma utiliza una estética **Dark Glassmorphism** que evoca una cabina espacial.

*   **Astro (El Búho Genio):** El guía oficial de la academia. Aparece en el chat socrático y en los minijuegos.
*   **Tailwind CSS v4 & DaisyUI**: Motor de estilos de última generación para componentes reactivos y modernos.
*   **Framer Motion**: Animaciones fluidas en modales, paneles y transiciones.

---

## 🌿 Estrategia de Ramas (Git Flow)

### Ramas principales
| Rama | Propósito |
|---|---|
| `main` | Código estable y validado, listo para producción |
| `develop` | Rama de integración. Aquí convergen todas las features completadas |

### Ramas de Release (integraciones y revisiones cruzadas)
| Rama | Propósito |
|---|---|
| `release/backend` | Primera versión estable del backend Django + DRF |
| `release/hito-3` | Cierre del Hito III: frontend completo y conectado al backend |
| `release/revision2` | Segunda ronda de revisión general antes de los hitos de gamificación |
| `release/correccionesGenerales` | Limpieza de código, españolización de variables y comentarios exhaustivos (rama actual) |

### Ramas de Feature (desarrollo de funcionalidades)
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/bd` | Modelado inicial de la base de datos (CustomUser, Cursos, Niveles) |
| `feature/backendV1` | Primera versión del backend: API REST, serializadores y migraciones |
| `feature/motorLogica` | Motor de lógica incremental: progresión de XP, subida de nivel y bloqueo 403 |
| `feature/autenticacionFrontend` | Sistema de login/registro en React conectado al JWT del backend |
| `feature/frontend` | Base del frontend: estructura de páginas y enrutamiento SPA |
| `feature/frontendV1` | Primera versión estable del frontend con todas las páginas base |
| `feature/home-v2` | Rediseño de la página de inicio con estética espacial mejorada |
| `feature/panelEstudiante` | Dashboard del alumno: avatar, XP, misión sugerida y medallas |
| `feature/reproductorCursos` | Componente `CoursePlayer.jsx`: teoría, simulador de preguntas y sidebar |
| `feature/Catalogo` | Página de catálogo de cursos con filtros por materia y nivel |
| `feature/mision` | Página "La Misión": propósito de la academia y planes de suscripción |
| `feature/IA` | Integración de Astro: tutor socrático con Groq + LLaMA + `AIChatPanel.jsx` |
| `feature/vidas` | Sistema Roguelike: 3 planetas, regeneración pasiva y 5 minijuegos de recuperación |
| `feature/claustro` | Página del Claustro: catálogo público de profesores con cards animadas |
| `feature/interfaz-profesor` | Panel docente (`/teacher-dashboard`): bandeja de consultas y tabla de alumnos |
| `feature/tutorias` | Sistema de tutorías: modal de solicitud, videollamadas Jitsi y notificaciones en tiempo real |
| `feature/microcursos` | Expansión del catálogo: +25 cursos en todas las materias de la ESO via `seed_data.py` |
| `feature/contenido-formateado` | Lecciones con HTML enriquecido y ejercicios via `seed_content.py` |
| `feature/docs` | Documentación técnica y actualizaciones del README |

---

## 🛠️ Guía de Comandos (Cheat Sheet)

### 🔹 Gestión del Entorno (Docker)
*   **Levantar / Reconstruir:** `docker-compose up --build`
*   **Levantar normalmente:** `docker-compose up`
*   **Detener servicios:** `docker-compose down`
*   **Limpieza total (borra contenedores y BD):** `docker-compose down -v`

### 🔹 Comandos de Backend (Django)
*   **Ejecutar Migraciones:** `docker-compose exec backend python manage.py migrate`
*   **Poblar BD con cursos:** `docker-compose exec backend python seed_data.py`
*   **Poblar BD con lecciones y ejercicios:** `docker-compose exec backend python seed_content.py`
*   **Crear Superusuario:** `docker-compose exec backend python manage.py createsuperuser`
*   **Crear App:** `docker-compose exec backend python manage.py startapp nombre_de_la_app`
*   **Consola de Django:** `docker-compose exec backend python manage.py shell`

### 🔹 Comandos de Frontend (React)
*   **Instalar librerías (contenedor en marcha):** `docker-compose exec frontend npm install nombre-libreria`
*   **Instalar librerías (contenedor parado):** `docker-compose run --rm frontend npm install nombre-libreria`

---

## 🔌 Endpoints Principales de la API REST

### Sesión y Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/token/` | Login: devuelve `access` y `refresh` tokens |
| `POST` | `/api/token/refresh/` | Renueva el token de acceso caducado |
| `POST` | `/api/users/register/` | Registro de nuevo alumno |

### Catálogo Educativo
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/courses/categories/` | Árbol completo: asignaturas → niveles → cursos |
| `GET` | `/api/courses/courses/{id}/` | Detalle de curso con lecciones y ejercicios |
| `POST` | `/api/courses/courses/{id}/complete/` | Completar curso (suma XP, sube nivel si toca) |

### Gestión de Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users/management/` | Perfil del alumno actual |
| `POST` | `/api/users/management/update_avatar/` | Cambiar avatar de búho (devuelve JWT nuevo) |
| `GET` | `/api/users/lives/` | Estado de vidas y cooldowns de minijuegos |
| `POST` | `/api/users/lives/lose/` | Restar 1 vida al alumno |
| `POST` | `/api/users/lives/recover/{minijuego}/` | Ganar 1 vida tras superar un minijuego |

### Sistema de Tutorías y Profesores
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/teachers/professors/` | Lista de profesores (con `?course_id=X` para filtrar) |
| `GET/POST` | `/api/teachers/consultations/` | Ver/Crear consultas de tutoría |
| `GET` | `/api/teachers/consultations/active_calls/` | Comprueba si hay llamada activa (polling alumno) |
| `GET` | `/api/teachers/consultations/my_students/` | Alumnos del profesor (solo docentes) |
| `POST` | `/api/teachers/consultations/{id}/start_call/` | Iniciar videollamada Jitsi (solo docentes) |
| `POST` | `/api/teachers/consultations/{id}/end_call/` | Finalizar videollamada (solo docentes) |

### Tutor IA (Astro)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/ai/chat/` | Enviar mensaje a Astro (requiere Plan 2+) |

---

## 🏛️ Detalles Técnicos

### Arquitectura del Frontend
1. **Tailwind v4**: La configuración se centraliza en `src/index.css` mediante `@import "tailwindcss";` y `@plugin "daisyui";`.
2. **PostCSS**: Se utiliza `@tailwindcss/postcss` para procesar los estilos dentro de Vite.
3. **Estado Global**: `AuthContext.jsx` provee los datos del alumno (extraídos del JWT) y las funciones de sesión a toda la app.

### Arquitectura del Backend (Estructura de Datos)
El núcleo educativo sigue esta jerarquía:
```
Categoría (asignatura)
  └── NivelConocimiento (Nivel 1, 2, 3)
        └── Curso
              ├── Lección (con contenido HTML enriquecido)
              │     └── Ejercicio (pregunta + opciones + respuesta correcta)
              └── CourseCompletion (registro por alumno)
```

### Autenticación JWT
* El token `access` tiene una vida corta (5 minutos). El interceptor de Axios lo renueva automáticamente usando el `refresh` token sin interrumpir al usuario.
* El payload del JWT incluye campos personalizados: `user_id`, `username`, `current_student_level`, `experience_points`, `subscription_level`, `selected_avatar`, `is_teacher`, `lives_count`.

### Seguridad del Contenido HTML
* En `CoursePlayer.jsx` se usa `dangerouslySetInnerHTML` para renderizar la teoría con formato (colores, negrita, etc.).
* Este enfoque es seguro porque el contenido HTML lo inyecta **exclusivamente el administrador** a través de los scripts `seed_content.py`, nunca el alumno.

---

## 💡 Notas de Desarrollo

* **Hot Reload**: Los cambios en CSS y JSX se reflejan al instante gracias a Vite.
* **Extensiones de Archivo**: Para las configuraciones de PostCSS y Tailwind, se usa `.js` o `.cjs` según la compatibilidad con CommonJS detectada en Docker.
* **Españolización del Código**: Las variables y funciones propias del proyecto están escritas en español. Las palabras reservadas de React, Django y los frameworks (useState, className, serializer, etc.) se mantienen en inglés porque son parte del lenguaje/framework.
