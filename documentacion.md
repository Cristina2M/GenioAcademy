# 📚 DOCUMENTACIÓN TÉCNICA Y DE USUARIO
## Genio Academy — Plataforma de Aprendizaje Incremental para la ESO

> **Repositorio GitHub:** https://github.com/Cristina2M/GenioAcademy  
> **Versión del documento:** Hito V completado  
> **Fecha:** Abril 2026

---

## ÍNDICE

1. [Anteproyecto Actualizado](#1-anteproyecto-actualizado)
2. [Objetivos y Justificación del Proyecto](#2-objetivos-y-justificación-del-proyecto)
3. [Modelo Entidad-Relación](#3-modelo-entidad-relación)
4. [Modelo de Clases y Casos de Uso](#4-modelo-de-clases-y-casos-de-uso)
5. [Tecnologías Empleadas](#5-tecnologías-empleadas)
6. [Manual de Usuario](#6-manual-de-usuario)
7. [Plan de Negocio](#7-plan-de-negocio)
8. [Diapositivas para la Exposición (Guión)](#8-diapositivas-para-la-exposición-guión)
9. [Enlace al Código en GitHub](#9-enlace-al-código-en-github)

---

## 1. Anteproyecto Actualizado

### Descripción General

**Genio Academy** es una plataforma de academia online diseñada específicamente para estudiantes de la ESO (Educación Secundaria Obligatoria). A diferencia de las plataformas de e-learning tradicionales (como Udemy o Khan Academy), Genio Academy organiza el contenido por **niveles de conocimiento progresivos** y no por cursos académicos, permitiendo un aprendizaje personalizado donde el alumno avanza a su propio ritmo desbloqueando contenido conforme su nivel real lo permite.

La plataforma combina tres pilares innovadores:
- 🎮 **Gamificación tipo RPG:** El alumno sube de nivel, acumula XP y elige avatares de búho.
- 🤖 **Tutor IA (Astro):** Un asistente socrático basado en inteligencia artificial que guía sin dar las respuestas directas.
- 🪐 **Mecánica Roguelike de Vidas:** Los alumnos disponen de 3 "planetas" (vidas) que se pierden al fallar evaluaciones y se regeneran con el tiempo o mediante minijuegos educativos.

### Estado de desarrollo por Hitos

| Hito | Descripción | Estado |
|------|-------------|--------|
| I | Fundamentos e Infraestructura DevOps | ✅ Completado |
| II | Backend y Base de Datos | ✅ Completado |
| III | Frontend y Experiencia de Usuario | ✅ Completado |
| IV | Integración de Inteligencia Artificial (Astro) | ✅ Completado |
| V | Sistema de Vidas y Minijuegos Roguelike | ✅ Completado |
| VI | Catálogo de Profesores y Videoconferencias | 🔄 En desarrollo |
| VII | Calidad, Contenido y Despliegue Final | 🔴 Planificado |

---

## 2. Objetivos y Justificación del Proyecto

### Problemática Detectada

En el sistema educativo español, los alumnos de la ESO se enfrentan a dos problemas interrelacionados:

1. **Brecha de motivación:** Las plataformas digitales de estudio son percibidas como aburridas y poco interactivas, lo que dificulta el hábito de estudio autónomo.
2. **Ritmo único:** Las aulas presenciales avanzan a un ritmo que no se adapta a las necesidades individuales. Un alumno brillante en matemáticas puede estar rezagado en lengua, pero el sistema le obliga a avanzar en bloque.

### Solución Propuesta

Genio Academy aborda estos problemas con un enfoque triple:

**Aprendizaje incremental personalizado:** El contenido está organizado por niveles de dificultad dentro de cada asignatura. El alumno solo accede al siguiente nivel cuando ha demostrado dominar el anterior, emulando la mecánica de los videojuegos de rol (RPG).

**Gamificación real (no cosmética):** Los elementos de juego (XP, niveles, avatares, vidas) no son simples decoraciones. Tienen peso real sobre la experiencia: perder una vida limita el acceso y obliga a reflexión, ganar XP desbloquea contenido y el avatar representa el progreso real del alumno.

**Tutor inteligente accesible:** El asistente Astro (basado en Groq Cloud con el modelo LLaMA 3.1) actúa como un tutor socrático disponible 24/7, adaptando sus respuestas al contexto de la lección que está estudiando el alumno. No da las respuestas directas, sino que guía el razonamiento.

### Objetivos Específicos

- Desarrollar una plataforma web funcional, segura y escalable con arquitectura de microservicios.
- Implementar un sistema de autenticación seguro mediante tokens JWT.
- Crear un motor de lógica educativa que controle el acceso a contenido según el nivel real del alumno.
- Integrar un asistente de inteligencia artificial contextual y socrático.
- Diseñar una experiencia de gamificación que incentive la constancia y penalice la pasividad.
- Ofrecer tres planes de suscripción diferenciados con funcionalidades exclusivas por nivel.

---

## 3. Modelo Entidad-Relación

### Entidades Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        MODELO E-R SIMPLIFICADO                   │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐        ┌──────────────────┐
  │  CustomUser  │        │     Category     │
  ├──────────────┤        ├──────────────────┤
  │ id (PK)      │        │ id (PK)          │
  │ username     │        │ name             │
  │ email        │        │ description      │
  │ password     │        └────────┬─────────┘
  │ subscription_│                 │ 1:N
  │   level      │        ┌────────▼─────────┐
  │ experience_  │        │  KnowledgeLevel  │
  │   points     │        ├──────────────────┤
  │ current_     │        │ id (PK)          │
  │   student_   │        │ category (FK)    │
  │   level      │        │ name             │
  │ selected_    │        │ order            │
  │   avatar     │        └────────┬─────────┘
  │ lives_count  │                 │ 1:N
  │ last_life_   │        ┌────────▼─────────┐
  │   lost_at    │        │      Course      │
  └──────┬───────┘        ├──────────────────┤
         │                │ id (PK)          │
         │                │ knowledge_level  │
         │ N:M            │   (FK)           │
         │ (via           │ title            │
         │ CourseComplete)│ description      │
         │                │ xp_reward        │
         │                └────────┬─────────┘
         │                         │ 1:N
  ┌──────▼───────┐        ┌────────▼─────────┐
  │CourseCompletion│       │      Lesson      │
  ├──────────────┤        ├──────────────────┤
  │ id (PK)      │        │ id (PK)          │
  │ user (FK)    │        │ course (FK)      │
  │ course (FK)  │        │ title            │
  │ completed_at │        │ content          │
  └──────────────┘        │ order            │
                          └────────┬─────────┘
  ┌──────────────┐                 │ 1:N
  │ MinigameLog  │        ┌────────▼─────────┐
  ├──────────────┤        │     Exercise     │
  │ id (PK)      │        ├──────────────────┤
  │ user (FK)    │        │ id (PK)          │
  │ minigame_id  │        │ lesson (FK)      │
  │ played_at    │        │ question         │
  └──────────────┘        │ options (JSON)   │
                          │ correct_answer   │
                          └──────────────────┘
```

### Relaciones Clave

| Relación | Tipo | Descripción |
|----------|------|-------------|
| CustomUser → CourseCompletion | 1:N | Un alumno puede completar muchos cursos |
| Course → CourseCompletion | 1:N | Un curso puede ser completado por muchos alumnos |
| CustomUser → MinigameLog | 1:N | Un alumno puede tener muchos registros de minijuego |
| Category → KnowledgeLevel | 1:N | Una asignatura tiene varios niveles de dificultad |
| KnowledgeLevel → Course | 1:N | Un nivel contiene varios cursos |
| Course → Lesson | 1:N | Un curso tiene varias lecciones |
| Lesson → Exercise | 1:N | Una lección tiene varios ejercicios tipo test |

### Restricciones de Integridad

- La combinación `(user, course)` en `CourseCompletion` es **UNIQUE** — impide el farmeo de XP.
- `lives_count` nunca puede superar `MAX_LIVES = 3`.
- `subscription_level` solo acepta valores 1, 2 o 3 (IntegerChoices de Django).

---

## 4. Modelo de Clases y Casos de Uso

### Arquitectura de Capas (Backend)

```
┌──────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN               │
│              (Django REST Framework API)               │
│                                                        │
│  users/views.py     courses/views.py    ai/views.py   │
│  ├── RegisterView   ├── CategoryViewSet ├── ChatView   │
│  ├── LoginView      ├── CourseViewSet   └──────────   │
│  ├── LivesView      └── LessonViewSet                 │
│  ├── DecreaseLivesView                               │
│  └── MinigamePlayView                                │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                    CAPA DE LÓGICA                      │
│                                                        │
│  sync_lives(user)    → Motor de regeneración pasiva   │
│  MyTokenObtainPair   → JWT enriquecido con RPG data   │
│  UserSerializer      → Transforma User ↔ JSON        │
│  SYSTEM_PROMPT       → Instrucciones de Astro (IA)   │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│                    CAPA DE DATOS                       │
│              (PostgreSQL + Django ORM)                 │
│                                                        │
│  CustomUser  KnowledgeLevel  Course  Lesson           │
│  Category    Exercise        CourseCompletion         │
│  MinigameLog                                          │
└──────────────────────────────────────────────────────┘
```

### Casos de Uso Principales

#### CU-01: Registro de alumno
- **Actor:** Visitante
- **Descripción:** El usuario selecciona un plan de suscripción (1, 2 o 3), introduce username, email y contraseña. El sistema crea la cuenta con 3 vidas, 0 XP y el avatar `buho1`.
- **Resultado:** Alumno registrado, redirige al login.

#### CU-02: Login y sesión JWT
- **Actor:** Alumno registrado
- **Descripción:** Introduce credenciales. El backend valida y emite un par de tokens JWT (access + refresh) con los datos de gamificación del alumno embebidos.
- **Resultado:** Alumno conectado, redirigido al Dashboard.

#### CU-03: Explorar el catálogo de cursos
- **Actor:** Alumno conectado
- **Descripción:** El alumno ve las asignaturas organizadas por niveles. Los niveles que superan su nivel RPG actual aparecen bloqueados con candado y mensaje explicativo.
- **Resultado:** Alumno accede solo al contenido que le corresponde.

#### CU-04: Completar un curso (ganar XP)
- **Actor:** Alumno conectado (Plan 1, 2 o 3)
- **Descripción:** El alumno ve la teoría de las lecciones, completa los quiz y finalmente pulsa "Completar Misión". El backend valida que no lo haya completado antes, suma los XP y comprueba si debe subir de nivel RPG.
- **Resultado:** XP sumados, posible subida de nivel, modal de victoria.

#### CU-05: Consultar al tutor Astro (IA)
- **Actor:** Alumno con Plan 2 o Plan 3
- **Descripción:** Dentro del reproductor de curso, el alumno escribe su duda en el chat. El backend construye un mensaje con el contexto de la lección y lo envía a la API de Groq (modelo LLaMA 3.1). Astro responde de forma socrática.
- **Resultado:** Respuesta educativa sin revelar la solución directa.
- **Restricción:** Acceso denegado (403) para Plan 1.

#### CU-06: Sistema de vidas y pérdida de planeta
- **Actor:** Alumno conectado (cualquier plan)
- **Descripción:** Al fallar una evaluación se llama al endpoint `POST /api/users/lives/decrease/`. Se resta 1 vida y se inicia el reloj de regeneración si no estaba corriendo.
- **Resultado:** El panel de vidas se actualiza en tiempo real.

#### CU-07: Recuperar vida mediante minijuego de rescate
- **Actor:** Alumno con **Plan 3 (Agujero de Gusano)** y 0 vidas.
- **Descripción:** Cuando el alumno agota sus 3 planetas, se desbloquea el panel de rescate. El alumno debe superar uno de los 5 minijuegos (Parejas, Cálculo, Sopa, Completar o Verdadero/Falso). El sistema valida que el alumno tenga el Plan 3 y que no haya jugado a ese minijuego específico en las últimas 24 horas.
- **Resultado:** Si el alumno gana, recupera 1 planeta de forma inmediata.
- **Restricción:** Exclusivo de Plan 3. Solo disponible con 0 vidas. Cooldown de 24 horas por cada minijuego.

#### CU-08: Cambio de avatar
- **Actor:** Alumno conectado
- **Descripción:** Desde el panel de perfil, el alumno selecciona un búho desbloqueado según su nivel. El backend actualiza el campo `selected_avatar` y genera un nuevo token JWT con el avatar actualizado para que la navbar se refresque al instante.

---

## 5. Tecnologías Empleadas

### Infraestructura y DevOps

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Docker** | Latest | Contenerización de servicios |
| **Docker Compose** | v3+ | Orquestación de los 3 contenedores |
| **Git** | Latest | Control de versiones |
| **GitHub** | — | Repositorio remoto y protección de ramas |

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Python** | 3.11 | Lenguaje principal del backend |
| **Django** | 5.x | Framework web y ORM |
| **Django REST Framework** | Latest | Construcción de la API REST |
| **Simple JWT** | Latest | Autenticación con JSON Web Tokens |
| **django-cors-headers** | Latest | Política CORS entre frontend y backend |
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
| **Vite** | Latest | Bundler ultrarrápido para React |
| **React Router DOM** | v6 | Enrutamiento de página única (SPA) |
| **Axios** | Latest | Cliente HTTP con interceptores automáticos de JWT |
| **Tailwind CSS** | v4 | Motor de estilos basado en utilidades |
| **DaisyUI** | Latest | Componentes preestilizados (botones, modales...) |
| **Lucide React** | Latest | Librería de iconos SVG |

### Inteligencia Artificial

| Tecnología | Modelo | Uso |
|-----------|--------|-----|
| **Groq Cloud** | `llama-3.1-8b-instant` | Motor LLM para el tutor Astro |

### Decisiones Arquitectónicas Destacadas

- **JWT enriquecido:** En lugar de consultar la API en cada cambio de página, los datos de gamificación (XP, nivel, avatar, plan) se inyectan directamente dentro del token JWT. Esto elimina peticiones innecesarias y hace la aplicación más rápida.
- **Regeneración de vidas sin Celery:** En lugar de usar un servidor de tareas en segundo plano (Celery + Redis), la regeneración pasiva se calcula al vuelo cuando el alumno hace cualquier petición al servidor, comparando `timezone.now()` con `last_life_lost_at`. Esto ahorra recursos de servidor considerablemente.
- **Polling + Reloj local en el Frontend:** El panel de vidas usa dos temporizadores independientes: uno que hace polling al servidor cada 5 segundos (fuente de verdad) y otro que decrementa el contador localmente cada segundo (fluidez visual). Esto evita que el temporizador se quede "pillado" en 0.

---

## 6. Manual de Usuario

### 6.1 Registro

1. Accede a la página principal en `http://localhost:5173`.
2. Pulsa **"Comenzar Misión"** o **"Registrarse"**.
3. Selecciona tu **Plan de Suscripción** (puedes cambiarlo más adelante):
   - **Órbita Base (6,99€/mes):** Acceso a teoría y quiz. Sin IA.
   - **Velocidad Luz (12,99€/mes):** Todo lo anterior + Tutor Astro (IA).
   - **Agujero de Gusano (24,99€/mes):** Todo lo anterior + Minijuegos de rescate + Tutorías con profesor.
4. Rellena tus datos: nombre de usuario, email y contraseña.
5. Pulsa **"Finalizar Misión de Registro"**.

### 6.2 Dashboard (Panel de Control)

Tras conectarte verás tu **centro de mando personal**:

- **Barra superior:** Tu avatar de búho, nombre, nivel RPG actual y barra de progreso de XP.
- **Operación Principal:** La misión/curso que tienes pendiente o el último que visitaste.
- **Vitrina de Reconocimientos:** Los logros que has desbloqueado.
- **Misiones Diarias:** Objetivos del día con XP extra.

### 6.3 Catálogo de Cursos

En la sección **"Catálogo"** verás todas las asignaturas organizadas por niveles:

- 🟢 **Disponible:** Puedes entrar y estudiar este nivel.
- 🔒 **Bloqueado:** Tu nivel RPG actual es inferior al requerido. Sigue acumulando XP para desbloquearlo.

### 6.4 Reproductor de Curso (CoursePlayer)

Al entrar en un curso verás:

- **Columna izquierda:** El contenido de la lección activa. Alterna entre la pestaña **"Manual Teórico"** (la explicación escrita) y **"Simulador de Prueba"** (el quiz interactivo).
- **Columna derecha (Sidebar):**
  - Lista de lecciones del curso.
  - Botón para completar el curso (solo da XP la primera vez).
  - **Panel de Planetas 🪐:** Muestra tus vidas actuales y el tiempo de regeneración.
  - **Chat de Astro 🦉:** Disponible para Plan 2 y Plan 3.

### 6.5 Tutor Astro (IA)

- Escribe tu duda en el campo de texto y pulsa el botón de envío.
- **Astro explicará los conceptos teóricos** si le preguntas qué es algo.
- **Astro NO te dará la respuesta directa** si le preguntas por la solución de un problema concreto — te guiará para que la descubras tú.
- El historial de conversación se mantiene durante la sesión.

### 6.6 Sistema de Planetas (Vidas)

- Tienes **3 planetas** como máximo.
- Pierdes 1 planeta al fallar una evaluación.
- Los planetas se **regeneran solos** (cada 2 horas en producción).
- Si llegas a **0 planetas** y eres del **Plan 3 (Agujero de Gusano)**, se desbloquean los **Minijuegos de Rescate**.

### 6.7 Minijuegos de Rescate (Exclusivo Plan 3)

Esta funcionalidad está diseñada para que los alumnos más avanzados puedan volver a la acción sin esperar la regeneración pasiva de 2 horas. 

**Requisitos:** Tener 0 vidas actuales y suscripción "Agujero de Gusano".

1.  **Selección**: Elige uno de los 5 sectores de rescate disponibles:
    -   **Parejas de Astro**: Encuentra los búhos idénticos para sincronizar la memoria del sistema.
    -   **Cálculo Mental**: Resuelve operaciones aritméticas rápidas en el menor tiempo posible.
    -   **Sopa de Letras**: Localiza conceptos clave del temario en un panel de datos.
    -   **Completar Palabra**: Adivina la palabra técnica que restablecerá el núcleo del planeta.
    -   **Verdadero o Falso**: Supera una ráfaga de afirmaciones bajo presión extrema.
2.  **Victoria**: Al completar el juego con éxito, recuperas 1 planeta al instante.
3.  **Bloqueo de Seguridad (Cooldown)**: Cada minijuego tiene un periodo de enfriamiento de 24 horas. Una vez usado para recuperar una vida, ese juego específico no estará disponible hasta el día siguiente.
4.  **Uso Único**: Solo puedes realizar 1 rescate por "ronda". Al recuperar 1 vida, los minijuegos vuelven a bloquearse hasta que vuelvas a tener 0 vidas.

### 6.8 Galería de Avatares (Búhos)

- Desde tu perfil, puedes ver los 10 búhos disponibles.
- Cada búho se desbloquea al alcanzar su nivel RPG correspondiente.
- El búho activo aparecerá en el chat de Astro y en la barra de navegación.

### 6.9 Panel de Administración (Solo Administrador)

- Accede en `http://localhost:8000/admin/` con las credenciales de superusuario.
- Desde aquí puedes crear/editar: Categorías, Niveles de Conocimiento, Cursos, Lecciones y Ejercicios.
- Ver los alumnos registrados y su progreso.

---

## 7. Plan de Negocio

### Modelo de Monetización: SaaS por Suscripción

Genio Academy opera bajo un modelo de **Software as a Service (SaaS)** con tres niveles de acceso:

| Plan | Nombre | Precio | Características |
|------|--------|--------|-----------------|
| 1 | **Órbita Base** | 6,99€/mes | Teoría completa + Quiz interactivos + Sistema de niveles RPG |
| 2 | **Velocidad Luz** | 12,99€/mes | Todo el Plan 1 + Tutor IA Astro disponible 24/7 |
| 3 | **Agujero de Gusano** | 24,99€/mes | Todo el Plan 2 + Minijuegos de rescate + Tutorías profesores (Hito VI) |

### Segmento de Mercado Objetivo

- **Primario:** Alumnos de la ESO (12-16 años) con dificultades de auto-organización del estudio.
- **Secundario:** Padres que buscan herramientas de apoyo académico digital para sus hijos.
- **Terciario:** Centros educativos que podrían adoptar la plataforma como herramienta complementaria.

### Ventaja Competitiva

| Característica | Genio Academy | Khan Academy | Duolingo |
|---------------|---------------|--------------|----------|
| Contenido adaptado a ESO española | ✅ | ❌ | ❌ |
| Tutor IA socrático contextual | ✅ | ❌ | ✅ |
| Gamificación real con consecuencias | ✅ | ❌ | ✅ |
| Bloqueo de contenido por nivel real | ✅ | ❌ | ✅ |
| Planes de pago progresivos | ✅ | ❌ | ✅ |
| Tutorías con profesor real | ✅ (Hito VI) | ❌ | ❌ |

### Proyección de Costes (Operativos Mensuales Estimados)

| Concepto | Coste Estimado |
|----------|---------------|
| Servidor VPS (2 vCPU, 4GB RAM) | ~15€/mes |
| API Groq Cloud (según uso) | ~0-20€/mes |
| Dominio y certificado SSL | ~1€/mes |
| **Total operativo** | **~35€/mes** |

Con solo **5 suscriptores del Plan 1**, el coste operativo estaría cubierto.

### Estrategia de Crecimiento

1. **Fase 1 (Lanzamiento):** Oferta de precio fundador para los primeros 100 alumnos.
2. **Fase 2 (Escala):** Integración de contenido generado por la IA (ejercicios automáticos por lección) para reducir el coste de producción de contenido.
3. **Fase 3 (B2B):** Licencias para centros educativos con panel de control para profesores y métricas de progreso por clase.

---

## 8. Diapositivas para la Exposición (Guión)

### Diapositiva 1 — Portada
**"Genio Academy: El videojuego de estudiar"**
_Tu plataforma de aprendizaje para la ESO. Sube de nivel. Domina el cosmos._

### Diapositiva 2 — El problema
- El 68% de los estudiantes de secundaria no tiene hábitos de estudio autónomo.
- Las plataformas actuales son o caras, o no están adaptadas al currículo español.
- Los alumnos estudian para el examen, no para aprender de verdad.

### Diapositiva 3 — Nuestra solución
- Aprendizaje incremental que **bloquea el contenido superior hasta que el alumno lo merece**.
- Gamificación con consecuencias reales: XP, niveles y planetas (vidas).
- Tutor IA socrático que enseña a pensar, no a copiar respuestas.

### Diapositiva 4 — ¿Cómo funciona? (Demo en vivo)
_[Mostrar el flujo: Registro → Dashboard → Catálogo → CoursePlayer → Chat de Astro → Panel de Vidas]_

### Diapositiva 5 — Arquitectura técnica
- 3 microservicios en Docker: Frontend (React), Backend (Django), BD (PostgreSQL).
- API REST con autenticación JWT.
- IA en la nube (Groq + LLaMA 3.1) sin saturar nuestro servidor.

### Diapositiva 6 — Modelo E-R (mostrar diagrama de la sección 3)

### Diapositiva 7 — El sistema "Roguelike"
- 3 planetas = 3 vidas.
- Perder un planeta al fallar → Regeneración cada 2h.
- Game Over → Minijuegos educativos de rescate (solo Plan 3).
- Mecánica inspirada en Duolingo pero con mayor impacto pedagógico.

### Diapositiva 8 — Plan de negocio
_[Mostrar tabla de planes de la sección 7]_

### Diapositiva 9 — Hoja de ruta futura
- Hito V: Sistema de vidas + 5 minijuegos (Completado).
- Hito VI: Catálogo de profesores + Videoconferencias (En desarrollo).
- Hito VII: Contenido real ESO + Despliegue en producción.

### Diapositiva 10 — Conclusión
**"Estudiar es el único juego en el que ganar de verdad cambia tu vida."**
- Stack moderno, escalable y documentado.
- GitHub: https://github.com/Cristina2M/GenioAcademy

---

## 9. Enlace al Código en GitHub

🔗 **Repositorio principal:** https://github.com/Cristina2M/GenioAcademy

### Estructura de Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Versión estable y revisada de producción |
| `develop` | Integración continua de todas las features revisadas |
| `feature/IA` | Integración del tutor Astro (Completado) |
| `feature/vidas` | Sistema de vidas Roguelike y minijuegos (Completado) |
| `feature/reproductorCursos` | Entorno de estudio y visualización de lecciones (Completado) |
| `feature/Catalogo` | Motor de búsqueda y filtrado de contenido educativo |
| `feature/motorLogica` | Algoritmos de gamificación y progresión incremental |
| `feature/panelEstudiante` | Dashboard y visualización de progreso del alumno |
| `feature/mision` | Desarrollo de la lógica de misiones diarias |
| `feature/home-v2` | Rediseño de la landing page (Capitán Galáctico) |
| `feature/autenticacionFrontend` | Sistema de login, registro y tokens JWT |
| `feature/backendV1` | Desarrollo inicial del núcleo del servidor Django |
| `feature/frontendV1` | Arquitectura base del cliente React |
| `feature/frontend` | Versión preliminar del entorno de usuario |
| `feature/bd` | Modelado y configuración de bases de datos PostgreSQL |
| `feature/docs` | Rama dedicada a la redacción de documentación técnica |
| `release/hito-3` | Snapshot estable del Hito III |
| `release/backend` | Estabilización de servicios de servidor |
| `release/revision2` | Ajustes finales de Calidad (QA) y corrección de bugs |

### Comandos Rápidos para Ejecutar el Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/Cristina2M/GenioAcademy.git
cd GenioAcademy

# Crear el archivo de variables de entorno (backend/.env)
# Con: GROQ_API_KEY=tu_clave_aqui

# Levantar todos los servicios
docker-compose up --build

# Primera ejecución: poblar la base de datos
docker-compose exec backend python manage.py migrate
docker-compose exec backend python seed_data.py

# Crear cuenta de administrador
docker-compose exec backend python manage.py createsuperuser
```

**Accesos locales:**
- Frontend (alumno): http://localhost:5173
- Backend API: http://localhost:8000/api/
- Panel de Admin: http://localhost:8000/admin/

---

_Documentación generada en Abril 2026. Proyecto en desarrollo activo._
