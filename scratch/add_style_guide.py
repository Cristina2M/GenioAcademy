import re

DOC_PATH = r"c:\Users\crist\OneDrive\Escritorio\PROYECTO-DESARROLLO-WEB\PROYECTO\GenioAcademy\documentacion.md"

with open(DOC_PATH, "r", encoding="utf-8") as f:
    content = f.read()

style_guide_text = """### 5.3 Guía de Estilo y Diseño (UI/UX)

No creé un documento separado para la guía de estilo porque en un proyecto moderno todo esto se define directamente en la configuración de Tailwind CSS (o a través de variables CSS como usa la versión v4). Sin embargo, he seguido una línea de diseño muy clara que llamo **Estética Galáctica (Dark Glassmorphism)**. 

Si tuviera que extraer esa configuración visual a una guía de estilo clásica, sería exactamente esta:

**1. Tipografía (Typography)**
Como uso Tailwind v4 por defecto, la tipografía se apoya en las fuentes de sistema predeterminadas (System Sans-Serif), lo que garantiza que cargue rapidísimo y se vea bien en Windows, Mac o Android sin descargar fuentes externas.
- **Títulos (H1 / H2):** System Sans, Bold (700). Suelo aplicarles degradados dinámicos con `bg-clip-text`.
- **Cuerpo (Párrafos):** System Sans, Regular (400), tamaño base 16px.

**2. Paleta de Colores (Colors)**
Toda la plataforma funciona en un tema oscuro (*dark mode*).
- **Fondos (Backgrounds):** `slate-900` (#0f172a) para simular el espacio profundo, y variaciones de `indigo-950` (#1e1b4b) para zonas de contraste.
- **Acentos Neón (Accents):** 
  - `cyan-400` (#22d3ee): Usado para botones principales y para destacar elementos interactivos positivos.
  - `fuchsia-500` (#d946ef): Usado para botones de riesgo, vidas perdidas, o simplemente para dar contraste llamativo en gradientes.
- **Textos:** Blanco puro (#ffffff) o gris claro (`slate-300` / #cbd5e1) para facilitar la lectura prolongada sin fatiga visual.

**3. Efectos y Componentes (Glassmorphism)**
En Genio Academy casi no uso cajas lisas ni sombras planas. Prefiero el efecto "Cristal":
- **Paneles y Tarjetas:** Tienen fondos semi-transparentes (`bg-black/30` o `bg-white/5`), acompañados de un filtro de desenfoque (`backdrop-blur-md`).
- **Bordes:** Todos los componentes amigables usan bordes fuertemente redondeados (`rounded-xl`, `rounded-2xl` o `rounded-full`) para dar una sensación lúdica y menos corporativa.

**4. Iconografía y Mascotas**
- **Astro el Búho:** Es la mascota principal y el núcleo de la gamificación. Tiene variaciones (con cascos, con birrete, durmiendo) para acompañar los diferentes estados emocionales del alumno en la plataforma.
- **Iconos:** Uso la librería estandarizada **Lucide React**. Se caracteriza por iconos minimalistas de trazo fino que no sobrecargan la interfaz espacial.

---

"""

# Insert before "## 6. Estructura de Ficheros del Proyecto"
sec6_start = content.find("## 6. Estructura de Ficheros del Proyecto")

if sec6_start != -1:
    content = content[:sec6_start] + style_guide_text + content[sec6_start:]
    
    # Also add to index
    index_sec5 = content.find("## 6. Estructura")
    # Actually wait, the index might not have subsections listed. Let's just write the file without changing index if index is just ## 1, ## 2.
    
    with open(DOC_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("Guía de Estilo insertada con éxito.")
else:
    print("No se encontró la sección 6.")

