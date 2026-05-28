# Mis Apuntes de correcciones del proyecto

Estas son mis notas sobre las correcciones que he hecho.

---

### 1º Correcciones en Dockers y Servidores
- **En el backend he decidido configurar Gunicorn** porque el servidor por defecto de Django (`runserver`) solo sirve para desarrollo local y en producción se colgaría con más de un usuario. Gunicorn gestiona las peticiones con 3 workers en paralelo para evitar caídas.
  - *Tengo que tener cuidado al configurarlo* con exponer el puerto `8000` en el `Dockerfile.prod` y poner un tiempo de respuesta (*timeout*) de 120 segundos, porque si la API de Groq (la IA) tarda un poco en procesar la consulta, la comunicación con el cliente no se puede cortar antes de tiempo.
- **Para el frontend he puesto Nginx** porque no tiene sentido tener un servidor Node (`npm run dev`) corriendo en producción y gastando memoria RAM. Al compilar con Vite, Nginx simplemente sirve los archivos estáticos resultantes de forma muy eficiente.
  - *Tengo que tener cuidado al configurarlo* con meter la regla `try_files $uri $uri/ /index.html` en el archivo `nginx.conf`. Si no la pongo, cuando un usuario refresque la página del navegador estando dentro de una ruta (como `/dashboard` o `/professors`), Nginx dará un error 404 porque intentará buscar esa carpeta físicamente en el disco en lugar de dejar que sea React Router quien maneje la URL.

---

### 2º Orquestación con Kubernetes
- **He decidido usar Kubernetes (K3s en AWS)** porque me permite monitorizar y balancear los contenedores. He elegido K3s porque consume muchísima menos memoria RAM que EKS y para el laboratorio de AWS me sobra.
  - *Tengo que tener cuidado al configurarlo* con la base de datos PostgreSQL. Como los pods de K8s son volátiles (si se reinician pierden todo), he tenido que configurar un *PersistentVolume* (PV) y un *PersistentVolumeClaim* (PVC) de 5 GB para que los datos de los alumnos, niveles RPG y XP se guarden directamente en el disco de la máquina física de AWS y no se borren nunca al reiniciar el contenedor.
- **He configurado 2 réplicas en el frontend y en el backend** para que la web siga online si un contenedor falla.
  - *Tengo que tener cuidado al configurar* las sondas de salud (*Liveness y Readiness Probes*). Si Django o React dejan de responder, Kubernetes detecta que el pod no está sano, lo mata y redirige el tráfico al otro pod activo mientras levanta uno nuevo limpio.
- **He configurado un Ingress Controller de Nginx** para no usar IPs directas y poder enrutar mis subdominios reales (`cristina2daw.es` y `api.cristina2daw.es`).
  - *Tengo que tener cuidado al configurarlo* con añadir el emisor de certificados de **Cert-Manager** para que Let's Encrypt genere los certificados SSL automáticos y gratuitos. Si no, no funcionará por HTTPS y el navegador bloqueará las llamadas entre el front y la API por seguridad.

---

### 3º Integración Continua (CI/CD) con GitHub Actions
- **He creado un pipeline en GitHub Actions** (`ci-cd.yml`) para pasar las pruebas unitarias y compilar los Dockerfiles automáticamente en cada push a la rama.
  - *Tengo que tener cuidado al configurarlo* con la base de datos de test. Para que las pruebas de Django (`tests.py`) no den error en los servidores temporales de GitHub, el workflow tiene que levantar un servicio Postgres temporal y pasarle las variables de entorno de prueba (`DATABASE_URL`, `SECRET_KEY`, `PRODUCTION=False`). Si me dejo alguna variable, los tests fallarán y bloquearán el despliegue.

---

### 4º Documentación automática
- **He creado el script `generate_docs.sh`** para generar la documentación técnica del código de golpe con un solo comando usando **pdoc** (para backend) y **jsdoc** (para frontend).
  - *Tengo que tener cuidado al ejecutarlo* con que las herramientas estén instaladas localmente en la máquina. El script se encarga de instalarlas y compilar la documentación basada en los comentarios que he puesto en el código, guardando las webs resultantes de forma limpia en la carpeta `/docs`.

---

### 5º El Agente de Inteligencia Artificial (Astro)
- **He reescrito el backend de la IA para usar Groq Tool Calling** porque un chat convencional que solo devuelve texto plano no se considera un agente de Inteligencia Artificial real. Quería que Astro fuera un agente cognitivo de verdad con capacidad de usar herramientas.
  - *Tengo que tener cuidado al configurarlo* con la seguridad de las claves. Mantengo el flujo de "Proxy Seguro" en mi backend Django: el frontend nunca ve la clave secreta de Groq, es el servidor quien inyecta el comportamiento socrático del búho y hace la llamada segura por detrás.
- **Le he programado a Astro dos herramientas específicas**: `consultar_estadisticas_alumno` y `recomendar_ejercicio_refuerzo`.
  - *Tengo que tener cuidado al programarlo* con decodificar los argumentos JSON que devuelve Groq de forma autónoma. El backend recibe la petición de la herramienta, hace la consulta a PostgreSQL y le devuelve a la IA los niveles, XP y vidas del usuario logueado en tiempo real para que responda con conocimiento real del alumno.

---

### 6º Módulo de Diseño
- **He hecho el dossier `dossier_diseno.md`** para la parte teórica y visual de la asignatura.