// ============================================================
// ARCHIVO: CoursePlayer.jsx
// FUNCIÓN: Reproductor de curso (la "clase" del alumno).
//
// Esta pantalla es la que ve el alumno cuando entra a un curso.
// Tiene tres partes principales:
//   1. Barra superior con el nombre del curso
//   2. Columna izquierda: vídeo + teoría / simulador de preguntas
//   3. Columna derecha: lista de lecciones + botón de completar + Astro
//
// El botón principal cambia según el estado del curso:
//   - "Completar Misión" si el curso es nuevo (da XP)
//   - "Terminar Entrenamiento" si ya fue completado (modo repaso, sin XP)
//
// Astro (para resolver dudas) está bloqueado para el Plan 1.
// ============================================================

import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Brain, ArrowLeft, ArrowRight, Star, FileText, Compass, ShieldAlert, Lock, Rocket } from 'lucide-react';
import axiosInstance from '../api/axios';
import LessonQuiz from '../components/LessonQuiz';
import AIChatPanel from '../components/AIChatPanel';
import LivesPanel from '../components/LivesPanel';
import AuthContext from '../context/AuthContext';
import TutoringModal from '../components/TutoringModal';

export default function CoursePlayer() {
  // Sacamos el ID del curso de la URL (ej: /player/3 → courseId = "3")
  const { courseId } = useParams();
  // Sacamos el alumno conectado y la función para completar misiones del contexto global
  const { user, completeMission } = useContext(AuthContext);

  // ─────────────────────────────────────────────
  // ESTADOS PRINCIPALES DE LA PANTALLA
  // ─────────────────────────────────────────────
  const [course, setCourse] = useState(null);       // Datos completos del curso (de la API)
  const [loading, setLoading] = useState(true);     // ¿Estamos cargando el curso?

  const [leccionActiva, setLeccionActiva] = useState(null);           // Lección seleccionada en el sidebar
  const [pestanaActiva, setPestanaActiva] = useState('theory');       // Pestaña activa: 'theory' o 'quiz'
  const [leccionesSuperadas, setLeccionesSuperadas] = useState([]);   // IDs de lecciones superadas en esta sesión

  const [mostrarModalVictoria, setMostrarModalVictoria] = useState(false);
  const [datosVictoria, setDatosVictoria] = useState(null);
  const [reclamando, setReclamando] = useState(false);

  // Modal para tutorías
  const [mostrarModalTutoria, setMostrarModalTutoria] = useState(false);

  // Estado del modal anti-farmeo (aparece si alguien intenta completar un curso ya completado)
  const [modalError, setModalError] = useState('');

  // ─────────────────────────────────────────────
  // PLAN DEL ALUMNO: para mostrar/ocultar Astro y Tutorías
  // ─────────────────────────────────────────────
  // Plan 1 = Órbita Base (sin IA), Plan 2 = IA, Plan 3 = Tutorías
  const nivelSuscripcion = user?.subscription_level || 1;
  const tieneAccesoIA = nivelSuscripcion >= 2;
  const tieneAccesoTutorias = nivelSuscripcion >= 3;

  // ─────────────────────────────────────────────
  // FUNCIÓN: Marcar una lección como superada
  // ─────────────────────────────────────────────
  // Cuando el alumno completa el quiz de una lección, avisamos aquí
  // para que el sidebar la marque como "Sector Controlado" (verde).
  const marcarLeccionSuperada = (id) => {
    if (!leccionesSuperadas.includes(id)) {
      setLeccionesSuperadas(prev => [...prev, id]);
    }
  };

  // ─────────────────────────────────────────────
  // FUNCIÓN: Reclamar la recompensa al terminar el curso
  // ─────────────────────────────────────────────
  const reclamarRecompensa = async () => {
    if (course?.is_completed) {
      // MODO REPASO: El alumno ya completó este curso antes.
      // No llamamos al backend (no hay XP que ganar), solo mostramos un mensaje de ánimo.
      setDatosVictoria({
        detail: 'El entrenamiento extra curte el carácter. ¡Sigue así!',
        experience_points: user?.experience_points || 0,
        level: user?.current_student_level || 1,
        level_up: false,
        is_review: true, // Marcamos que es repaso para que el modal no muestre XP
      });
      setMostrarModalVictoria(true);
      return;
    }

    // MODO NORMAL: Primera vez que completa el curso.
    // Llamamos al backend para registrar la completitud y sumar XP.
    setReclamando(true);
    const resultado = await completeMission(courseId);
    setReclamando(false);

    if (resultado.success) {
      // El backend devolvió los datos actualizados del alumno (nuevo XP, nivel, etc.)
      setDatosVictoria(resultado.payload);
      setMostrarModalVictoria(true);
    } else {
      // Algo salió mal (lo más probable: el backend detectó farmeo y rechazó la petición)
      setModalError(resultado.error);
    }
  };

  // ─────────────────────────────────────────────
  // EFECTO: Cargar los datos del curso al entrar a la pantalla
  // ─────────────────────────────────────────────
  useEffect(() => {
    const cargarCurso = async () => {
      try {
        // Pedimos los datos del curso al backend (teoría, lecciones, ejercicios, etc.)
        const respuesta = await axiosInstance.get(`courses/courses/${courseId}/`);
        setCourse(respuesta.data);
        // Seleccionamos automáticamente la primera lección para mostrarla
        if (respuesta.data.lessons && respuesta.data.lessons.length > 0) {
          setLeccionActiva(respuesta.data.lessons[0]);
        }
      } catch (error) {
        console.error('Error cargando el curso', error);
      } finally {
        setLoading(false);
      }
    };
    cargarCurso();
  }, [courseId]);

  // Si el curso no tiene lecciones en la base de datos,
  // usamos lecciones de ejemplo para que la interfaz no quede vacía.
  const leccionesMostradas = course?.lessons?.length > 0
    ? course.lessons
    : [
        { id: 991, title: 'Transmisión Base', isCompleted: true, content: 'Contenido clasificado.' },
        { id: 992, title: 'Práctica Táctica', isCompleted: false, content: 'Simulacro de vuelo.' },
      ];

  // ID de la lección que está seleccionada en el sidebar
  const idLeccionActiva = leccionActiva ? leccionActiva.id : leccionesMostradas[0].id;

  // ─────────────────────────────────────────────
  // RENDERS CONDICIONALES (mientras carga / si hay error)
  // ─────────────────────────────────────────────
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

      {/* ── BARRA SUPERIOR FIJA ── */}
      <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-16 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Botón de volver al dashboard */}
          <Link to="/dashboard" className="btn btn-circle btn-sm btn-ghost text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-cyan-500 font-bold uppercase tracking-widest">Academia de Entrenamiento</span>
            <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{course.title}</h1>
          </div>
        </div>
        {/* Recompensa en XP que dará el curso (solo visible en pantallas medianas en adelante) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
          <Star className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-bold text-white">Recompensa: {course.xp_reward || 300} XP</span>
        </div>
      </div>

      {/* ── GRID CENTRAL ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 mt-4">

        {/* ── COLUMNA IZQUIERDA: Vídeo + Teoría/Quiz (70% del ancho) ── */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">

          {/* Pantalla de vídeo (simulada por ahora con imagen de fondo) */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)] border-2 border-slate-800 flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-pink-900/10 pointer-events-none"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button className="btn btn-circle btn-lg border-none bg-cyan-500/80 hover:bg-cyan-400 hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                <PlayCircle className="w-12 h-12 text-slate-900 ml-1" />
              </button>
            </div>
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="badge badge-error gap-1 animate-pulse border-none font-bold text-xs"><div className="w-2 h-2 rounded-full bg-white"></div> LIVE</span>
              <span className="badge bg-slate-800/80 text-white border-none font-bold text-xs">{(leccionActiva && leccionActiva.title) || 'Lección Activa'}</span>
            </div>
          </div>

          {/* Caja de Teoría y Quiz */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            {/* Cabecera con las pestañas para cambiar entre teoría y simulador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
              <div className="flex gap-3 items-center">
                <FileText className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Archivos de la Misión</h2>
              </div>
              {/* Pestañas: "Manual Teórico" y "Simulador" */}
              <div className="flex bg-slate-800/80 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setPestanaActiva('theory')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${pestanaActiva === 'theory' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  Manual Teórico
                </button>
                <button
                  onClick={() => setPestanaActiva('quiz')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${pestanaActiva === 'quiz' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white'}`}
                >
                  Simulador {leccionesSuperadas.includes(idLeccionActiva) && <CheckCircle className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            {/* Contenido de la pestaña activa */}
            {pestanaActiva === 'theory' ? (
              // Pestaña de teoría: muestra el contenido de la lección
              <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none">
                {leccionActiva?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: leccionActiva.content }} />
                ) : (
                  <>
                    <p>{course?.description || 'Esta es la información teórica analizada en los registros. Sumérgete en estos conocimientos para afianzar tus competencias lógicas.'}</p>
                    <p>Aquí se volcarán todos los apuntes del profesor con fórmulas matemáticas y ejercicios interactivos.</p>
                  </>
                )}
              </div>
            ) : (
              // Pestaña del simulador: muestra el componente de preguntas
              <LessonQuiz lesson={leccionActiva || leccionesMostradas[0]} onPassed={marcarLeccionSuperada} />
            )}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Sidebar (30% del ancho) ── */}
        <div className="w-full lg:w-1/4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sticky top-40 h-fit">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400"/> Ruta de Vuelo
            </h3>

            {/* Lista de lecciones del curso */}
            <div className="space-y-3">
              {leccionesMostradas.map((leccion, idx) => (
                <button
                  key={leccion.id}
                  onClick={() => setLeccionActiva(leccion)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    idLeccionActiva === leccion.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50'
                  }`}
                >
                  {/* Icono diferente según el estado de la lección */}
                  {leccionesSuperadas.includes(leccion.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 shadow-[0_0_10px_rgba(74,222,128,0.2)] rounded-full bg-green-400/10" />
                  ) : idLeccionActiva === leccion.id ? (
                    <PlayCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-500 shrink-0 flex items-center justify-center text-[10px] text-slate-500 font-bold">{idx + 1}</div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm font-semibold truncate ${idLeccionActiva === leccion.id ? 'text-white' : 'text-slate-300'}`}>{leccion.title}</span>
                    <span className="text-xs text-slate-500">{leccionesSuperadas.includes(leccion.id) ? 'Sector Controlado' : 'Asimilación Pendiente'}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* ── BOTÓN PRINCIPAL DE COMPLETAR ──
                Si el alumno ha superado todas las lecciones de la sesión, aparece el botón.
                - Misión nueva: botón rosa "Completar Misión" (da XP)
                - Repaso: botón gris "Terminar Entrenamiento" (sin XP)
                Si faltan lecciones, el botón está bloqueado y muestra el progreso.
            */}
            <div className="mt-8 border-t border-white/10 pt-6">
              {leccionesSuperadas.length >= leccionesMostradas.length ? (
                <button
                  onClick={reclamarRecompensa}
                  disabled={reclamando}
                  className={`btn border-none rounded-2xl font-black transition-all transform hover:scale-105 text-white w-full ${
                    course?.is_completed
                      ? 'bg-slate-700 hover:bg-slate-600 shadow-lg'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
                  }`}
                >
                  {reclamando
                    ? <span className="loading loading-spinner"></span>
                    : <>{course?.is_completed ? 'Terminar Entrenamiento' : 'Completar Misión'} <ArrowRight className="w-5 h-5 ml-2" /></>
                  }
                </button>
              ) : (
                // Botón desactivado: muestra cuántas lecciones le faltan
                <button className="btn btn-lg w-full bg-slate-800 text-slate-500 border-none cursor-not-allowed hidden md:flex">
                  Misión ({leccionesSuperadas.length}/{leccionesMostradas.length})
                </button>
              )}
            </div>

            {/* ── TARJETA DE ASTRO ──
                Muestra contenido diferente según el plan del alumno:
                - Plan 1: Función bloqueada con aviso para subir de plan
                - Plan 2 o 3: Activado pero marcado como "Próximamente" (Hito IV)
            */}
            <div className="mt-4 border-t border-white/10 pt-6">
              {tieneAccesoIA ? (
                // Plan 2 o 3: Búcho incluido en el plan, cargamos el chat interactivo
                <AIChatPanel 
                  courseTitle={course?.title || "Curso General"} 
                  lessonTitle={leccionActiva?.title || "Consulta"} 
                />
              ) : (
                // Plan 1: Astro bloqueado con invitación a subir de plan
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-600/40 text-center">
                  <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-400 text-sm">Astro</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    Disponible desde el Plan <strong className="text-pink-300">Velocidad Luz</strong>
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-xs w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none rounded-lg font-bold relative z-10"
                  >
                    <Rocket className="w-3 h-3 mr-1" /> Ver Planes
                  </Link>
                </div>
              )}
            </div>

          {/* ── PANEL DE VIDAS (PLANETAS) ──
               Sistema Roguelike: muestra los planetas del alumno y,
               si está en Game Over con Plan 3, activa los botones de minijuego. */}
          <LivesPanel />

          {/* ── BOTÓN DE SOLICITAR TUTORÍA (NIVEL 3) ── */}
          <div className="mt-4">
            {tieneAccesoTutorias ? (
              <button 
                onClick={() => setMostrarModalTutoria(true)}
                className="btn w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold border-none shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                Solicitar Tutoría en Directo
              </button>
            ) : (
              <div className="bg-slate-800/40 p-3 rounded-lg text-center border border-slate-700">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Tutorías con profesores (Nivel 3)
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>

      {/* ══════════════════════════════════════════
          MODAL DE VICTORIA
          Aparece cuando el alumno completa el curso con éxito.
          Muestra XP ganados si es la primera vez, o mensaje de
          ánimo si es un repaso (sin XP).
          ══════════════════════════════════════════ */}
      {mostrarModalVictoria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-pink-500/20 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(236,72,153,0.15)] animate-[scale-up_0.3s_ease-out]">
            {/* Círculo con el icono de victoria */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.5)] border-4 border-slate-900 relative z-10">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {/* Título diferente según sea primera vez o repaso */}
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
              {datosVictoria?.is_review ? '¡Entrenamiento Finalizado!' : '¡Misión Superada!'}
            </h2>
            <p className="text-slate-300 text-lg mb-6">{datosVictoria?.detail}</p>

            {/* Caja de XP — solo visible si NO es un repaso */}
            {!datosVictoria?.is_review && (
              <div className="bg-slate-950/50 rounded-2xl p-5 mb-6 border border-white/5">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500"/> Experiencia Total</span>
                  <span className="font-bold text-white text-xl">{datosVictoria?.experience_points} XP</span>
                </div>
              </div>
            )}

            {/* Notificación de subida de nivel (solo si el alumno subió de nivel con esta misión) */}
            {datosVictoria?.level_up && (
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold p-3 rounded-xl mb-6 shadow-[0_0_20px_rgba(236,72,153,0.4)] animate-pulse border border-white/20">
                🎉 ¡HAS SUBIDO AL NIVEL {datosVictoria?.level}! 🎉
              </div>
            )}

            {/* Botón para volver al dashboard */}
            <Link to="/dashboard" className="btn bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold border-none w-full text-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Volver a la Base
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL DE ALERTA ANTI-FARMEO
          Aparece si el backend detecta que el alumno
          intenta cobrar XP de un curso que ya completó.
          ══════════════════════════════════════════ */}
      {modalError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-[scale-up_0.3s_ease-out]">
            <div className="w-24 h-24 mx-auto bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-red-400 mb-2">¡Alto ahí, Almirante!</h2>
            <p className="text-slate-300 mb-8">{modalError}</p>
            <button
              onClick={() => setModalError('')}
              className="btn bg-slate-800 hover:bg-slate-700 text-white font-bold border border-white/10 w-full transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE TUTORÍA */}
      {mostrarModalTutoria && (
        <TutoringModal 
          courseId={courseId} 
          courseTitle={course.title}
          onClose={() => setMostrarModalTutoria(false)} 
        />
      )}

    </div>
  );
}
