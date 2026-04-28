import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Star, PlayCircle, Loader2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

// ==========================================
// PÁGINA: Catálogo Estelar (Courses.jsx)
// ==========================================
// Los cursos de cada nivel se muestran en carrusel horizontal:
// 3 cursos visibles a la vez, con flechas para navegar.

const CURSOS_POR_PAGINA = 3;

// ── Carrusel de cursos dentro de un nivel ──
// Muestra 3 cursos a la vez y permite navegar con flechas.
function CourseCarousel({ courses, onStartCourse, startingCourseId }) {
  const [pagina, setPagina] = useState(0);

  const totalPaginas = Math.ceil(courses.length / CURSOS_POR_PAGINA);
  const cursosMostrados = courses.slice(
    pagina * CURSOS_POR_PAGINA,
    pagina * CURSOS_POR_PAGINA + CURSOS_POR_PAGINA
  );

  const irAtras = () => setPagina(p => Math.max(0, p - 1));
  const irAdelante = () => setPagina(p => Math.min(totalPaginas - 1, p + 1));

  return (
    <div>
      {/* Lista de cursos */}
      <ul className="space-y-2 min-h-[11rem]">
        {cursosMostrados.map((course) => (
          <li
            key={course.id}
            onClick={() => onStartCourse(course.id)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10 group/item"
          >
            <div className="flex items-start gap-3">
              {course.is_completed
                ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                : <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
              }
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
        ))}
      </ul>

      {/* Controles del carrusel — solo se muestran si hay más de una página */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <button
            onClick={irAtras}
            disabled={pagina === 0}
            className="btn btn-xs btn-ghost text-slate-400 hover:text-white disabled:opacity-20 gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {/* Puntos indicadores de página */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPagina(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === pagina ? 'bg-cyan-400 w-4' : 'bg-slate-600 hover:bg-slate-400'}`}
              />
            ))}
          </div>

          <button
            onClick={irAdelante}
            disabled={pagina === totalPaginas - 1}
            className="btn btn-xs btn-ghost text-slate-400 hover:text-white disabled:opacity-20 gap-1"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}


export default function Courses() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingCourseId, setStartingCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('courses/categories/');
        setCategories(response.data);
      } catch (err) {
        try {
          const fallback = await axiosInstance.get('courses/categories/', {
            headers: { Authorization: undefined }
          });
          setCategories(fallback.data);
        } catch (fallbackErr) {
          setError(fallbackErr.message || 'Se perdió la conexión de telemetría con el servidor galáctico');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleStartCourse = async (courseId) => {
    setStartingCourseId(courseId);
    try {
      await axiosInstance.post(`courses/courses/${courseId}/start/`);
      navigate(`/player/${courseId}`);
    } catch (err) {
      console.error('Error al iniciar curso:', err);
      navigate(`/player/${courseId}`);
    } finally {
      setStartingCourseId(null);
    }
  };

  return (
    <div className="min-h-screen relative pt-12 pb-32">
      {/* Nebulosas decorativas */}
      <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md mb-4">
            Catálogo <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Estelar</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explora las diferentes galaxias de conocimiento. Cada materia está dividida por niveles de dificultad para que aprendas a tu propio ritmo.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-ring loading-lg text-cyan-400" />
            <p className="mt-4 text-slate-400 animate-pulse font-medium">Sondeando el espacio profundo...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error bg-red-900/50 border border-red-500 text-white shadow-xl backdrop-blur-md max-w-2xl mx-auto">
            <span>Error en la conexión intergaláctica: {error}</span>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group/cat">

                {/* Cabecera de categoría */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-white/10 pb-6 relative z-10 text-center md:text-left">
                  <div className="mx-auto md:mx-0 p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl shadow-[inset_0_0_15px_rgba(34,211,238,0.2)] group-hover/cat:shadow-[inset_0_0_20px_rgba(34,211,238,0.4)] transition-all">
                    <BookOpen className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                    <p className="text-slate-400 md:text-lg">{category.description}</p>
                  </div>
                </div>

                {/* Grid de niveles — cada nivel tiene su propio carrusel */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                  {category.knowledge_levels && category.knowledge_levels.map((level) => (
                    <div key={level.id} className="card bg-slate-800/60 border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group hover:-translate-y-1">
                      <div className="card-body">
                        <h3 className="card-title text-xl text-purple-300 flex justify-between items-start">
                          {level.name}
                          <span className="badge badge-sm border border-purple-500 text-purple-200 bg-purple-900/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            Nivel {level.order}
                          </span>
                        </h3>
                        <div className="divider my-0 before:bg-white/5 after:bg-white/5 opacity-50" />

                        {/* Carrusel de cursos */}
                        {level.courses && level.courses.length > 0 ? (
                          <CourseCarousel
                            courses={level.courses}
                            onStartCourse={handleStartCourse}
                            startingCourseId={startingCourseId}
                          />
                        ) : (
                          <p className="text-sm text-slate-500/70 italic text-center py-4">No hay información en este sector.</p>
                        )}
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
