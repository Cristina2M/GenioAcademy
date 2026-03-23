# 🌌 Genio Academy

Genio Academy es una plataforma educativa de **nueva generación** orientada a alumnos de Educación Secundaria Obligatoria (ESO). Su propósito es revolucionar el sistema tradicional mediante el método de **"Cápsulas de Conocimiento Abiertas"**, permitiendo a cada estudiante avanzar asíncronamente a su propio ritmo sin la presión de un aula, combinando interactividad y asistencia de Inteligencia Artificial ("Búho Estelar").

---

## 🚀 Arquitectura Tecnológica (Tech Stack)

El proyecto está separado en dos ecosistemas que se comunican a través de una **API REST**. Todo está "dockerizado" para una instalación inmediata:

### ⚙️ Backend (El Motor)
*   **Python 3.10**: Lenguaje base.
*   **Django & Django REST Framework (DRF)**: Framework de desarrollo, modelos de datos, enrutamiento y serializadores REST.
*   **PostgreSQL**: Base de datos relacional para usuarios y el Catálogo de Cursos estructurados.
*   **Simple JWT (JSON Web Tokens)**: Tecnología de autenticación y seguridad estandarizada de la industria.

### 🎨 Frontend (La Nave Visual)
*   **Node.js**: Entorno de ejecución subyacente.
*   **React 18 & Vite**: Creación de componentes modulares y el servidor de desarrollo rápido de recarga en caliente (HMR).
*   **Tailwind CSS**: Framework de utilidades para crear la estética espacial de forma rápida (glassmorphism/neon borders).
*   **DaisyUI**: Librería prefigurada de Tailwind para componentes rápidos (botones, "cards" y menús desplegables).
*   **Lucide-React**: Biblioteca de iconos interactivos y limpios de alto rendimiento.

---

## 🛠️ Instalación Rápida y Arranque

Dado que nuestro entorno está configurado usando **Docker Compose**, levantar los tres servicios a la vez (Frontend, Backend, BBDD) requiere literalmente solo un comando.

### Requisitos Previos:
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) (o el daemon de Docker).
- Opcional: Python/Node instalados si quieres desarrollar o ejecutar comandos específicos fuera de contenedores, aunque no es mandatorio.

### Pasos de Lanzamiento:

1. **Inicia los tres servicios en red**:
   Ejecuta el siguiente comando en la ventana principal del repositorio:
   ```bash
   docker-compose up --build
   ```
   > 🔴 *Esto arranca el puerto 8000 para Django API, el 5173 para React, y el 5432 para PostgreSQL de forma vinculada.*

2. **Aplica las Migraciones (Por primera y única vez)**:
   Si es la primera vez que arrancarás el sistema, la base de datos estará vacía y la estructura de Django no existirá. En otra terminal, sincroniza la base de datos ejecutando esta inyección al contenedor:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Puebla el Catálogo Estelar de Cursos (Datos Dummy)**:
   Para no enfrentarte a una página de cursos vacía, tenemos un script (Seed) preconfigurado que inyecta matemáticas, física, y niveles autogenerados. 
   ```bash
   docker-compose exec backend python seed_data.py
   ```

4. **Entra en Navegador**:
   - 🌐 Visual: **[http://localhost:5173/](http://localhost:5173/)**
   - 🔧 Panel Admin Django: **[http://localhost:8000/admin/](http://localhost:8000/admin/)**

---

## 📖 Estructura del Catálogo (Base de Datos)

El modelo en el backend está cuidadosamente jerarquizado (Ver `backend/courses/models.py`) de la siguiente manera:
1. **Category (Categoría Principal):** Ej: Matemáticas.
2. **KnowledgeLevel (Niveles):** Agrupa los cursos (Ej: "Aritmética de Batalla").
3. **Course (MicrosCursos):** Contiene la información general, imagen y estado de publicación de un curso concreto.
4. **Lesson & Exercises:** Módulos teóricos y sus validaciones (Estructura preparada para un progreso en el futuro).

---

## 🛸 Fases Realizadas (Changelog de Historial)
Hasta la fecha, Genio Academy posee:
1. **Contenedores Docker robustos** conectando Frontend con Backend y evitando bloqueos CORS manuales.
2. **Endpoints de API limpios** con autenticación JWT para escalabilidad.
3. **Mapeo de Rutas (React Router)** completamente conectado.
4. **Catálogo Integrado (`Courses.jsx`)**: Pantalla asíncrona que consume e imprime la base de datos de los Cursos.
5. **Estética y Filosofía Completa (`Mission.jsx` & `Home.jsx`)**: Copywriting súper persuasivo destinado originalmente a enganchar y dar confianza a Padres Inconformistas con Landing Pages basadas en transparencias, animaciones y degradados dinámicos.

---

> Hecho con 💖 para transformar el futuro de la educación Secundaria.
