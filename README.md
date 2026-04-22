# 🚀 Genio Academy — Plataforma de Aprendizaje Incremental

Genio Academy es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, lo que permite un aprendizaje personalizado y progresivo.

La plataforma incluye un sistema de **gamificación RPG** (XP, niveles, vidas Roguelike), **minijuegos educativos** de recuperación, un **tutor virtual socrático con IA** (Groq / LLaMA), un **claustro interactivo** de profesores y **videollamadas de tutoría en directo** via Jitsi Meet.

> ⚠️ **Nota importante para desarrolladores:** El proyecto usa Docker con una base de datos PostgreSQL independiente. Los scripts de Django (`manage.py migrate`, etc.) deben ejecutarse **dentro del contenedor activo** mediante `docker exec genioacademy-backend-1 python manage.py <comando>` y NO con `docker-compose exec` si el archivo `.env` no está presente en el host.

---

## 🚀 Entorno y Puesta en Marcha

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción.

### 🏗️ Arquitectura del Sistema

El sistema se compone de tres contenedores principales:

1. **Frontend**: React + Vite (SPA). *Puerto: `5173` (localhost:5173)*
2. **Backend**: Django + Django REST Framework. *Puerto: `8000` (localhost:8000)*
3. **Database**: PostgreSQL. *Puerto interno: `5432`*

---

## 🌍 Producción y Despliegue

La plataforma se encuentra desplegada y operativa en los siguientes dominios oficiales:

