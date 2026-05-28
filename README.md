# 🚀 Genio Academy — Plataforma de Aprendizaje Incremental

[![CI/CD Pipeline](https://github.com/Cristina2M/GenioAcademy/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Cristina2M/GenioAcademy/actions/workflows/ci-cd.yml)
Genio Academy es una plataforma de academia online diseñada específicamente para estudiantes de la ESO. A diferencia de las plataformas tradicionales, organiza el contenido por **niveles de conocimiento específicos** y no por cursos académicos, lo que permite un aprendizaje personalizado y progresivo.

La plataforma incluye un sistema de **gamificación RPG** (XP, niveles, vidas Roguelike), **minijuegos educativos** de recuperación, un **tutor virtual socrático con IA** (Groq / LLaMA), un **claustro interactivo** de profesores y **videollamadas de tutoría en directo** via Jitsi Meet.

> 📺 **Presentación oficial (Tribunal):** [Ver Diapositivas en Canva](https://canva.link/76zised6tl9vdk2)

> ⚠️ **Nota importante para desarrolladores:** El proyecto usa Docker con una base de datos PostgreSQL independiente. Los scripts de Django (`manage.py migrate`, etc.) deben ejecutarse **dentro del contenedor activo** mediante `docker exec genioacademy-backend-1 python manage.py <comando>` y NO con `docker-compose exec` si el archivo `.env` no está presente en el host.

---

## 🚀 Entorno y Puesta en Marcha

Se ha implementado una arquitectura de **microservicios dockerizados** para garantizar que el entorno de desarrollo sea idéntico al de producción.

### 🏗️ Arquitectura del Sistema (Cloud Native)

El sistema utiliza una arquitectura de **microservicios dockerizados** orquestados con **Kubernetes**, asegurando escalabilidad y paridad total entre desarrollo y producción:

1. **Infraestructura Cloud (AWS)**: Servidor EC2 ejecutando **K3s** (distribución ligera y certificada de Kubernetes).
2. **Frontend (Contenedor)**: NGINX sirviendo la SPA construida con React + Vite. *Dominio: `cristina2daw.es`*
3. **Backend (Contenedor)**: Gunicorn ejecutando Django + Django REST Framework. *Dominio: `api.cristina2daw.es`*
4. **Base de Datos**: PostgreSQL para la persistencia transaccional y relacional.
5. **Enrutamiento y Seguridad**: Traefik (Ingress Controller) junto con `cert-manager` para la emisión y renovación automática de certificados SSL/TLS gratuitos vía Let's Encrypt.
6. **DNS y Dominio (IONOS)**: Gestión de DNS apuntando a la IP elástica de AWS.

---

## 🌍 Producción, CI/CD y Despliegue Automático

El código fuente cuenta con una canalización completa de Integración y Despliegue Continuo (CI/CD) usando **GitHub Actions**.

*   **Frontend (AWS K8s):** [https://cristina2daw.es](https://cristina2daw.es)
*   **Backend API (AWS K8s):** [https://api.cristina2daw.es](https://api.cristina2daw.es)

### 🔄 Flujo CI/CD Implementado:
1. **Testing**: Al hacer push, se levanta una BD temporal y se ejecutan las pruebas unitarias automáticas de Django.
2. **Build & Push**: Si las pruebas pasan, se construyen las imágenes Docker multiplataforma y se suben a Docker Hub (`cristina2m/genio-backend` y `cristina2m/genio-frontend`).
3. **Deploy to K8s**: El pipeline se conecta vía SSH seguro a la instancia EC2 de AWS, descarga los nuevos manifiestos y ejecuta un `rollout restart` en Kubernetes para actualizar los pods sin tiempo de inactividad (Zero Downtime Deployment).
4. **Docs**: Se genera la documentación del código Python vía `pdoc` y se guarda como artefacto descargable.

### ⚙️ Configuración Zero-Config de API
El frontend implementa una lógica de auto-detección de entorno. No es necesario configurar variables `VITE_API_URL` manualmente para producción; la aplicación detecta si está en el dominio oficial y apunta automáticamente al backend de Render.

### 🔐 Gestión de Credenciales y Entorno (.env)

Por normativas de seguridad, los secretos del proyecto no se vuelcan al repositorio público.
Debe preexistir o ser inyectado por Docker un contexto de variables (`.env` o compose environment) que defina:
* La firma secreta criptográfica de Django (`SECRET_KEY`).
* Las credenciales de conexión a PostgreSQL local (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).
* La URL de conexión a la base de datos en producción (`DATABASE_URL`) — en producción apunta a Supabase.
* La clave de API de Groq para el asistente Astro (`GROQ_API_KEY`).

### 🧪 Cuentas de Prueba

Para poder probar la plataforma sin registrarse, existen las siguientes cuentas predefinidas. **Nota:** El sistema permite el acceso tanto con el nombre de usuario como con el correo electrónico asociado (Dual Login).

| Tipo | Usuario | Contraseña | Acceso |
|---|---|---|---|
| Alumno (Plan 1) | `alumno1` | `alumno123` | Catálogo básico |
| Alumno (Plan 2) | `alumno2` | `alumno123` | Catálogo + Astro IA |
| Alumno (Plan 3) | `alumno3` | `alumno123` | Todo + Tutorías |
| Profesor (Matemáticas) | `aris.thorne` | `Genio2026!` | Panel docente |
| Superusuario | `admin` | `admin123` | Admin de Django |

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
  * Configuración de dominios personalizados con SSL en Vercel y Render (IONOS como DNS).
  * Implementación de **Zero-Config API** en el frontend para resiliencia entre entornos.
  * Siembra masiva de profesores, especialidades y CV en producción (`seed_production`, `seed_professor_cvs.py`).
  * Optimización de Astro IA: sincronización horaria y personalidad socrática mejorada.
  * Corrección crítica del problema **N+1 queries** en el catálogo de cursos: se precalculan los IDs de cursos completados/iniciados en el contexto del serializador para usuarios autenticados, eliminando el error 500 en producción.

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
| `release/contenido` | Expansión de contenido educativo, seed de ejercicios y estabilización final (rama actual) |
| `guionExpo` | Guion de la defensa oral del TFG y guía visual para Canva |

### Ramas de Feature (desarrollo de funcionalidades)

#### 🔧 Backend y Base de Datos
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/bd` | Modelado inicial de la base de datos: `CustomUser`, `Category`, `KnowledgeLevel`, `Course` |
| `feature/backendV1` | Primera versión funcional del backend: Django + DRF + endpoints REST básicos |
| `feature/motorLogica` | Motor de lógica incremental: progresión de XP, subida de nivel y bloqueo 403 |
| `feature/vidas` | Sistema Roguelike: 3 planetas, regeneración pasiva y 5 minijuegos de recuperación |
| `feature/recupContrasena` | Sistema de recuperación de contraseña por email con tokens seguros de Django |
| `feature/notificaciones` | Sistema de notificaciones de tutoría en tiempo real (polling asíncrono) |

#### 💻 Frontend y UI
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/frontendV1` | Estructura inicial del frontend: React + Vite + Tailwind + enrutamiento base |
| `feature/frontend` | Desarrollo de la interfaz principal: Navbar, Home, Login, Register y estilos globales |
| `feature/autenticacionFrontend` | Sistema de login/registro en React conectado al JWT del backend |
| `feature/panelEstudiante` | Panel de control del alumno (Dashboard): XP, nivel, avatar y misión sugerida |
| `feature/reproductorCursos` | Reproductor de cursos `CoursePlayer.jsx` con teoría, quiz y sidebar de lecciones |
| `feature/home-v2` | Rediseño premium de la página de inicio con animaciones y sección de planes |
| `feature/mision` | Página "La Misión": presentación del proyecto educativo y sus objetivos |
| `feature/paginacion` | Carrusel de cursos con paginación por niveles en el catálogo |
| `feature/Catalogo` | Catálogo público de cursos (`Courses.jsx`) con estructura de categorías y niveles |

#### 🤖 Inteligencia Artificial y Contenido
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/IA` | Integración de Astro: tutor socrático con Groq + LLaMA + `AIChatPanel.jsx` |
| `feature/microcursos` | Seed masivo de lecciones y ejercicios cortos para todos los cursos |
| `feature/contenido-formateado` | Expansión y formateo HTML del contenido educativo de las lecciones |

#### 🎓 Claustro de Profesores y Panel Docente
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/claustro` | Página pública del claustro de profesores con cards animadas y filtro por materia |
| `feature/interfaz-profesor` | Panel docente del profesor: gestión de consultas y videollamadas (`TeacherDashboard.jsx`) |
| `feature/ficha-alumno` | Ficha de alumno para el profesor con estadísticas RPG (`StudentCardModal.jsx`) |
| `feature/tutorias` | Sistema de tutorías: modal de solicitud, videollamadas Jitsi y notificaciones en tiempo real |
| `feature/creacionCursosProf` | Editor de cursos para el profesor: CRUD de lecciones y ejercicios (`CourseEditorTab.jsx`) |

#### 🚀 Despliegue y Documentación
| Rama | Funcionalidad desarrollada |
|---|---|
| `feature/despliegue` | Configuración del despliegue en Vercel (frontend) y Render (backend) |
| `feature/docs` | Primera versión de la documentación técnica del proyecto |
| `feature/docs2` | Actualización de documentación de producción y estabilización final |
| `feature/correccionDetalles` | Correcciones de detalle: UX, mensajes de error y ajustes visuales finales |

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
*   **Rellenar CVs de Profesores:** `docker exec genioacademy-backend-1 python seed_professor_cvs.py`
*   **Crear Superusuario:** `docker exec genioacademy-backend-1 python manage.py createsuperuser`

### 🔹 Comandos de Git (Flujo Habitual)

*   **Ver estado de cambios:** `git status`
*   **Hacer commit:** `git add -A && git commit -m "descripción del cambio"`
*   **Subir a origen:** `git push origin <nombre-de-la-rama>`
*   **Merge a main:** `git checkout main && git merge <rama> --no-ff -m "Merge <rama>: descripción"`

---

## 🔌 Endpoints Principales de la API REST

### Sesión y Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/token/` | Login Dual (Email/User): devuelve tokens JWT |
| `POST` | `/api/token/refresh/` | Renovación silenciosa del token de acceso |
| `POST` | `/api/users/register/` | Registro de nuevo alumno |
| `POST` | `/api/users/forgot-password/` | Solicitar email de recuperación de contraseña |
| `POST` | `/api/users/reset-password/` | Confirmar nueva contraseña con token seguro |

### Sistema de Gamificación (Vidas y Minijuegos)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/users/lives/` | 🔒 Autenticado | Estado de planetas, cooldowns y acceso a minijuegos |
| `POST` | `/api/users/lives/decrease/` | 🔒 Autenticado | Restar 1 planeta al fallar una evaluación |
| `POST` | `/api/users/minigames/play/` | 🔒 Plan 3 | Validar victoria en minijuego y recuperar 1 planeta |

### Catálogo Educativo
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/courses/categories/` | 🌐 Público | Árbol completo de asignaturas, niveles y cursos |
| `GET` | `/api/courses/courses/{id}/` | 🔒 Autenticado | Detalle de un curso con sus lecciones y ejercicios |
| `POST` | `/api/courses/courses/{id}/complete/` | 🔒 Autenticado | Marcar un curso como completado y recibir XP |

### Inteligencia Artificial (Astro)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/ai/chat/` | 🔒 Plan 2+ | Enviar mensaje a Astro y recibir respuesta socrática |

### Sistema de Tutorías y Profesores
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/teachers/professors/` | 🌐 Público | Lista de profesores activos (filtro por ?course_id) |
| `POST` | `/api/teachers/consultations/` | 🔒 Plan 3 | Crear consulta de tutoría con un profesor |
| `GET` | `/api/teachers/consultations/` | 🔒 Autenticado | Listar tutorías propias (alumno) o recibidas (profe) |
| `POST` | `/api/teachers/consultations/{id}/start_call/` | 🔒 Profesor | Iniciar videollamada Jitsi y notificar al alumno |
| `GET` | `/api/teachers/consultations/active_calls/` | 🔒 Alumno | Comprobar si hay una videollamada activa para él |
| `GET` | `/api/teachers/consultations/unread_count/` | 🔒 Alumno | Número de respuestas sin leer (badge del Navbar) |

---

## 🏛️ Detalles Técnicos

### Arquitectura del Frontend
1. **Zero-Config API**: El archivo `src/api/axios.js` detecta automáticamente el hostname para apuntar a `localhost` o a `api.cristina2daw.es` sin necesidad de configurar variables de entorno en Vercel.
2. **Tailwind v4 + DaisyUI**: Estilos centralizados en `src/index.css`. DaisyUI aporta componentes base (modal, dropdown, badge) que se combinan con clases de Tailwind personalizadas.
3. **Estado Global**: `AuthContext.jsx` gestiona la sesión completa mediante JWT en `localStorage`. El token incluye datos de gamificación (XP, nivel, avatar) para evitar peticiones extra.
4. **Contexto de Idioma**: `LanguageContext.jsx` gestiona el cambio ES/EN en las páginas públicas (Home, Claustro, Misión).

### Autenticación JWT
* El payload incluye campos personalizados como `subscription_level` y `is_teacher` para el renderizado condicional de la UI.
* **SafeTokenRefreshView**: Evita errores 500 durante la renovación de tokens en usuarios inexistentes.
* **Sistema de Login Dual**: El backend implementa un `EmailOrUsernameBackend` que permite a los usuarios autenticarse indistintamente con su `username` o su `email`.
* **Renovación Silenciosa**: El interceptor de Axios renueva el `access token` automáticamente usando el `refresh token` cuando recibe un 401, sin interrumpir al usuario.

### Gamificación RPG
* **XP y Niveles**: Cada curso completado otorga XP. Al alcanzar `nivel_actual × 500` XP, el alumno sube de nivel automáticamente.
* **Planetas (Vidas Roguelike)**: Máximo 3 planetas. Se pierde 1 al fallar una evaluación. Se regenera 1 automáticamente cada 10 minutos (sin tareas en segundo plano: se calcula la diferencia de tiempo al vuelo).
* **Rachas (Streaks)**: Se incrementa 1 por cada día consecutivo que el alumno inicie sesión. Se reinicia a 1 si se rompe la racha.
* **Minijuegos de Rescate**: Exclusivos de Plan 3. Con 0 planetas, el alumno puede jugar uno de 5 minijuegos para recuperar 1 planeta. Cada minijuego tiene un cooldown individual.

### Seguridad del Contenido HTML
* En `CoursePlayer.jsx` se usa `dangerouslySetInnerHTML`. Este enfoque es seguro ya que el contenido es inyectado exclusivamente por los administradores del sistema via scripts de confianza.

### Inteligencia Artificial (Astro)
* **Sincronización Horaria**: El backend inyecta dinámicamente la hora local del alumno (ajustada a CEST/CET) en el prompt del sistema. Esto permite que Astro adapte sus saludos según sea mañana, tarde o noche.
* **Método Socrático**: Astro nunca da la respuesta directa; guía al alumno con preguntas para que la descubra por sí mismo.
* **Modelo**: Se utiliza `llama-3.1-8b-instant` vía Groq para obtener respuestas con latencia inferior a 1 segundo.
* **Seguridad**: La clave de la API de Groq nunca se expone al frontend. Todas las peticiones pasan por el backend de Django como intermediario.

---

## 💡 Notas de Desarrollo

* **Hot Reload**: Los cambios en CSS y JSX se reflejan al instante gracias a Vite.
* **Españolización del Código**: Se mantiene una estricta coherencia en el lenguaje de las variables de negocio (español) y las palabras reservadas del framework (inglés).
* **Diseño Idempotente de los Seeds**: Todos los scripts de siembra de datos (`seed_production`, `seed_professor_cvs.py`) comprueban antes de insertar para no duplicar registros aunque se ejecuten varias veces.
