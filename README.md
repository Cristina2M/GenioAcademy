# 🚀 Genio Academy — Plataforma de Aprendizaje Incremental

[![CI/CD Pipeline](https://github.com/Cristina2M/GenioAcademy/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Cristina2M/GenioAcademy/actions/workflows/ci-cd.yml)

**Genio Academy** es una plataforma de academia online que desarrollé como Proyecto de Fin de Ciclo del Grado Superior de Desarrollo de Aplicaciones Web. Está pensada específicamente para estudiantes de la ESO y organiza el contenido por **niveles de conocimiento progresivos** en lugar de seguir el esquema tradicional de cursos por edad, lo que permite un aprendizaje personalizado y adaptativo.

La plataforma incluye un sistema de **gamificación tipo RPG** (XP, niveles, vidas Roguelike), **minijuegos educativos** de recuperación de planetas, un **tutor virtual socrático con IA** (Groq / LLaMA 3.1), un **claustro interactivo** de profesores y **videollamadas de tutoría en directo** vía Jitsi Meet.

> 📺 **Presentación oficial:** [Ver Diapositivas en Canva](https://canva.link/76zised6tl9vdk2)

> ⚠️ **Nota para desarrolladores:** Los comandos de Django (`manage.py migrate`, etc.) deben ejecutarse **dentro del contenedor activo** con `docker exec genioacademy-backend-1 python manage.py <comando>`.

---

## 🌍 Demo en Producción

La plataforma está desplegada y accesible en:

- **Frontend (alumnos):** [https://cristina2daw.es](https://cristina2daw.es)
- **Backend API:** [https://api.cristina2daw.es](https://api.cristina2daw.es)
- **Panel de Administración:** [https://api.cristina2daw.es/admin/](https://api.cristina2daw.es/admin/)

---

## 🏗️ Arquitectura del Sistema

El proyecto usa una arquitectura de **microservicios Docker** orquestados con **Kubernetes (K3s)** sobre una instancia EC2 de AWS:

1. **Infraestructura (AWS EC2 t3.medium):** Una sola instancia con IP Elástica ejecutando K3s.
2. **Frontend:** NGINX sirviendo la SPA compilada con React + Vite. Dominio: `cristina2daw.es`
3. **Backend:** Gunicorn con 3 workers ejecutando Django + Django REST Framework. Dominio: `api.cristina2daw.es`
4. **Base de Datos:** PostgreSQL con PersistentVolume de 5 GB para que los datos sobrevivan reinicios de pod.
5. **Enrutamiento y SSL:** Traefik como Ingress Controller (incluido en K3s) + `cert-manager` con Let's Encrypt para certificados HTTPS automáticos y gratuitos.
6. **Réplicas:** Frontend y backend desplegados con 2 réplicas cada uno. Si un pod falla, Kubernetes redirige el tráfico al otro mientras levanta uno nuevo.
7. **DNS:** Tres registros A en IONOS apuntando a la IP Elástica: `cristina2daw.es`, `www.cristina2daw.es` y `api.cristina2daw.es`.

---

## 🔄 CI/CD con GitHub Actions

Cada push a `main` dispara el pipeline `.github/workflows/ci-cd.yml`, que tiene tres etapas:

1. **Testing:** Levanta un servicio PostgreSQL temporal en los servidores de GitHub y ejecuta los tests de Django. Si alguno falla, el pipeline se detiene y no despliega nada.
2. **Build & Push:** Si los tests pasan, construye las imágenes Docker multiplataforma y las sube a Docker Hub (`cristina2m/genio-backend` y `cristina2m/genio-frontend`).
3. **Deploy:** Se conecta vía SSH a la instancia EC2 y ejecuta un `rollout restart` en Kubernetes, actualizando los pods sin tiempo de inactividad (Zero Downtime Deployment).

Como paso adicional, el pipeline genera la documentación técnica del código Python con **pdoc** y la guarda como artefacto descargable de la ejecución.

---

## 🔐 Variables de Entorno (.env)

Los secretos no están en el repositorio. El archivo `backend/.env` debe contener:

```
SECRET_KEY=una_clave_secreta_larga_y_aleatoria
POSTGRES_DB=genio_db
POSTGRES_USER=genio_user
POSTGRES_PASSWORD=genio_pass
GROQ_API_KEY=tu_clave_de_groq_aqui
```

En producción, estas variables se inyectan como `Secret` resources de Kubernetes, sin necesidad del archivo `.env`.

> Para generar una `SECRET_KEY` válida: `python -c "import secrets; print(secrets.token_hex(50))"`

---

## 🧪 Cuentas de Prueba

El sistema acepta tanto el nombre de usuario como el email para iniciar sesión (login dual).

| Tipo | Usuario | Contraseña | Qué puede hacer |
|---|---|---|---|
| Alumno Plan 1 | `alumno1` | `alumno123` | Teoría y quiz básico |
| Alumno Plan 2 | `alumno2` | `alumno123` | Lo anterior + tutor Astro IA |
| Alumno Plan 3 | `alumno3` | `alumno123` | Todo: minijuegos, tutorías en vivo |
| Profesor (Matemáticas) | `aris.thorne` | `Genio2026!` | Panel docente y consultas |
| Superusuario | `admin` | `admin123` | Panel de administración Django |

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cristina2M/GenioAcademy.git
cd GenioAcademy

# 2. Crear el archivo de variables de entorno (ver sección anterior)
# Crear backend/.env con los valores correspondientes

# 3. Levantar todos los servicios (la primera vez tarda unos minutos)
docker-compose up --build

# 4. En OTRA terminal: aplicar migraciones
docker exec genioacademy-backend-1 python manage.py migrate

# 5. Crear el superusuario
docker exec genioacademy-backend-1 python manage.py createsuperuser

# 6. Sembrar la base de datos con categorías y cursos
docker exec genioacademy-backend-1 python manage.py shell < seed_data.py

# 7. Añadir lecciones y ejercicios
docker exec genioacademy-backend-1 python manage.py seed_exercises

# 8. Sembrar el claustro de profesores
docker exec genioacademy-backend-1 python manage.py shell < seed_teachers.py

# 9. Crear cuentas de usuario para los profesores
docker exec genioacademy-backend-1 python manage.py shell < seed_teacher_users.py
```

**Accesos locales:**
- Plataforma: http://localhost:5173
- API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/

> El nombre `genioacademy-backend-1` lo genera Docker Compose a partir del nombre de la carpeta. Si es distinto, compruébalo con `docker ps`.

---

## 🛠️ Comandos útiles del día a día

### Gestión de contenedores (Docker)
```bash
docker-compose up --build      # Levantar y reconstruir imágenes
docker-compose up              # Levantar sin reconstruir
docker-compose down            # Parar sin borrar datos
docker-compose down -v         # ⚠️ Parar Y borrar la base de datos
docker-compose logs -f backend # Ver logs del backend en tiempo real
docker-compose restart backend # Reiniciar solo el backend
```

### Comandos Django (dentro del contenedor)
```bash
docker exec genioacademy-backend-1 python manage.py migrate
docker exec genioacademy-backend-1 python manage.py makemigrations
docker exec genioacademy-backend-1 python manage.py createsuperuser
docker exec genioacademy-backend-1 python manage.py shell < seed_data.py
docker exec genioacademy-backend-1 python manage.py seed_exercises
docker exec genioacademy-backend-1 python manage.py shell < seed_teachers.py
```

### Git (flujo habitual)
```bash
git status
git add -A && git commit -m "descripción del cambio"
git push origin <nombre-de-la-rama>
git checkout main && git merge <rama> --no-ff -m "Merge <rama>: descripción"
```

---

## 📑 Hitos del Proyecto

| Hito | Descripción | Estado |
|------|-------------|--------|
| I | Fundamentos e Infraestructura DevOps (Docker, estructura inicial) | ✅ |
| II | Backend y Base de Datos (Django, PostgreSQL, API REST) | ✅ |
| III | Frontend y Experiencia de Usuario (React, diseño, páginas) | ✅ |
| IV | Integración de Inteligencia Artificial (tutor Astro con Groq) | ✅ |
| V | Sistema de Vidas y Minijuegos Roguelike | ✅ |
| VI | Catálogo de Profesores y Videoconferencias Jitsi | ✅ |
| VII | Correcciones generales, contenido educativo y documentación | ✅ |
| **+** | **Despliegue en producción y estabilización final** | ✅ |

---

## 🌿 Estrategia de Ramas (Git Flow)

### Ramas principales
| Rama | Propósito |
|---|---|
| `main` | Código estable y validado, listo para producción |
| `develop` | Rama de integración donde convergen las features terminadas |

### Ramas de Release
| Rama | Qué contiene |
|---|---|
| `release/backend` | Primera versión estable del backend Django + DRF |
| `release/hito-3` | Cierre del Hito III: frontend completo conectado al backend |
| `release/revision2` | Segunda ronda de revisión general |
| `release/correccionesGenerales` | Limpieza de código, españolización de variables y comentarios |
| `release/contenido` | Expansión del catálogo educativo y estabilización final |

### Ramas de Feature (orden cronológico)
| Rama | Funcionalidad |
|---|---|
| `feature/bd` | Modelado inicial de la base de datos |
| `feature/backendV1` | Primera versión del backend: API REST y serializadores |
| `feature/motorLogica` | Motor de XP, subida de nivel y bloqueo 403 |
| `feature/autenticacionFrontend` | Login/registro en React conectado al JWT del backend |
| `feature/frontend` | Estructura de páginas y enrutamiento SPA |
| `feature/frontendV1` | Primera versión estable del cliente React |
| `feature/home-v2` | Rediseño de la landing page con estética espacial |
| `feature/panelEstudiante` | Dashboard del alumno: avatar, XP, misión sugerida y medallas |
| `feature/reproductorCursos` | CoursePlayer: teoría, simulador y sidebar de lecciones |
| `feature/Catalogo` | Catálogo Estelar con filtros por materia y nivel |
| `feature/mision` | Página de planes y precios |
| `feature/IA` | Tutor Astro: proxy backend + chat socrático + AIChatPanel.jsx |
| `feature/vidas` | Sistema Roguelike: planetas, regeneración pasiva y 5 minijuegos |
| `feature/claustro` | Catálogo público de profesores con cards animadas y modal de CV |
| `feature/interfaz-profesor` | Panel docente: bandeja de consultas y tabla de alumnos |
| `feature/tutorias` | Tutorías: modal, Jitsi Meet, notificaciones en tiempo real |
| `feature/microcursos` | Expansión del catálogo con más cursos por materia |
| `feature/contenido-formateado` | Soporte de HTML enriquecido en lecciones |
| `feature/docs` | Primera versión de la documentación técnica |
| `feature/docs2` | Segunda actualización de documentación y estabilización |

---

## 🔌 Endpoints Principales de la API REST

### Sesión y Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/token/` | Login dual (email o username): devuelve tokens JWT |
| `POST` | `/api/token/refresh/` | Renovación silenciosa del token de acceso |
| `POST` | `/api/users/register/` | Registro de nuevo alumno |

### Gamificación (Vidas y Minijuegos)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/users/lives/` | 🔒 Autenticado | Estado de planetas y cooldowns |
| `POST` | `/api/users/lives/decrease/` | 🔒 Autenticado | Restar 1 planeta al fallar una evaluación |
| `POST` | `/api/users/minigames/play/` | 🔒 Plan 3 | Validar victoria en minijuego y recuperar 1 planeta |
| `POST` | `/api/users/management/{id}/update_avatar/` | 🔒 Autenticado | Cambiar el avatar del perfil |

### Catálogo Educativo
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/courses/categories/` | 🌐 Público | Árbol completo de asignaturas, niveles y cursos |
| `GET` | `/api/courses/courses/{id}/` | 🔒 Autenticado | Detalle de un curso con lecciones y ejercicios |
| `POST` | `/api/courses/courses/{id}/complete/` | 🔒 Autenticado | Marcar curso como completado y recibir XP |

### Inteligencia Artificial (Astro)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/ai/chat/` | 🔒 Plan 2+ | Enviar mensaje a Astro y recibir respuesta socrática |

### Tutorías y Profesores
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/teachers/professors/` | 🌐 Público | Lista de profesores activos (filtrable por `?course_id`) |
| `POST` | `/api/teachers/consultations/` | 🔒 Plan 3 | Crear solicitud de tutoría con un profesor |
| `POST` | `/api/teachers/consultations/{id}/start_call/` | 🔒 Profesor | Iniciar videollamada Jitsi y notificar al alumno |
| `GET` | `/api/teachers/consultations/active_calls/` | 🔒 Alumno | Comprobar si hay una videollamada activa |
| `GET` | `/api/teachers/consultations/unread_count/` | 🔒 Alumno | Número de respuestas sin leer (badge del Navbar) |

---

## 🎨 Identidad Visual

La interfaz sigue una estética **Dark Glassmorphism** que llamo "Estética Galáctica": fondos oscuros con paneles de cristal semitransparente, efectos de neón índigo y violeta, y la mascota **Astro el Búho** como guía de la plataforma.

- **Tipografía:** Outfit (títulos) + Inter (lectura)
- **Paleta:** Space Black + neón índigo/violeta + verde esmeralda (vidas) + rojo alerta
- **Animaciones:** Framer Motion para modales y transiciones
- **Iconos:** Lucide React

---

## 📋 Detalles Técnicos Destacados

**JWT enriquecido:** El token de login lleva embebidos el nivel RPG, XP, avatar y plan de suscripción del alumno. Así el frontend los lee al instante sin peticiones adicionales.

**Regeneración de vidas sin Celery:** Cuando el alumno consulta sus vidas, la función `sync_lives(user)` calcula cuánto tiempo ha pasado desde la última pérdida y suma los planetas recuperados al vuelo, sin procesos en segundo plano.

**Proxy de IA en el backend:** El frontend nunca llama directamente a Groq. Todas las peticiones pasan por `api/ai/chat/`, donde el backend añade el `SYSTEM_PROMPT` de Astro y la `GROQ_API_KEY` sin exponerla al navegador.

**Zero-Config API:** `axiosInstance.js` detecta el hostname del navegador: si es `localhost` apunta al backend local; si es `cristina2daw.es`, apunta a `api.cristina2daw.es`. Sin configuración manual al desplegar.

**Autenticación dual:** El backend tiene un `EmailOrUsernameBackend` personalizado que acepta tanto el username como el email para iniciar sesión.

**Bloqueo 403 en servidor:** El acceso a cursos de nivel superior no es solo visual. Si alguien intenta acceder directamente a la URL de un curso bloqueado, el backend devuelve `403 Forbidden`.

---

## 💡 Notas de Desarrollo

- **Hot Reload:** Los cambios en CSS y JSX se reflejan al instante gracias a Vite.
- **Españolización del código:** Las variables y funciones propias están en español; las palabras reservadas del framework, en inglés. Así es fácil distinguir qué es lógica propia y qué es del framework.
- **Comentarios en el código:** Todos los archivos tienen comentarios que explican el "por qué" además del "qué". Ejemplo: `// resto la vida aquí y no en el frontend para evitar que se manipule desde el navegador`.
- **Seeds idempotentes:** Los scripts de siembra comprueban antes de insertar para no duplicar registros aunque se ejecuten varias veces.