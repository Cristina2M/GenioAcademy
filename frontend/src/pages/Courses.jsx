import { useState, useEffect } from 'react';
import { BookOpen, Star, PlayCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

// ==========================================
// PÁGINA: Catálogo Estelar (Courses.jsx)
// ==========================================
// Esta página es responsable de obtener los cursos desde nuestro backend de Django
// y mostrarlos secuencialmente divididos por Categorías y Niveles.

export default function Courses() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingCourseId, setStartingCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Usamos axiosInstance (no fetch nativo) para enviar el JWT automáticamente.
        // Esto permite que el backend calcule is_locked e is_completed correctamente.
        const response = await axiosInstance.get('courses/categories/');
        setCategories(response.data);
      } catch (err) {
        setError(err.message || 'Se perdió la conexión de telemetría con el servidor galáctico');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStartCourse = async (courseId) => {
    setStartingCourseId(courseId);
    try {
      // Llamamos al endpoint de "start" para crear el registro de progreso (In Progress)
      await axiosInstance.post(`courses/courses/${courseId}/start/`);
      // Redirigimos al reproductor
      navigate(`/player/${courseId}`);
    } catch (err) {
      console.error('Error al iniciar curso:', err);
      // Aunque falle el registro de progreso, permitimos entrar al curso
      navigate(`/player/${courseId}`);
    } finally {
      setStartingCourseId(false);
    }
  };

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
                              <li 
                                key={course.id} 
                                onClick={() => handleStartCourse(course.id)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10 group/item"
                              >
                                <div className="flex items-start gap-3">
                                  <Star className={`w-4 h-4 mt-1 flex-shrink-0 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] ${course.is_completed ? 'text-green-400' : 'text-amber-400'}`} /> 
                                  <div>
                                    <p className={`text-sm font-bold leading-snug group-hover/item:text-cyan-400 transition-colors ${course.is_completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                      {course.title}
                                    </p>
                                    {course.is_started && !course.is_completed && (
                                      <span className="text-[10px] text-cyan-500 font-black uppercase tracking-tighter">En progreso</span>
                                    )}
                                  </div>
                                </div>
                                
                                {startingCourseId === course.id ? (
                                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                ) : (
                                  <PlayCircle className="w-5 h-5 text-slate-600 transition-all opacity-0 group-hover/item:opacity-100 group-hover/item:text-cyan-400" />
                                )}
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
