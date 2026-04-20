# 📚 DOCUMENTACIÓN TÉCNICA Y DE USUARIO
## Genio Academy — Plataforma de Aprendizaje Incremental para la ESO

> **Repositorio GitHub:** https://github.com/Cristina2M/GenioAcademy  
> **Versión del documento:** Hito VII completado  
> **Fecha:** Abril 2026

---

## ÍNDICE

1. [Anteproyecto Actualizado](#1-anteproyecto-actualizado)
2. [Objetivos y Justificación del Proyecto](#2-objetivos-y-justificación-del-proyecto)
3. [Modelo Entidad-Relación](#3-modelo-entidad-relación)
4. [Modelo de Clases y Casos de Uso](#4-modelo-de-clases-y-casos-de-uso)
5. [Tecnologías Empleadas](#5-tecnologías-empleadas)
6. [Estructura de Ficheros del Proyecto](#6-estructura-de-ficheros-del-proyecto)
7. [Manual de Usuario](#7-manual-de-usuario)
8. [Manual del Desarrollador](#8-manual-del-desarrollador)
9. [Plan de Negocio](#9-plan-de-negocio)
10. [Diapositivas para la Exposición (Guión)](#10-diapositivas-para-la-exposición-guión)
11. [Enlace al Código en GitHub](#11-enlace-al-código-en-github)

---

## 1. Anteproyecto Actualizado

### Descripción General

**Genio Academy** es una plataforma de academia online diseñada específicamente para estudiantes de la ESO (Educación Secundaria Obligatoria). A diferencia de las plataformas de e-learning tradicionales (como Udemy o Khan Academy), Genio Academy organiza el contenido por **niveles de conocimiento progresivos** y no por cursos académicos, permitiendo un aprendizaje personalizado donde el alumno avanza a su propio ritmo desbloqueando contenido conforme su nivel real lo permite.

La plataforma combina tres pilares innovadores:
- 🎮 **Gamificación tipo RPG:** El alumno sube de nivel, acumula XP y elige avatares de búho personalizados según su progreso.
- 🤖 **Tutor IA (Astro):** Un asistente socrático basado en inteligencia artificial que guía sin dar las respuestas directas, usando la API de Groq con el modelo `llama-3.1-8b-instant`.
- 🪐 **Mecánica Roguelike de Vidas:** Los alumnos disponen de 3 "planetas" (vidas) que se pierden al fallar evaluaciones y se regeneran con el tiempo o (para Plan 3) mediante minijuegos educativos.
- 🎓 **Claustro Interactivo:** Catálogo público de profesores especialistas con tutorías privadas y videollamadas en directo via Jitsi Meet (exclusivo Plan 3).

### Estado de desarrollo por Hitos

| Hito | Descripción | Estado |
|------|-------------|--------|
| I | Fundamentos e Infraestructura DevOps | ✅ Completado |
| II | Backend y Base de Datos | ✅ Completado |
| III | Frontend y Experiencia de Usuario | ✅ Completado |
| IV | Integración de Inteligencia Artificial (Astro) | ✅ Completado |
| V | Sistema de Vidas y Minijuegos Roguelike | ✅ Completado |
| VI | Catálogo de Profesores y Videoconferencias | ✅ Completado |
| VII | Correcciones, Contenido y Documentación | ✅ Completado |

---

## 2. Objetivos y Justificación del Proyecto

### Problemática Detectada

En el sistema educativo español, los alumnos de la ESO se enfrentan a dos problemas interrelacionados:

1. **Brecha de motivación:** Las plataformas digitales de estudio son percibidas como aburridas y poco interactivas, lo que dificulta el hábito de estudio autónomo.
2. **Ritmo único:** Las aulas presenciales avanzan a un ritmo que no se adapta a las necesidades individuales. Un alumno brillante en matemáticas puede estar rezagado en lengua, pero el sistema le obliga a avanzar en bloque.

### Solución Propuesta

Genio Academy aborda estos problemas con un enfoque triple:

**Aprendizaje incremental personalizado:** El contenido está organizado por niveles de dificultad dentro de cada asignatura. El alumno solo accede al siguiente nivel cuando ha demostrado dominar el anterior, emulando la mecánica de los videojuegos de rol (RPG). El backend aplica un control 403 Forbidden si el alumno intenta acceder a contenido por encima de su nivel RPG real.

**Gamificación real (no cosmética):** Los elementos de juego (XP, niveles, avatares, vidas) no son simples decoraciones. Tienen peso real sobre la experiencia: perder una vida limita el acceso y obliga a reflexión, ganar XP desbloquea contenido y el avatar representa el progreso real del alumno. La fórmula de progresión es `nivel_actual × 500 XP` para pasar al siguiente nivel.

**Tutor inteligente accesible:** El asistente Astro (basado en Groq Cloud con el modelo `llama-3.1-8b-instant`) actúa como un tutor socrático disponible 24/7, adaptando sus respuestas al contexto de la lección que está estudiando el alumno. No da las respuestas directas, sino que guía el razonamiento.

### Objetivos Específicos

- Desarrollar una plataforma web funcional, segura y escalable con arquitectura de microservicios dockerizados.
- Implementar un sistema de autenticación seguro mediante tokens JWT enriquecidos con datos de gamificación.
- Crear un motor de lógica educativa que controle el acceso a contenido según el nivel real del alumno (bloqueo 403).
- Integrar un asistente de inteligencia artificial contextual y socrático sin exponer claves de API al cliente.
- Diseñar una experiencia de gamificación que incentive la constancia y penalice la pasividad (sistema de vidas).
- Ofrecer tres planes de suscripción diferenciados con funcionalidades exclusivas por nivel.
- Proporcionar un claustro de profesores reales con sistema de tutorías y videollamadas en vivo.

---

## 3. Modelo Entidad-Relación

### Entidades Principales

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MODELO E-R COMPLETO                               │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐        ┌──────────────────┐
  │      CustomUser      │        │     Category     │
  ├──────────────────────┤        ├──────────────────┤
  │ id (PK)              │        │ id (PK)          │
  │ username             │        │ name             │
  │ email                │        │ description      │
  │ password (hashed)    │        └────────┬─────────┘
  │ subscription_level   │                 │ 1:N
  │ experience_points    │        ┌────────▼─────────┐
  │ current_student_level│        │  KnowledgeLevel  │
  │ selected_avatar      │        ├──────────────────┤
  │ lives_count          │        │ id (PK)          │
  │ last_life_lost_at    │        │ category (FK)    │
  │ is_teacher*          │        │ name             │
  └──────┬───────────────┘        │ order            │
         │                        └────────┬─────────┘
         │ (vía CourseCompletion)          │ 1:N
         │ N:M con Course         ┌────────▼─────────┐
         │                        │      Course      │
  ┌──────▼───────────────┐        ├──────────────────┤
  │  CourseCompletion    │        │ id (PK)          │
  ├──────────────────────┤        │ knowledge_level  │
  │ id (PK)              │◄───────│   (FK)           │
  │ user (FK)            │        │ title            │
  │ course (FK)          │        │ description      │
  │ completed_at         │        │ xp_reward        │
  │ UNIQUE(user, course) │        └────────┬─────────┘
  └──────────────────────┘                 │ 1:N
                                  ┌────────▼─────────┐
  ┌───────────────────────┐       │      Lesson      │
  │     MinigameLog       │       ├──────────────────┤
  ├───────────────────────┤       │ id (PK)          │
  │ id (PK)               │       │ course (FK)      │
  │ user (FK)             │       │ title            │
  │ minigame_id           │       │ content (HTML)   │
  │ played_at             │       │ order            │
  └───────────────────────┘       └────────┬─────────┘
                                           │ 1:N
  ┌───────────────────────┐       ┌────────▼─────────┐
  │      Professor        │       │     Exercise     │
  ├───────────────────────┤       ├──────────────────┤
  │ id (PK)               │       │ id (PK)          │
  │ user (FK, OneToOne)   │       │ lesson (FK)      │
  │ full_name             │       │ question         │
  │ title                 │       │ options (JSON)   │
  │ bio                   │       │ correct_answer   │
  │ avatar_url            │       └──────────────────┘
  │ is_active             │
  │ is_featured           │
  │ cv_json (JSON)        │
  │ subjects (M2M →       │
  │   Category)           │
  └──────┬────────────────┘
         │ 1:N
  ┌──────▼────────────────┐
  │     Consultation      │
  ├───────────────────────┤
  │ id (PK)               │
  │ student (FK)          │
  │ professor (FK)        │
  │ course (FK, nullable) │
  │ message               │
  │ response              │
  │ status                │
  │ meeting_link          │
  │ is_live_call          │
  │ created_at            │
  │ updated_at            │
  └───────────────────────┘

  * is_teacher NO es un campo de base de datos sino un computed: True si el
    usuario tiene un professor_profile (relación OneToOne con Professor).
```

### Relaciones Clave

| Relación | Tipo | Descripción |
|----------|------|-------------|
| `CustomUser` → `CourseCompletion` | 1:N | Un alumno puede completar muchos cursos |
| `Course` → `CourseCompletion` | 1:N | Un curso puede ser completado por muchos alumnos |
| `CustomUser` → `MinigameLog` | 1:N | Un alumno puede tener muchos registros de minijuego |
| `Category` → `KnowledgeLevel` | 1:N | Una asignatura tiene varios niveles de dificultad |
| `KnowledgeLevel` → `Course` | 1:N | Un nivel contiene varios cursos |
| `Course` → `Lesson` | 1:N | Un curso tiene varias lecciones |
| `Lesson` → `Exercise` | 1:N | Una lección tiene varios ejercicios tipo test |
| `Professor` → `Category` | N:M | Un profesor puede impartir varias materias |
| `Professor` → `Consultation` | 1:N | Un profesor puede recibir muchas consultas |
| `CustomUser` → `Professor` | 1:1 | Un profesor tiene un usuario Django para hacer login |

### Restricciones de Integridad

- La combinación `(user, course)` en `CourseCompletion` es **UNIQUE** — impide el farmeo de XP completando el mismo curso varias veces.
- `lives_count` nunca puede superar `MAX_LIVES = 3` (forzado en la lógica Python, no a nivel de BD).
- `subscription_level` solo acepta valores 1, 2 o 3 (definido como `IntegerChoices` de Django).
- El campo `options` de `Exercise` es `JSONField` — debe ser una lista de strings. Ejemplo: `["3", "6", "9", "12"]`.
- El campo `correct_answer` de `Exercise` debe coincidir exactamente (mismo texto) con uno de los valores de `options`.
- Los campos `status` de `Consultation` solo aceptan: `'PENDING'`, `'IN_CALL'`, `'ANSWERED'`.

---

## 4. Modelo de Clases y Casos de Uso

### Arquitectura de Capas (Backend)

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                       │
│              (Django REST Framework API)                       │
│                                                               │
│  users/views.py          courses/views.py      ai/views.py   │
│  ├── MyTokenObtainPair   ├── CategoryViewSet   ├── ChatView  │
│  ├── RegisterView        ├── KnowledgeLevelVS  └──────────   │
│  ├── UserViewSet         ├── CourseViewSet                   │
│  │   └── update_avatar   └── LessonViewSet                   │
│  ├── LivesView           teachers/views.py                   │
│  ├── DecreaseLivesView   ├── ProfessorViewSet                │
│  └── MinigamePlayView    └── ConsultationViewSet             │
│                              ├── my_students                 │
│                              ├── start_call                  │
│                              ├── end_call                    │
│                              └── active_calls                │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                    CAPA DE LÓGICA                              │
│                                                               │
│  sync_lives(user)        → Motor de regeneración pasiva      │
│  get_lives_data(user)    → Helper: estado completo de vidas   │
│  check_unlocked(user, n) → Bloqueo 403 por nivel RPG         │
│  MyTokenObtainPairSerializer → JWT enriquecido con RPG data  │
│  UserSerializer          → Transforma User ↔ JSON            │
│  SYSTEM_PROMPT           → Instrucciones de Astro (IA)       │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                    CAPA DE DATOS                               │
│              (PostgreSQL + Django ORM)                         │
│                                                               │
│  CustomUser    KnowledgeLevel  Course      Lesson            │
│  Category      Exercise        CourseCompletion              │
│  MinigameLog   Professor       Consultation                  │
└──────────────────────────────────────────────────────────────┘
```

### Arquitectura del Frontend (React SPA)

```
src/
 ├── App.jsx              → Router principal. Define todas las rutas de la app.
 ├── context/
 │   └── AuthContext.jsx  → Estado global: sesión, user, login(), logout()
 ├── utils/
 │   ├── PrivateRoute.jsx → Guard: redirige a /login si no hay token
 │   ├── axiosInstance.js → Cliente HTTP con interceptor JWT automático
 │   └── avatarUtils.js   → Mapa de búhos y lógica de desbloqueo
 ├── pages/
 │   ├── Home.jsx          → Landing page pública (estética espacial)
 │   ├── Courses.jsx        → Catálogo Estelar: asignaturas y niveles
 │   ├── Mission.jsx        → Página de planes y precios
 │   ├── Login.jsx          → Formulario de inicio de sesión
 │   ├── Register.jsx       → Formulario de registro con selección de plan
 │   ├── Dashboard.jsx      → Panel de control del alumno con gamificación
 │   ├── CoursePlayer.jsx   → Reproductor: teoría + quiz + sidebar
 │   ├── Claustro.jsx       → Catálogo público de profesores
 │   ├── StudentCatalog.jsx → Claustro privado para alumnos (Plan 3)
 │   └── TeacherDashboard.jsx → Panel docente: consultas y alumnos
 └── components/
     ├── Navbar.jsx           → Barra de navegación global
     ├── ActiveCallBanner.jsx → Banner global de videollamada activa
     ├── AIChatPanel.jsx      → Chat con Astro (IA) integrado en CoursePlayer
     ├── LivesPanel.jsx       → Panel de planetas y acceso a minijuegos
     ├── LessonQuiz.jsx       → Componente de preguntas tipo test
     ├── TutoringModal.jsx    → Modal de solicitud de tutoría
     ├── JitsiMeetWrapper.jsx → IFRAME de videollamada Jitsi
     ├── ProfessorCard.jsx    → Tarjeta de profesor con CV modal
     ├── StudentCardModal.jsx → Modal de ficha de alumno (para profesores)
     ├── ScrollToTop.jsx      → Efecto scroll al inicio al cambiar de ruta
     ├── ScrollToTopButton.jsx → Botón flotante de "volver arriba"
     ├── MinijuegoParejas.jsx    → Minijuego: encontrar parejas de búhos
     ├── MinijuegoCalculo.jsx    → Minijuego: cálculo mental rápido
     ├── MinijuegoSopaLetras.jsx → Minijuego: sopa de letras temática
     ├── MinijuegoCompletar.jsx  → Minijuego: completar la palabra
     └── MinijuegoVerdaderoFalso.jsx → Minijuego: verdadero o falso
```

### Rutas de la Aplicación (App.jsx)

| URL | Componente | Acceso |
|-----|------------|--------|
| `/` | `Home` | Público |
| `/courses` | `Courses` | Público |
| `/mission` | `Mission` | Público |
| `/claustro` | `Claustro` | Público |
| `/login` | `Login` | Público |
| `/register` | `Register` | Público |
| `/dashboard` | `Dashboard` | 🔒 Privado |
| `/dashboard/claustro` | `StudentCatalog` | 🔒 Privado |
| `/player/:courseId` | `CoursePlayer` | 🔒 Privado |
| `/teacher-dashboard` | `TeacherDashboard` | 🔒 Privado (+ is_teacher) |
| `*` | 404 inline | Público |

### Casos de Uso Principales

#### CU-01: Registro de alumno
- **Actor:** Visitante
- **Descripción:** El usuario selecciona un plan de suscripción (1, 2 o 3), introduce username, email y contraseña. El sistema crea la cuenta con `lives_count=3`, `experience_points=0`, `current_student_level=1` y el avatar `buho1`.
- **Endpoint:** `POST /api/users/register/`
- **Resultado:** Alumno registrado, redirige al login.

#### CU-02: Login y sesión JWT
- **Actor:** Alumno registrado
- **Descripción:** Introduce credenciales. El backend valida y emite un par de tokens JWT (`access` + `refresh`) con los datos de gamificación del alumno embebidos en el payload.
- **Endpoint:** `POST /api/token/`
- **Datos en el JWT:** `username`, `current_student_level`, `experience_points`, `selected_avatar`, `subscription_level`, `is_teacher`.
- **Resultado:** Alumno conectado, redirigido al Dashboard.

#### CU-03: Explorar el catálogo de cursos
- **Actor:** Alumno conectado
- **Descripción:** El alumno ve las asignaturas organizadas por niveles. Los niveles cuyo `order` supera su `current_student_level` aparecen bloqueados con candado y mensaje explicativo. El backend lanza `403 Forbidden` si se intenta acceder directamente.
- **Endpoint:** `GET /api/courses/categories/`
- **Resultado:** Alumno accede solo al contenido que le corresponde.

#### CU-04: Completar un curso (ganar XP)
- **Actor:** Alumno conectado (cualquier plan)
- **Descripción:** El alumno ve la teoría de las lecciones, completa los quiz del `LessonQuiz` y finalmente pulsa "Completar Misión". El backend valida que no lo haya completado antes (unicidad de `CourseCompletion`), suma los `xp_reward` del curso al alumno y comprueba si debe subir de nivel (fórmula: `nivel × 500 XP`). Genera un nuevo JWT con el nivel/XP actualizados.
- **Endpoint:** `POST /api/courses/courses/{id}/complete/`
- **Resultado:** XP sumados, posible subida de nivel, modal de victoria.

#### CU-05: Consultar al tutor Astro (IA)
- **Actor:** Alumno con Plan 2 o Plan 3
- **Descripción:** Dentro del reproductor de curso, el alumno escribe su duda en `AIChatPanel.jsx`. El frontend envía al backend el mensaje junto con el título del curso y la lección activa. El backend construye un `SYSTEM_PROMPT` contextual y lo envía a la API de Groq (modelo `llama-3.1-8b-instant`). Astro responde de forma socrática.
- **Endpoint:** `POST /api/ai/chat/`
- **Resultado:** Respuesta educativa sin revelar la solución directa.
- **Restricción:** Acceso denegado (403) para Plan 1.

#### CU-06: Sistema de vidas y pérdida de planeta
- **Actor:** Alumno conectado (cualquier plan)
- **Descripción:** Al fallar una evaluación se llama al endpoint `POST /api/users/lives/decrease/`. Se resta 1 vida y se inicia el reloj de regeneración (`last_life_lost_at`) si no estaba ya corriendo. La regeneración de vidas se calcula al vuelo comparando `timezone.now()` con `last_life_lost_at` cada vez que el alumno hace cualquier petición al servidor, sin necesidad de tareas en segundo plano.
- **Endpoint:** `POST /api/users/lives/decrease/`
- **Resultado:** El panel de vidas se actualiza en tiempo real.

#### CU-07: Recuperar vida mediante minijuego de rescate
- **Actor:** Alumno con **Plan 3 (Agujero de Gusano)** y 0 vidas.
- **Descripción:** Cuando el alumno agota sus 3 planetas, se desbloquea el panel de rescate en `LivesPanel.jsx`. El alumno debe superar uno de los 5 minijuegos. El backend valida que tenga Plan 3, que tenga 0 vidas y que no haya jugado a ese minijuego específico en el periodo de cooldown (configurado en `MINIGAME_COOLDOWN_SECONDS`).
- **Endpoint:** `POST /api/users/minigames/play/` con `{ "minigame_id": "pairs", "won": true }`
- **Resultado:** Si gana, recupera 1 planeta de forma inmediata sin resetear el reloj de regeneración pasiva.
- **Restricción:** Exclusivo de Plan 3. Solo disponible con 0 vidas.

#### CU-08: Cambio de avatar
- **Actor:** Alumno conectado
- **Descripción:** Desde el Dashboard, el alumno selecciona un búho disponible según su nivel RPG. El backend actualiza `selected_avatar` y genera un nuevo par de tokens JWT con el avatar actualizado para que la navbar se refresque al instante sin necesidad de volver a hacer login.
- **Endpoint:** `POST /api/users/management/{id}/update_avatar/` con `{ "selected_avatar": "buho3" }`
- **Resultado:** JWT renovado, avatar visible en la barra de navegación inmediatamente.

#### CU-09: Solicitud de Tutoría Personalizada
- **Actor:** Alumno con **Plan 3 (Agujero de Gusano)**
- **Descripción:** Dentro de cualquier curso, el alumno pulsa "Solicitar Tutoría". El modal `TutoringModal.jsx` hace `GET /api/teachers/professors/?course_id=X` para filtrar profesores especializados en la materia de ese curso. El alumno selecciona un profesor y envía su duda. Se crea un `Consultation` en estado `PENDING` en la bandeja del profesor.
- **Resultado:** Ticket creado en la bandeja de entrada del profesor de manera asíncrona.
- **Restricción:** `subscription_level >= 3`. Si no se cumple, el backend retorna 403.

#### CU-10: Videollamada con Jitsi Meet
- **Actor:** Profesor (`is_teacher`) y Alumno solicitante
- **Descripción:** El profesor revisa su bandeja en `/teacher-dashboard` y pulsa "Iniciar Llamada". El backend genera un nombre de sala único (`GenioAcademy_{id}_{uuid}`) y actualiza el `Consultation` a estado `IN_CALL` con `is_live_call=True`. El alumno no tiene que estar esperando: `ActiveCallBanner.jsx` hace polling al endpoint `GET /api/teachers/consultations/active_calls/` y cuando detecta una llamada activa, muestra un banner flotante. Al pulsar el banner, se abre `JitsiMeetWrapper.jsx` con el IFRAME de Jitsi embebido dentro de la plataforma.
- **Endpoints:** `POST /api/teachers/consultations/{id}/start_call/`, `GET active_calls/`, `POST end_call/`
- **Resultado:** Videollamada P2P sin salir del ecosistema de la academia.

---

## 5. Tecnologías Empleadas

### Infraestructura y DevOps

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Docker** | Latest | Contenerización de los 3 servicios |
| **Docker Compose** | v3+ | Orquestación y red interna entre contenedores |
| **Git** | Latest | Control de versiones con estrategia Git Flow |
| **GitHub** | — | Repositorio remoto y backup |

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Python** | 3.11 | Lenguaje principal del backend |
| **Django** | 5.x | Framework web, ORM y panel de administración |
| **Django REST Framework** | Latest | Construcción de la API REST |
| **Simple JWT** | Latest | Autenticación con JSON Web Tokens personalizados |
| **django-cors-headers** | Latest | Política CORS entre frontend (:5173) y backend (:8000) |
| **psycopg2-binary** | Latest | Conector Python ↔ PostgreSQL |
| **Groq SDK** | Latest | Cliente oficial de la API de IA Groq Cloud |
| **python-dotenv** | Latest | Carga de variables de entorno desde `.env` |

### Base de Datos

| Tecnología | Uso |
|-----------|-----|
| **PostgreSQL** | Base de datos relacional principal |

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **React** | 18.x | Framework de interfaz de usuario (SPA) |
| **Vite** | Latest | Bundler ultrarrápido con Hot Reload |
| **React Router DOM** | v6 | Enrutamiento SPA sin recargar la página |
| **Axios** | Latest | Cliente HTTP con interceptores automáticos de JWT |
| **Tailwind CSS** | v4 | Motor de estilos basado en utilidades |
| **DaisyUI** | Latest | Componentes preestilizados (botones, modales, etc.) |
| **Lucide React** | Latest | Librería de iconos SVG |
| **Framer Motion** | Latest | Animaciones fluidas en modales y transiciones |

### Inteligencia Artificial

| Tecnología | Modelo | Uso |
|-----------|--------|-----|
| **Groq Cloud** | `llama-3.1-8b-instant` | Motor LLM para el tutor Astro (LPU ultra-rápido) |

### Decisiones Arquitectónicas Destacadas

1. **JWT enriquecido:** En lugar de consultar la API en cada cambio de página, los datos de gamificación (XP, nivel, avatar, plan, `is_teacher`) se inyectan directamente dentro del token JWT vía `MyTokenObtainPairSerializer`. Esto elimina peticiones innecesarias. **Excepción:** `lives_count` no está en el JWT porque cambia con demasiada frecuencia; el frontend lo obtiene via `GET /api/users/lives/`.

2. **Regeneración de vidas sin Celery:** En lugar de usar un servidor de tareas en segundo plano (Celery + Redis), la regeneración pasiva se calcula al vuelo cuando el alumno hace cualquier petición. La función `sync_lives(user)` compara `timezone.now()` con `last_life_lost_at` y suma los planetas que correspondan. Esto ahorra recursos de servidor considerablemente para el tamaño actual del proyecto.

3. **Polling en cliente + reloj local:** `ActiveCallBanner.jsx` verifica llamadas activas periódicamente (polling al servidor) mientras que `LivesPanel.jsx` usa un temporizador local que decrementa cada segundo para mostrar el countdown de regeneración sin saturar el servidor. El servidor es la "fuente de verdad" y el reloj local solo mejora la fluidez visual.

4. **Astro como proxy:** El backend actúa de intermediario obligatorio entre React y Groq. El frontend nunca conoce la `GROQ_API_KEY`. Además, el backend añade el `SYSTEM_PROMPT` de Astro (instrucciones de comportamiento socrático + contexto de la lección) antes de enviar el mensaje al modelo, algo que tampoco puede hacer el cliente.

5. **Claustro público/privado:** El mismo endpoint `GET /api/teachers/professors/` devuelve resultados distintos según si el usuario está autenticado o no. Sin token: solo profesores `is_featured=True` (para la landing). Con token: claustro completo. Además, `?course_id=X` activa el filtro por materia para el modal de tutoría.

---

## 6. Estructura de Ficheros del Proyecto

```
GenioAcademy/
├── docker-compose.yml            → Orquestación de los 3 contenedores
├── README.md                    → Guía de comandos y referencia rápida
├── documentacion.md             → Este archivo
│
├── backend/
│   ├── Dockerfile               → Imagen Docker del backend
│   ├── manage.py                → CLI de Django
│   ├── requirements.txt         → Dependencias Python
│   ├── seed_data.py             → Script de siembra básica de categorías y cursos
│   ├── seed_teachers.py         → Script de siembra del claustro de profesores
│   ├── seed_teacher_users.py    → Script de creación de cuentas de profesor
│   ├── .env                     → Variables de entorno (NO incluido en Git)
│   │
│   ├── core/                    → Configuración principal de Django
│   │   ├── settings.py          → Configuración global (DB, JWT, CORS, apps...)
│   │   └── urls.py              → Enrutador raíz de la API
│   │
│   ├── users/                   → App de gestión de alumnos
│   │   ├── models.py            → CustomUser y MinigameLog
│   │   ├── serializers.py       → JWT enriquecido y serialización de registro
│   │   ├── views.py             → Login, registro, avatares, vidas, minijuegos
│   │   └── urls.py              → Rutas: /register/, /lives/, /minigames/play/...
│   │
│   ├── courses/                 → App del catálogo educativo
│   │   ├── models.py            → Category, KnowledgeLevel, Course, Lesson, Exercise, CourseCompletion
│   │   ├── serializers.py       → Serialización del árbol de contenido
│   │   ├── views.py             → API de cursos con bloqueo por nivel RPG
│   │   └── urls.py              → Rutas: /categories/, /courses/{id}/, /complete/...
│   │
│   ├── ai/                      → App del tutor Astro
│   │   ├── views.py             → Proxy seguro hacia la API de Groq
│   │   └── urls.py              → Ruta: /chat/
│   │
│   └── teachers/                → App del claustro y tutorías
│       ├── models.py            → Professor y Consultation
│       ├── serializers.py       → Serialización de profesores y consultas
│       ├── views.py             → Catálogo, tutorías, start/end_call, active_calls
│       └── urls.py              → Rutas: /professors/, /consultations/...
│
└── frontend/
    ├── Dockerfile               → Imagen Docker del frontend
    ├── package.json             → Dependencias Node
    ├── vite.config.js           → Configuración de Vite
    │
    └── src/
        ├── App.jsx              → Router y estructura global
        ├── main.jsx             → Punto de entrada de React
        ├── index.css            → Configuración de Tailwind v4 y DaisyUI
        │
        ├── assets/              → Imágenes, logos y avatares de búhos
        ├── context/
        │   └── AuthContext.jsx  → Proveedor global de sesión JWT
        ├── utils/
        │   ├── PrivateRoute.jsx → Guard de rutas privadas
        │   ├── axiosInstance.js → Interceptor de tokens JWT
        │   └── avatarUtils.js  → Lógica de desbloqueo de búhos por nivel
        ├── pages/               → Vistas principales (ver sección 4)
        └── components/         → Componentes reutilizables (ver sección 4)
```

---

## 7. Manual de Usuario

### 7.1 Registro

1. Accede a la página principal en `http://localhost:5173`.
2. Pulsa **"Comenzar Misión"** o **"Registrarse"** en la barra de navegación.
3. Selecciona tu **Plan de Suscripción**:
   - **Órbita Base (6,99€/mes):** Acceso a teoría, quiz y sistema de vidas. Sin IA.
   - **Velocidad Luz (12,99€/mes):** Todo lo anterior + Tutor Astro (IA) disponible 24/7.
   - **Agujero de Gusano (24,99€/mes):** Todo lo anterior + Minijuegos de rescate + Tutorías con profesor real en vivo.
4. Rellena tus datos: nombre de usuario, email y contraseña.
5. Pulsa **"Finalizar Misión de Registro"**.

### 7.2 Dashboard (Panel de Control)

Tras conectarte verás tu **centro de mando personal**:

- **Barra superior de perfil:** Tu avatar de búho, nombre, nivel RPG actual y barra de progreso de XP indicando cuántos puntos te faltan para subir de nivel.
- **Operación Principal:** El curso sugerido: el primero que tienes disponible según tu nivel y que aún no has completado.
- **Vitrina de Medallas:** Logros y reconocimientos según tus cursos completados.
- **Selector de Avatar:** Galería de búhos disponibles. Los que aún no has desbloqueado aparecen con candado. Haz clic en uno activo para cambiarlo.
- **Acceso al Claustro:** Directo al catálogo de profesores (restringido a Plan 3).

### 7.3 Catálogo Estelar (Cursos)

En la sección **"Catálogo Estelar"** verás todas las asignaturas organizadas por niveles:

- 🟢 **Disponible:** Tu nivel RPG actual es igual o superior al requerido.
- 🔒 **Bloqueado:** Tu nivel RPG actual es inferior al requerido. Sigue acumulando XP completando cursos de tu nivel actual para desbloquearlo.

Las asignaturas disponibles son: **Matemáticas, Física, Ciencias Naturales, Historia, Lengua** y más, organizadas en niveles de conocimiento progresivos.

### 7.4 Reproductor de Curso (CoursePlayer)

Al entrar en un curso verás una pantalla dividida en dos columnas:

**Columna izquierda (70% del ancho):**
- Panel de vídeo decorativo (simulado — el vídeo real estará disponible en futuras fases).
- Pestaña **"Manual Teórico":** El contenido educativo escrito de la lección activa.
- Pestaña **"Simulador":** El quiz interactivo (`LessonQuiz`). Debes superar todas las lecciones para desbloquear el botón de completar el curso.

**Columna derecha — Sidebar (30% del ancho):**
- **Ruta de Vuelo:** Lista de lecciones del curso. Haz clic en una para cambiar de lección. Las completadas se marcan con un ✅ verde.
- **Botón "Completar Misión":** Solo aparece activo cuando has pasado el quiz de todas las lecciones. Da XP la primera vez; en repaso muestra "Terminar Entrenamiento" sin XP adicional.
- **Chat de Astro 🦉:** Disponible para Plan 2 y Plan 3. El chat conoce el contexto del curso y la lección activa.
- **Panel de Planetas 🪐:** Muestra tus vidas actuales y el tiempo de regeneración.
- **Solicitar Tutoría:** Botón para Plan 3 que abre el modal de tutoría.

### 7.5 Tutor Astro (IA)

- Escribe tu duda en el campo de texto y pulsa el botón de envío.
- **Astro explicará los conceptos teóricos** si le preguntas qué es algo o cómo funciona.
- **Astro NO te dará la respuesta directa** si le preguntas por la solución de un problema concreto — te guiará con preguntas intermedias para que la descubras tú. Este es el método socrático.
- El historial de conversación se mantiene durante la sesión de la página (se reinicia si cierras el reproductor).
- Si eres de Plan 1 verás un aviso de que esta función requiere Plan 2 o superior.

### 7.6 Sistema de Planetas (Vidas)

- Tienes **3 planetas** como máximo al registrarte.
- Pierdes 1 planeta al fallar una evaluación.
- Los planetas se **regeneran solos** con el paso del tiempo (la velocidad de regeneración está configurada en el backend).
- El panel muestra un **countdown** en tiempo real de cuándo recuperarás el siguiente planeta.
- Si llegas a **0 planetas** y eres del **Plan 3**, se desbloquean los **Minijuegos de Rescate**.

### 7.7 Minijuegos de Rescate (Exclusivo Plan 3)

**Requisitos:** Tener exactamente 0 planetas Y suscripción "Agujero de Gusano".

Los 5 minijuegos disponibles son:

| Minijuego | ID interno | Descripción |
|-----------|------------|-------------|
| **Parejas de Astro** | `pairs` | Encuentra los búhos idénticos en el menor número de intentos |
| **Cálculo Mental** | `arcade` | Resuelve operaciones aritméticas rápidas antes de que se acabe el tiempo |
| **Sopa de Letras** | `wordsearch` | Localiza conceptos clave del temario en un panel de letras |
| **Completar Palabra** | `fill_word` | Adivina la palabra técnica que falta en la definición |
| **Verdadero o Falso** | `true_false` | Clasifica afirmaciones sobre el temario bajo presión de tiempo |

Al superar uno, recuperas 1 planeta inmediatamente. Cada minijuego tiene un periodo de cooldown: una vez jugado, no estará disponible hasta que pase el tiempo de espera (configurado en el servidor).

### 7.8 Galería de Avatares (Búhos)

- Desde tu Dashboard puedes ver los búhos disponibles.
- Cada búho se desbloquea al alcanzar su nivel RPG correspondiente (definido en `avatarUtils.js`).
- El búho activo aparecerá en el chat de Astro y en la barra de navegación.

### 7.9 Tutorías en Vivo — Jitsi Meet (Exclusivo Plan 3)

**Flujo completo:**

1. **Solicitud:** En el reproductor de curso, pulsa "Solicitar Tutoría en Directo". El modal muestra los profesores especializados en la materia de ese curso. Escribe tu duda y envía.
2. **En segundo plano:** La plataforma verifica cada pocos segundos si tu profesor ha aceptado y activado la llamada. No necesitas quedarte esperando en esa pantalla.
3. **Notificación:** Cuando el profesor pulse "Iniciar Llamada" desde su panel, aparecerá un **banner flotante rojo** en la parte superior de cualquier página donde estés. El banner incluye el nombre del profesor y el estado "LIVE".
4. **Videollamada:** Al pulsar el banner, se abre el reproductor de Jitsi Meet embebido directamente dentro de la plataforma. No se abre ninguna pestaña externa.
5. **Cierre:** Cuando el profesor finaliza la llamada, la consulta queda marcada como "Resuelta" y el banner desaparece.

### 7.10 Panel de Profesores (Solo para Docentes)

Si tienes cuenta de profesor (`is_teacher = True`), puedes acceder a `/teacher-dashboard`:

- **Bandeja de Consultas:** Ve todas las solicitudes de tutoría que te han enviado, con el nombre del alumno, el curso y la duda.
- **Mis Alumnos:** Lista de alumnos que han completado cursos de tus materias, con su nivel RPG, XP y vidas actuales. Haz clic en "Ver Ficha" para ver el perfil completo.
- **Iniciar/Finalizar Llamada:** Botones para gestionar la videollamada de Jitsi desde tu panel.

### 7.11 Panel de Administración Django (Solo Administrador)

- Accede en `http://localhost:8000/admin/` con las credenciales del superusuario.
- Desde aquí puedes:
  - Crear y editar **Categorías** (asignaturas), **Niveles de Conocimiento**, **Cursos**, **Lecciones** y **Ejercicios**.
  - Gestionar **Alumnos** y ver su progreso (XP, nivel, vidas).
  - Gestionar el **Claustro** de profesores (crear/editar perfiles, asignar materias, etc.).
  - Ver el historial de **Consultas de Tutoría**.
  - Insertar contenido HTML enriquecido directamente en el campo "Contenido" de las lecciones.

---

## 8. Manual del Desarrollador

### 8.1 Puesta en Marcha desde Cero

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cristina2M/GenioAcademy.git
cd GenioAcademy

# 2. Crear el archivo de variables de entorno en el backend
# Editar backend/.env con:
#   SECRET_KEY=una_clave_secreta_larga
#   POSTGRES_DB=genio_db
#   POSTGRES_USER=genio_user
#   POSTGRES_PASSWORD=genio_pass
#   GROQ_API_KEY=tu_clave_de_groq_aqui

# 3. Levantar todos los servicios
docker-compose up --build

# 4. En otra terminal: ejecutar migraciones y crear el admin
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# 5. Sembrar la base de datos (categorías y cursos básicos)
docker-compose exec backend python manage.py shell < seed_data.py

# 6. Sembrar el claustro de profesores
docker-compose exec backend python manage.py shell < seed_teachers.py

# 7. Crear cuentas de prueba para profesores
docker-compose exec backend python manage.py shell < seed_teacher_users.py
```

**Accesos locales:**
- Frontend (alumno): http://localhost:5173
- Backend API: http://localhost:8000/api/
- Panel de Admin Django: http://localhost:8000/admin/

### 8.2 Cuentas de Prueba

| Tipo | Usuario | Contraseña | Acceso |
|---|---|---|---|
| Alumno Plan 1 | `alumno1` | `Genio2026!` | Teoría y quiz básico |
| Alumno Plan 2 | `alumno2` | `Genio2026!` | + Tutor Astro IA |
| Alumno Plan 3 | `alumno3` | `Genio2026!` | + Minijuegos y tutorías |
| Profesor | `profe_mate` | `Genio2026!` | Panel docente |
| Superusuario | `admin` | (definido al crear) | Admin Django completo |

### 8.3 Comandos Útiles

```bash
# Gestión de contenedores
docker-compose up               # Levantar sin reconstruir
docker-compose up --build       # Reconstruir las imágenes y levantar
docker-compose down             # Parar los contenedores
docker-compose down -v          # Parar y borrar volúmenes (borra la BD)

# Backend
docker-compose exec backend python manage.py migrate        # Aplicar migraciones
docker-compose exec backend python manage.py makemigrations # Crear nuevas migraciones
docker-compose exec backend python manage.py shell          # Consola Python con el ORM de Django
docker-compose exec backend python manage.py createsuperuser

# Frontend
docker-compose exec frontend npm install nombre-libreria     # Instalar librería (con contenedor activo)
docker-compose run --rm frontend npm install nombre-libreria # Instalar librería (sin contenedor)
```

### 8.4 Convenciones del Código

- **Variables y funciones propias:** En español. Ejemplo: `leccionActiva`, `pestanaActiva`, `reclamarRecompensa`.
- **Palabras reservadas del framework:** En inglés. Ejemplo: `useState`, `useEffect`, `className`, `serializer`, `queryset`.
- **Comentarios:** Exhaustivos en español, explicando el "por qué" además del "qué".
- **Commits:** Atómicos y descriptivos. Sin prefijos de convención (`feat:`, `chore:`). Ejemplos: `"Ajustar y documentar CoursePlayer"`, `"Corregir validación de vidas en el backend"`.

### 8.5 Añadir Contenido Educativo (sin código)

Para añadir cursos, lecciones y ejercicios sin tocar el código Python:

1. Accede a `http://localhost:8000/admin/`.
2. En **Courses > Categorías:** crea o edita asignaturas.
3. En **Courses > Niveles de Conocimiento:** asígnales un número de `order` (nivel RPG mínimo requerido).
4. En **Courses > Cursos:** crea cursos dentro de un nivel. El campo `xp_reward` (por defecto 300) decide cuántos XP da al completarlo.
5. En **Courses > Lecciones:** añade lecciones al curso. El campo `content` acepta **HTML enriquecido** (negritas, colores, listas, etc.). El frontend lo renderiza directamente.
6. En **Courses > Ejercicios:** añade preguntas a la lección. El campo `options` debe ser JSON: `["opción A", "opción B", "opción C"]`. El campo `correct_answer` debe coincidir exactamente con una de las opciones.

---

## 9. Plan de Negocio

### Modelo de Monetización: SaaS por Suscripción

Genio Academy opera bajo un modelo de **Software as a Service (SaaS)** con tres niveles de acceso:

| Plan | Nombre | Precio | Características |
|------|--------|--------|-----------------| 
| 1 | **Órbita Base** | 6,99€/mes | Teoría completa + Quiz interactivos + Sistema de niveles RPG + 3 vidas |
| 2 | **Velocidad Luz** | 12,99€/mes | Todo el Plan 1 + Tutor IA Astro disponible 24/7 |
| 3 | **Agujero de Gusano** | 24,99€/mes | Todo el Plan 2 + Minijuegos de rescate + Tutorías con profesores reales en vivo |

### Segmento de Mercado Objetivo

- **Primario:** Alumnos de la ESO (12-16 años) con dificultades de auto-organización del estudio.
- **Secundario:** Padres que buscan herramientas de apoyo académico digital para sus hijos.
- **Terciario:** Centros educativos que podrían adoptar la plataforma como herramienta complementaria.

### Ventaja Competitiva

| Característica | Genio Academy | Khan Academy | Duolingo |
|---------------|---------------|--------------|----------|
| Contenido adaptado al currículo ESO español | ✅ | ❌ | ❌ |
| Tutor IA socrático contextual | ✅ | ❌ | ✅ |
| Gamificación real con consecuencias (vidas) | ✅ | ❌ | ✅ |
| Bloqueo de contenido por nivel real | ✅ | ❌ | ✅ |
| Minijuegos educativos de rescate | ✅ | ❌ | ❌ |
| Tutorías con profesor real en vivo | ✅ | ❌ | ❌ |
| Planes de pago progresivos | ✅ | ❌ | ✅ |

### Proyección de Costes (Operativos Mensuales Estimados)

| Concepto | Coste Estimado |
|----------|---------------|
| Servidor VPS (2 vCPU, 4 GB RAM) | ~15€/mes |
| API Groq Cloud (según volumen de uso) | ~0-20€/mes |
| Dominio y certificado SSL | ~1€/mes |
| **Total operativo** | **~35€/mes** |

Con solo **5 suscriptores del Plan 1**, el coste operativo estaría cubierto. A partir de ahí, el margen es positivo.

### Estrategia de Crecimiento

1. **Fase 1 — Lanzamiento:** Oferta de precio fundador para los primeros 100 alumnos. Recogida de feedback real de uso.
2. **Fase 2 — Escala:** Integración de ejercicios generados automáticamente por IA para reducir el coste de producción de contenido.
3. **Fase 3 — B2B:** Licencias para centros educativos con panel de control de progreso por clase y exportación de informes.

---

## 10. Diapositivas para la Exposición (Guión)

### Diapositiva 1 — Portada
**"Genio Academy: El videojuego de estudiar"**  
_Tu plataforma de aprendizaje incremental para la ESO. Sube de nivel. Domina el cosmos._

### Diapositiva 2 — El problema
- Muchos estudiantes de secundaria no tienen hábitos de estudio autónomo.
- Las plataformas actuales no están adaptadas al currículo educativo español.
- Los alumnos estudian para el examen y no para aprender de verdad.
- Un único ritmo en el aula no sirve para todos los perfiles de alumno.

### Diapositiva 3 — Nuestra solución
- **Aprendizaje incremental:** el contenido se bloquea automáticamente hasta que el alumno demuestra que está preparado (nivel RPG = gatekeeper).
- **Gamificación con consecuencias reales:** XP, niveles y planetas (vidas) no son decoración — afectan el acceso y obligan a reflexionar sobre los fallos.
- **Tutor IA socrático:** Astro enseña a pensar, no a copiar respuestas. Usa el contexto de la lección activa.
- **Conexión humana:** Tutorías con profesores reales en vivo para los alumnos que más lo necesitan.

### Diapositiva 4 — ¿Cómo funciona? (Demo en vivo)
_[Mostrar el flujo completo: Registro → Dashboard → Catálogo → CoursePlayer (Teoría + Quiz) → Chat de Astro → Panel de Vidas → Solicitar Tutoría]_

### Diapositiva 5 — Arquitectura técnica
- **3 microservicios en Docker:** Frontend (React + Vite), Backend (Django + DRF), Base de Datos (PostgreSQL).
- **API REST** con autenticación JWT enriquecida con datos RPG.
- **IA en la nube** (Groq + LLaMA 3.1): sin saturar nuestro servidor y con latencia mínima.
- El backend actúa como proxy seguro: el cliente nunca ve las claves de la API.

### Diapositiva 6 — Modelo de Datos
_[Mostrar el diagrama E-R de la sección 3 con las entidades y relaciones destacadas]_

Entidades clave: `CustomUser`, `Course`, `Lesson`, `Exercise`, `CourseCompletion`, `Professor`, `Consultation`.

### Diapositiva 7 — El sistema Roguelike
- 3 planetas = 3 vidas.
- Fallar una evaluación → pierde 1 planeta → el reloj de regeneración arranca.
- Los planetas se recuperan con el tiempo sin tareas en segundo plano (cálculo al vuelo).
- **Game Over + Plan 3:** Se activan minijuegos educativos de rescate (5 tipos diferentes).
- Mecánica inspirada en Duolingo pero con mayor impacto pedagógico y exclusividad de plan.

### Diapositiva 8 — Claustro y Tutorías (Hito VI)
- Catálogo de profesores público (para padres) y completo (para alumnos).
- Cada profesor tiene perfil, especialidades, currículum en JSON y sistema de CV.
- Plan 3: solicitud de tutoría → asignación automática al especialista de la materia.
- Videollamada Jitsi embebida dentro de la plataforma → notificación instantánea al alumno.

### Diapositiva 9 — Plan de negocio
_[Mostrar tabla de planes de la sección 9]_

- Coste operativo: ~35€/mes.
- Break-even: 5 suscriptores del Plan 1.
- Modelo escalable a licencias B2B para centros educativos.

### Diapositiva 10 — Conclusión y hoja de ruta futura
**"Estudiar es el único juego en el que ganar de verdad cambia tu vida."**

**Completado:**
- ✅ Hito I-VII: infraestructura, backend, frontend, IA, vidas/minijuegos, claustro, calidad.

**Próximos pasos:**
- Despliegue en producción en VPS real con dominio propio.
- Contenido educativo real de la ESO en todas las asignaturas.
- Modo competitivo: tablas de clasificación por nivel y asignatura.
- App móvil nativa (Expo + React Native) reutilizando la misma API.

---

## 11. Enlace al Código en GitHub

🔗 **Repositorio principal:** https://github.com/Cristina2M/GenioAcademy

### Estrategia de Ramas (Git Flow)

#### Ramas principales
| Rama | Propósito |
|------|-----------|
| `main` | Versión estable y validada, lista para producción |
| `develop` | Rama de integración. Aquí convergen todas las features una vez revisadas |

#### Ramas de Release
| Rama | Propósito |
|------|-----------|
| `release/backend` | Primera versión estable del backend Django + DRF |
| `release/hito-3` | Cierre del Hito III: frontend completo conectado al backend |
| `release/revision2` | Segunda ronda de revisión general |
| `release/correccionesGenerales` | Limpieza de código, españolización de variables y comentarios exhaustivos |

#### Ramas de Feature (en orden cronológico de desarrollo)
| Rama | Funcionalidad desarrollada |
|------|---------------------------|
| `feature/bd` | Modelado inicial de la base de datos (CustomUser, Cursos, Niveles) |
| `feature/backendV1` | Primera versión del backend: API REST, serializadores y migraciones |
| `feature/motorLogica` | Motor de gamificación: XP, subida de nivel y bloqueo 403 |
| `feature/autenticacionFrontend` | Sistema de login/registro en React conectado al JWT |
| `feature/frontend` | Base del frontend: estructura de páginas y enrutamiento SPA |
| `feature/frontendV1` | Primera versión estable del cliente React |
| `feature/home-v2` | Rediseño de la landing page con estética espacial |
| `feature/panelEstudiante` | Dashboard del alumno: avatar, XP, misión sugerida y medallas |
| `feature/reproductorCursos` | CoursePlayer: teoría, simulador de preguntas y sidebar de lecciones |
| `feature/Catalogo` | Catálogo Estelar con filtros por materia y nivel |
| `feature/mision` | Página "La Misión": propósito de la academia y planes de precios |
| `feature/IA` | Tutor Astro: proxy backend + chat socrático + AIChatPanel.jsx |
| `feature/vidas` | Sistema Roguelike: 3 planetas, regeneración pasiva y 5 minijuegos |
| `feature/claustro` | Catálogo público de profesores con cards animadas y modal de CV |
| `feature/interfaz-profesor` | Panel docente: bandeja de consultas y tabla de alumnos |
| `feature/tutorias` | Sistema de tutorías: modal, Jitsi Meet, notificaciones en tiempo real |
| `feature/microcursos` | Expansión del catálogo con más cursos por materia via `seed_data.py` |
| `feature/contenido-formateado` | Soporte de HTML enriquecido en lecciones y ejercicios |
| `feature/docs` | Documentación técnica y actualizaciones del README |

---

_Documentación generada y revisada en Abril 2026. Verificada contra el código real del repositorio._
_Proyecto desarrollado como Trabajo de Fin de Ciclo — DAW._