*   **Frontend (Vercel):** [https://cristina2daw.es](https://cristina2daw.es)
*   **Backend (Render):** [https://api.cristina2daw.es](https://api.cristina2daw.es)

### ⚙️ Configuración Zero-Config de API
El frontend implementa una lógica de auto-detección de entorno. No es necesario configurar variables `VITE_API_URL` manualmente para producción; la aplicación detecta si está en el dominio oficial y apunta automáticamente al backend de Render.

### 🔐 Gestión de Credenciales y Entorno (.env)

Por normativas de seguridad, los secretos del marco de trabajo no se vuelcan al repositorio público.
Debe preexistir o ser inyectado por Docker un contexto de variables (`.env` o compose environment) que defina:
* La firma secreta criptográfica de Django (`SECRET_KEY`).
* Las credenciales de levantamiento y conexión inter-contenedor de PostgreSQL (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).
* La clave de API de Groq para el asistente Astro (`GROQ_API_KEY`).

### 🧪 Cuentas de Prueba

Para poder probar la plataforma sin registrarse, existen las siguientes cuentas predefinidas. **Nota:** El sistema permite el acceso tanto con el nombre de usuario como con el correo electrónico asociado (Dual Login).

| Tipo | Usuario | Contraseña | Acceso |
|---|---|---|---|
| Alumno (Plan 1) | `al1` | `alumno123` | Catálogo básico |
| Alumno (Plan 2) | `al2` | `alumno123` | Catálogo + Astro IA |
| Alumno (Plan 3) | `al3` | `alumno123` | Todo + Tutorías |
| Profesor (Matemáticas) | `aris.thorne` | `Genio2026!` | Panel docente |
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
  * Regeneración pasiva: recuperación de 1 planeta cada cierto tiempo (`last_life_lost_at`).
  * `LivesPanel.jsx` muestra la salud del alumno e integra los minijuegos.
  * **Al fallar una pregunta del simulador** se llama automáticamente a `POST /api/users/lives/decrease/` restando 1 planeta en tiempo real.
  * **Bloqueo preventivo:** si el alumno llega a 0 planetas, `LessonQuiz.jsx` verifica el estado antes de permitir iniciar la prueba y muestra un aviso de sistemas bloqueados.

* **Fase 15: Sistema de Rescate y Minijuegos Educativos** ✅
  * 5 motores de juego en React: Parejas, Cálculo, Sopa de Letras, Completar y Verdadero/Falso.
  * Solo accesibles para alumnos Plan 3 con 0 vidas (Game Over).
  * Cooldown por minijuego: una vez jugado, no puede volver a usarse hasta que pase el tiempo de espera.
  * Ganancia inmediata de 1 planeta al superar el reto.

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

* **Fase 18: Inserción de Contenidos** ✅
  * Cursos sembrados mediante seed_data.py y populate_one.py.
  * Soporte de renderizado HTML en CoursePlayer.jsx (dangerouslySetInnerHTML) para contenido enriquecido.

* **Fase 19: Correcciones Generales y Documentación Interna** ✅
  * Revisión y españolización de variables y funciones propias en todo el código.
  * Adición de comentarios exhaustivos en cada archivo para facilitar el mantenimiento.
  * Múltiples commits atómicos en la rama `release/correccionesGenerales`.

* **Fase 20: Estabilización y Mecánica de Penalización** ✅
  * **Catálogo resiliente:** CategoryViewSet configurado como público (AllowAny). Fallback sin token en Courses.jsx garantiza carga siempre.
  * **Refresco de sesión seguro:** SafeTokenRefreshView evita errores 500 con usuarios eliminados de BD.
  * **Penalización en simuladores:** LessonQuiz.jsx llama a POST /api/users/lives/decrease/ al fallar una respuesta.
  * **Bloqueo por vidas:** Con 0 planetas, el simulador bloquea el inicio de nuevas pruebas.
  * **Dashboard mejorado:** Nuevos endpoints my_active_courses y my_full_journey para historial del alumno.
  * **Bug crítico resuelto:** Migración courses.0004_usercourseprogress estaba pendiente en PostgreSQL Docker.

* **Fase 21: Despliegue Final y Auditoría de Contenidos** ✅
  * Configuración de dominios personalizados con SSL en Vercel y Render.
  * Implementación de **Zero-Config API** en el frontend para resiliencia entre entornos.
  * Siembra masiva de profesores y especialidades en producción (`seed_production`).
  * Optimización de Astro IA: sincronización horaria y personalidad socrática mejorada.

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
| `release/correccionesGenerales` | Limpieza de código, españolización de variables y comentarios exhaustivos |

### Ramas de Feature (desarrollo de funcionalidades)
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/motorLogica` | Motor de lógica incremental: progresión de XP, subida de nivel y bloqueo 403 |
| `feature/autenticacionFrontend` | Sistema de login/registro en React conectado al JWT del backend |
| `feature/IA` | Integración de Astro: tutor socrático con Groq + LLaMA + `AIChatPanel.jsx` |
| `feature/vidas` | Sistema Roguelike: 3 planetas, regeneración pasiva y 5 minijuegos de recuperación |
| `feature/tutorias` | Sistema de tutorías: modal de solicitud, videollamadas Jitsi y notificaciones en tiempo real |
| `feature/docs2` | Actualización de documentación de producción y estabilización final (rama actual) |

---

## 🛠️ Guía de Comandos (Cheat Sheet)

### 🔹 Gestión del Entorno (Docker)
*   **Levantar / Reconstruir:** `docker compose up --build`
*   **Levantar normalmente:** `docker compose up`
*   **Detener servicios:** `docker compose down`
*   **Reiniciar solo el backend:** `docker compose restart backend`
*   **Ver logs en tiempo real:** `docker compose logs -f backend`

### 🔹 Comandos de Backend (Django)

> ⚠️ Si el archivo `backend/.env` no existe en el host, usa `docker exec` directamente con el nombre del contenedor en lugar de `docker compose exec`.

*   **Ejecutar Migraciones:** `docker exec genioacademy-backend-1 python manage.py migrate`
*   **Poblar BD (Local):** `docker exec genioacademy-backend-1 python manage.py shell < seed_data.py`
*   **Poblar BD (Producción):** `docker exec genioacademy-backend-1 python manage.py seed_production`
*   **Crear Superusuario:** `docker exec genioacademy-backend-1 python manage.py createsuperuser`

---

## 🔌 Endpoints Principales de la API REST

### Sesión y Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/token/` | Login Dual (Email/User): devuelve tokens JWT |
| `POST` | `/api/users/register/` | Registro de nuevo alumno |

### Catálogo Educativo
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/courses/categories/` | 🌐 Público | Árbol completo de asignaturas y niveles |
| `GET` | `/api/courses/courses/{id}/` | 🔒 Autenticado | Detalle de curso con lecciones y ejercicios |

### Sistema de Tutorías y Profesores
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/teachers/professors/` | Lista de profesores (filtro por materia) |
| `POST` | `/api/teachers/consultations/` | Crear consulta de tutoría |
| `POST` | `/api/teachers/consultations/{id}/start_call/` | Iniciar videollamada Jitsi (solo docentes) |

---

## 🏛️ Detalles Técnicos

### Arquitectura del Frontend
1. **Zero-Config API**: El archivo `src/api/axios.js` detecta automáticamente el hostname para apuntar a `localhost` o a `api.cristina2daw.es`.
2. **Tailwind v4**: Estilos centralizados en `src/index.css` con variables modernas.
3. **Estado Global**: `AuthContext.jsx` gestiona la sesión mediante persistencia de JWT en `localStorage`.

### Autenticación JWT
* El payload incluye campos personalizados como `subscription_level` y `is_teacher` para el renderizado condicional de la UI.
* **SafeTokenRefreshView**: Evita errores 500 durante la renovación de tokens en usuarios inexistentes.
* **Sistema de Login Dual**: El backend implementa un `EmailOrUsernameBackend` que permite a los usuarios autenticarse indistintamente con su `username` o su `email`, mejorando la accesibilidad y la experiencia de usuario.

### Seguridad del Contenido HTML
* En `CoursePlayer.jsx` se usa `dangerouslySetInnerHTML`. Este enfoque es seguro ya que el contenido es inyectado exclusivamente por los administradores del sistema via scripts de confianza.

### Inteligencia Artificial (Astro)
* **Sincronización Horaria**: El backend inyecta dinámicamente la hora local del alumno (ajustada a CEST/CET) en el prompt del sistema. Esto permite que Astro adapte sus saludos y comentarios según sea mañana, tarde o noche, eliminando inconsistencias temporales.
* **Modelo**: Se utiliza `llama-3.1-8b-instant` vía Groq para obtener respuestas con latencia inferior a 1 segundo.

---

## 💡 Notas de Desarrollo

* **Hot Reload**: Los cambios en CSS y JSX se reflejan al instante gracias a Vite.
* **Españolización del Código**: Se mantiene una estricta coherencia en el lenguaje de las variables de negocio (español) y las palabras reservadas del framework (inglés).
