import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
<<<<<<< HEAD
import { PlayCircle, CheckCircle, Brain, ArrowLeft, Star, FileText, Compass } from 'lucide-react';
=======
import { PlayCircle, CheckCircle, Brain, ArrowLeft, Star, FileText } from 'lucide-react';
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
import axiosInstance from '../api/axios';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
<<<<<<< HEAD
  const [activeLesson, setActiveLesson] = useState(null);
=======
  // Datos simulados de lecciones mientras adaptamos el serializador del backend completo
  const dummyLessons = [
    { id: 1, title: 'Conceptos Base', isCompleted: true },
    { id: 2, title: 'Desarrollo Práctico', isCompleted: false },
    { id: 3, title: 'Evaluación de Rango', isCompleted: false },
  ];
  
  const [activeLessonId, setActiveLessonId] = useState(1);
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`courses/courses/${courseId}/`);
        setCourse(response.data);
<<<<<<< HEAD
        if (response.data.lessons && response.data.lessons.length > 0) {
          setActiveLesson(response.data.lessons[0]);
        }
=======
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
      } catch (error) {
        console.error("Error cargando el curso", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

<<<<<<< HEAD
  // Si no hay lecciones reales desde BD, creamos unas dinámicas de relleno para que la UI no quede rota.
  const displayedLessons = course?.lessons?.length > 0 
    ? course.lessons 
    : [
       { id: 991, title: 'Transmisión Base', isCompleted: true, content: 'Contenido clasificado.' },
       { id: 992, title: 'Práctica Táctica', isCompleted: false, content: 'Simulacro de vuelo.' }
      ];
      
  const currentActiveLessonId = activeLesson ? activeLesson.id : displayedLessons[0].id;

=======
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="loading loading-infinity loading-lg text-cyan-400"></span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center text-white bg-slate-950">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Misión Desaparecida de los Registros</h2>
        <Link to="/dashboard" className="btn btn-outline border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900">Volver a la Base</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 flex flex-col items-center">
      {/* Barra Superior del Curso */}
      <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-16 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn btn-circle btn-sm btn-ghost text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-cyan-500 font-bold uppercase tracking-widest">Academia de Entrenamiento</span>
            <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{course.title}</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
           <Star className="w-4 h-4 text-pink-500" />
           <span className="text-sm font-bold text-white">Recompensa: {course.xp_reward || 300} XP</span>
        </div>
      </div>

      {/* Grid Central */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 mt-4">
        
        {/* COLUMNA IZQUIERDA: Reproductor Visual (70%) */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          
          {/* Pantalla de Holograma */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)] border-2 border-slate-800 flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-pink-900/10 pointer-events-none"></div>
            
            {/* Reproductor de Video Simulado */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button className="btn btn-circle btn-lg border-none bg-cyan-500/80 hover:bg-cyan-400 hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                <PlayCircle className="w-12 h-12 text-slate-900 ml-1" />
              </button>
            </div>
            {/* Fondo simulando transmisión */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute top-4 left-4 flex gap-2">
               <span className="badge badge-error gap-1 animate-pulse border-none font-bold text-xs"><div className="w-2 h-2 rounded-full bg-white"></div> LIVE</span>
<<<<<<< HEAD
               <span className="badge bg-slate-800/80 text-white border-none font-bold text-xs">{(activeLesson && activeLesson.title) || 'Lección Activa'}</span>
=======
               <span className="badge bg-slate-800/80 text-white border-none font-bold text-xs">Lección {activeLessonId}</span>
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
            </div>
          </div>

          {/* Caja de Teoría Glassmorphism */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex gap-3 items-center mb-6 border-b border-white/10 pb-4">
              <FileText className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Documentación Técnica</h2>
            </div>
            
            <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none">
              <p>
<<<<<<< HEAD
                {activeLesson?.content || course.description || "Esta es la información teórica analizada en los registros. Sumérgete en estos conocimientos para afianzar tus competencias lógicas. Recuerda tomar notas en tu cuaderno táctico."}
=======
                {course.description || "Esta es la información teórica analizada en los registros. Sumérgete en estos conocimientos para afianzar tus competencias lógicas. Recuerda tomar notas en tu cuaderno táctico."}
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
              </p>
              <p>Aquí se volcarán todos los apuntes del profesor con fórmulas matemáticas detalladas utilizando LaTeX, así como ejercicios interactivos.</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Sidebar de Lecciones (30%) */}
        <div className="w-full lg:w-1/4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sticky top-40 h-fit">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
               <Compass className="w-5 h-5 text-cyan-400"/> Ruta de Vuelo
            </h3>
            
            <div className="space-y-3">
<<<<<<< HEAD
              {displayedLessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    currentActiveLessonId === lesson.id 
=======
              {dummyLessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    activeLessonId === lesson.id 
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
                      ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                      : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50'
                  }`}
                >
                  {lesson.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
<<<<<<< HEAD
                  ) : currentActiveLessonId === lesson.id ? (
=======
                  ) : activeLessonId === lesson.id ? (
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
                    <PlayCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-500 shrink-0 flex items-center justify-center text-[10px] text-slate-500 font-bold">{idx + 1}</div>
                  )}
                  <div className="flex flex-col overflow-hidden">
<<<<<<< HEAD
                    <span className={`text-sm font-semibold truncate ${currentActiveLessonId === lesson.id ? 'text-white' : 'text-slate-300'}`}>
=======
                    <span className={`text-sm font-semibold truncate ${activeLessonId === lesson.id ? 'text-white' : 'text-slate-300'}`}>
>>>>>>> 5b6b1d8df59528d8f5aa4f2ef7bbed7c812fc3e0
                      {lesson.title}
                    </span>
                    <span className="text-xs text-slate-500">{lesson.isCompleted ? 'Completada' : 'Pendiente'}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* BOTÓN BÚHO IA - Placeholder Hito 4 */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-pink-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Brain className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-sm">¿Dudas en la misión?</h4>
                <p className="text-xs text-slate-300 mt-1 mb-3">La IA Local está decodificando el entorno...</p>
                <button className="btn btn-sm w-full bg-pink-500 hover:bg-pink-400 border-none text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] relative z-10" disabled>
                  Próximamente
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
