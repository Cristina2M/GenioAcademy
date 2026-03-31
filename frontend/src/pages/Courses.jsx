import { useState, useEffect } from 'react';
import { BookOpen, Star } from 'lucide-react';

// ==========================================
// PÁGINA: Catálogo Estelar (Courses.jsx)
// ==========================================
// Esta página es responsable de obtener los cursos desde nuestro backend de Django
// y mostrarlos secuencialmente divididos por Categorías y Niveles.

export default function Courses() {
  // --- ESTADOS LOCALES (Hooks de React) ---
  // Utilizamos useState para manejar el almacenamiento de datos dinámicos.
  // 1. categories: Almacena la lista de categorías traída desde la API. Empieza como un array vacío [].
  const [categories, setCategories] = useState([]);
  // 2. loading: Controla si mostramos el icono de carga. Empieza en "true" porque al entrar a la página, estamos cargando.
  const [loading, setLoading] = useState(true);
  // 3. error: Guarda cualquier mensaje de error si la petición al servidor falla. Empieza en null (sin error).
  const [error, setError] = useState(null);

  // --- EFECTO SECUNDARIO (Llamada a la API) ---
  // useEffect se ejecuta automáticamente cuando el componente se monta por primera vez en la pantalla.
  // El último argumento [] (array de dependencias vacío) le dice a React que ejecute esto SOLO UNA VEZ.
  useEffect(() => {
    // Definimos una función asíncrona (async) porque dependemos de la respuesta de un servidor externo por internet
    const fetchCourses = async () => {
      try {
        // Bloque TRY: Intentamos conectar con la base de datos a través de nuestro endpoint público
        const response = await fetch('http://localhost:8000/api/courses/categories/');
        
        // Comprobamos si el código de estado HTTP es algo distinto a un éxito (ej: 404, 500)
        if (!response.ok) {
          throw new Error('Se perdió la conexión de telemetría con el servidor galáctico');
        }
        
        // Parseamos el texto en crudo de la red convirtiéndolo a un objeto JSON usable en JavaScript
        const data = await response.json();
        // Guardamos los datos reales en el estado
        setCategories(data);
      } catch (err) {
        // Bloque CATCH: Si la red se cae, el fetch fallará y atraparemos el error aquí
        setError(err.message);
      } finally {
        // Bloque FINALLY: Independientemente de si fue un éxito o un error, hemos terminado la petición.
        // Apagamos la pantalla de carga ("loading" pasa a ser falso).
        setLoading(false);
      }
    };

    // Al definir la función asíncrona arriba, no olvidemos invocarla para que suceda la magia.
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen relative pt-12 pb-32">
      {/* Nebulosas decorativas */}
      <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md mb-4">
            Catálogo <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Estelar</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explora las diferentes galaxias de conocimiento. Cada materia está dividida por niveles de dificultad para que aprendas a tu propio ritmo.
          </p>
        </div>

        {/* Renderizado Condicional: Evaluamos en qué estado nos encontramos */}
        {loading ? (
          // CASO 1: Aún estamos esperando la respuesta de la Base de Datos
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-ring loading-lg text-cyan-400"></span>
            <p className="mt-4 text-slate-400 animate-pulse font-medium">Sondeando el espacio profundo...</p>
          </div>
        ) : error ? (
          // CASO 2: El servidor ha caído o la conexión está rechazada
          <div className="alert alert-error bg-red-900/50 border border-red-500 text-white shadow-xl backdrop-blur-md max-w-2xl mx-auto">
            <span>Error en la conexión intergaláctica: {error}</span>
          </div>
        ) : (
          // CASO 3: Todo fue exitoso. Iteraremos sobre el bloque de categorías para dibujarlas.
          <div className="space-y-16">
            {/* .map() funciona como un bucle for, cogiendo cada Categoría de la Base de Datos y escupiendo un bloque HTML */}
            {categories.map((category) => (
              // Es IMPORTANTÍSIMO proveer una propiedad "key" única (id) para que React sepa optimizar actualizaciones en bucles
              <div key={category.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group/cat">
                
                {/* Categoría Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-white/10 pb-6 relative z-10 text-center md:text-left">
                  <div className="mx-auto md:mx-0 p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] group-hover/cat:shadow-[inset_0_0_20px_rgba(34,211,238,0.4)] transition-all">
                    <BookOpen className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                    <p className="text-slate-400 md:text-lg">{category.description}</p>
                  </div>
                </div>

                {/* Niveles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                  {category.knowledge_levels && category.knowledge_levels.map((level) => (
                    <div key={level.id} className="card bg-slate-800/60 border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group hover:-translate-y-1">
                      <div className="card-body">
                        <h3 className="card-title text-xl text-purple-300 flex justify-between items-start">
                          {level.name}
                          <span className="badge badge-sm border border-purple-500 text-purple-200 bg-purple-900/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]">Nivel {level.order}</span>
                        </h3>
                        <div className="divider my-0 before:bg-white/5 after:bg-white/5 opacity-50"></div>
                        <ul className="space-y-3 mt-3 flex-grow">
                          {level.courses && level.courses.length > 0 ? (
                            level.courses.map((course) => (
                              <li key={course.id} className="flex items-start gap-2 text-slate-300 group-hover:text-slate-200 transition-colors">
                                <Star className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" /> 
                                <span className="leading-snug">{course.title}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-slate-500/70 italic text-center py-2">No hay información en este sector.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
