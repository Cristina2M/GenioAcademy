# Dossier de Diseño UI/UX: Genio Academy

Este documento detalla el sistema de diseño, la dirección artística y las especificaciones visuales implementadas en la plataforma **Genio Academy**, justificando las decisiones técnicas y estéticas para el módulo de Diseño.

---

## 🌌 1. Dirección Artística y Concepto

Genio Academy es una plataforma de e-learning dirigida a estudiantes de la **Educación Secundaria Obligatoria (ESO)**. A esta edad, el diseño clásico escolar suele generar rechazo y aburrimiento. 

Por ello, se optó por una **fantasía espacial de ciencia ficción gamificada**. El alumno no se siente en un aula virtual estática, sino a los mandos de una nave de exploración espacial, donde aprender materias escolares es el combustible para su viaje interestelar.

---

## 🎨 2. Estilo Visual: Dark Glassmorphism

El estilo predominante es el **Dark Glassmorphism** (neomorfismo sobre fondo oscuro). Este estilo emula pantallas de interfaces futuristas y hologramas mediante las siguientes técnicas:

1.  **Fondos Profundos:** Capas de degradados oscuros que simulan el espacio exterior y nebulosas lejanas.
2.  **Paneles de Cristal:** Contenedores con fondos translúcidos (`background: rgba(..., 0.05)`), bordes sutiles semi-transparentes y un efecto de desenfoque de fondo (`backdrop-filter: blur(12px)`).
3.  **Resplandores de Neón:** Sombras proyectadas con colores vibrantes (`box-shadow: 0 0 15px rgba(indigo, 0.3)`) para dar sensación de luces emitidas por pantallas virtuales.

---

## 🌈 3. Sistema de Color (Color Palette)

Para asegurar consistencia y accesibilidad (siguiendo estándares **WCAG AA**), se diseñó una paleta basada en valores **HSL** y variables CSS centralizadas:

*   **Fondo del Espacio (Space Black):** `hsl(240, 25%, 3%)` a `hsl(240, 30%, 7%)`. Aporta profundidad y evita la fatiga visual de pantallas blancas.
*   **Contraste / Cristal (Glass):** `rgba(255, 255, 255, 0.03)` con bordes `rgba(255, 255, 255, 0.08)`.
*   **Neon Índigo (Principal):** `hsl(239, 84%, 67%)`. Usado para elementos activos, botones y llamadas a la acción primarias.
*   **Neon Violeta (Secundario):** `hsl(271, 91%, 65%)`. Usado para marcas de XP, subidas de nivel y elementos mágicos.
*   **Verde Esmeralda (Vidas/Éxitos):** `hsl(150, 84%, 55%)`. Representa los planetas (vidas) llenos y el éxito en los cuestionarios.
*   **Rojo Alerta (Pérdidas/Errores):** `hsl(0, 84%, 60%)`. Utilizado para vidas perdidas, fallos de evaluación e indicador de "En Vivo".

---

## 🔤 4. Tipografía y Jerarquía

Se han seleccionado tipografías de Google Fonts de corte moderno y tecnológico para evitar los tipos sans-serif genéricos del navegador:

1.  **Outfit (Títulos y Rótulos):** Tipografía geométrica de cantos limpios e inspirados en interfaces de naves y cabinas futuristas. Aporta el tono "Premium".
2.  **Inter (Textos de Lectura y Cursos):** Diseñada específicamente para interfaces de ordenador, ofrece una legibilidad perfecta en textos largos (lecciones de teoría) bajo cualquier resolución.

### Jerarquía Estándar:
*   `h1` (Títulos de Sección): `2.25rem (36px)` | Bold | Tracking ancho.
*   `h2` (Títulos de Tarjeta): `1.5rem (24px)` | Semi-Bold.
*   `body` (Contenido): `1rem (16px)` | Regular | Altura de línea `1.625` (óptima para lectura).

---

## 🦉 5. Mascota e Ilustraciones (Astro)

El tutor inteligente, **Astro**, se representa como un búho astronauta/investigador en diferentes variantes vectoriales de alta definición. Su inclusión humaniza la tecnología y ayuda en la retención del alumno.
Los minijuegos y avatares se basan en una progresión de niveles: el alumno empieza con un búho básico y desbloquea especies más avanzadas y tecnológicas según sube su nivel RPG, incentivando el esfuerzo a través del premio visual.

---

## 📱 6. Diseño Responsivo y Componentes Clave

La plataforma está diseñada bajo la premisa **Mobile-First**:

*   **Navbar Adaptativo:** En ordenadores se despliega en horizontal en la parte superior con badges translúcidos. En móviles, se contrae a un menú hamburguesa que optimiza el espacio de lectura.
*   **Reproductor de Cursos (Sidebar Desplegable):** En ordenadores, la barra de navegación lateral y el contenido de teoría se disponen en columnas paralelas. En móviles, la barra lateral se oculta bajo un botón flotante desplegable para centrar el 100% de la pantalla en la lección.
*   **Interactive Micro-Animations:** Todos los botones implementan transiciones de suavizado (`transition: all 0.3s ease`) y resplandores al pasar el cursor (*hover effects*) para hacer sentir la aplicación "viva".
