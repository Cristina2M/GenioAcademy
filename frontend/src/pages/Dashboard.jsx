// ============================================================
// ARCHIVO: Dashboard.jsx
// FUNCIÓN: Panel de control personal del alumno.
//
// Aquí el alumno ve:
//   - Su avatar, nombre, nivel y barra de progreso de XP
//   - La misión sugerida (próximo curso a hacer)
//   - Su vitrina de medallas/logros
//   - El acceso a Astro (bloqueado si tiene el Plan 1)
//
// Este archivo se conecta al backend para obtener los cursos
// disponibles en el nivel del alumno. También usa el contexto
// global (AuthContext) para saber quién está conectado.
// ============================================================

import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Trophy, Flame, Compass, Play, BookOpen, Star, Lock, X, Rocket, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { getStudentAvatar, avatarDatabase } from '../utils/avatarUtils';

export default function Dashboard() {
  // Sacamos del contexto global los datos del alumno conectado y la función para cambiar avatar
  const { user, updateAvatar } = useContext(AuthContext);
  const [actualizandoAvatar, setActualizandoAvatar] = useState(false);

  // Cursos que el alumno tiene en progreso (obtenidos del backend)
  const [activeCourses, setActiveCourses] = useState([]);

  // ─────────────────────────────────────────────
  // CÁLCULOS DE GAMIFICACIÓN (Barra de Progreso XP)
  // ─────────────────────────────────────────────
  // El sistema de niveles es lineal: cada nivel cuesta 500 XP más que el anterior.
  // Ejemplo: Nivel 1→2 = 500 XP, Nivel 2→3 = 1000 XP acumulados totales, etc.

  const xpActual = user?.experience_points || 0;
  const nivelActual = user?.current_student_level || 1;
  const idAvatarActual = user?.selected_avatar || 'buho1';

  // XP mínimo necesario para estar en el nivel actual (base)
  const xpBaseNivelActual = (nivelActual - 1) * 500;
  // XP mínimo necesario para subir AL SIGUIENTE nivel
  const xpParaSiguienteNivel = nivelActual * 500;

  // Cuánto XP ha ganado el alumno DENTRO de su nivel actual (no el total)
  const xpGanadoEnNivel = Math.max(0, xpActual - xpBaseNivelActual);
  // Cuánto XP necesita ganar para subir (siempre 500 con nuestra fórmula)
  const xpRequeridoPorNivel = xpParaSiguienteNivel - xpBaseNivelActual;

  // Porcentaje de relleno de la barra (de 0 a 100)
  const porcentajeProgreso = Math.round((xpGanadoEnNivel / xpRequeridoPorNivel) * 100);

  // ─────────────────────────────────────────────
  // PLAN DE SUSCRIPCIÓN DEL ALUMNO
  // ─────────────────────────────────────────────
  // El plan viene dentro del JWT (token de sesión).
  // Plan 1 = Órbita Base, Plan 2 = Velocidad Luz, Plan 3 = Agujero de Gusano.
  // Usamos esto para decidir qué funciones mostrar o bloquear.
  const nivelSuscripcion = user?.subscription_level || 1;
  const tieneAccesoIA = nivelSuscripcion >= 2; // Astro requiere Plan 2 o superior

  // Historial completo del alumno (iniciados y completados)
  const [journeyCourses, setJourneyCourses] = useState([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  // ─────────────────────────────────────────────
  // OBTENER EL PROGRESO AL ARRANCAR
  // ─────────────────────────────────────────────
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cursos activos (para la sección de Operación Principal)
        const resActivos = await axiosInstance.get('courses/courses/my_active_courses/');
        setActiveCourses(resActivos.data);

        // Trayectoria completa (para calcular logros reales)
        const resJourney = await axiosInstance.get('courses/courses/my_full_journey/');
        setJourneyCourses(resJourney.data);
      } catch (error) {
        console.error('Error al obtener datos del dashboard', error);
      } finally {
        setCargandoCursos(false);
      }
    };

    cargarDatos();
  }, []);

  // ─────────────────────────────────────────────
  // LÓGICA DE LOGROS DINÁMICOS
  // ─────────────────────────────────────────────
  const completedCourses = journeyCourses.filter(c => c.is_completed);
  
  const achievements = [
    { 
      id: 'first_step',
      name: 'Primer Despegue', 
      desc: 'Inicia tu primer curso',
      icon: <Rocket className="w-6 h-6 text-orange-400"/>, 
      color: 'from-orange-500/20 to-red-600/20', 
      unlocked: journeyCourses.length > 0 
    },
    { 
      id: 'math_novice',
      name: 'Matemático Novato', 
      desc: 'Completa un curso de Matemáticas',
      icon: <Target className="w-6 h-6 text-blue-400"/>, 
      color: 'from-blue-500/20 to-cyan-500/20', 
      unlocked: completedCourses.some(c => c.category_name.includes('Matemáticas'))
    },
    { 
      id: 'explorer',
      name: 'Explorador Curioso', 
      desc: 'Inicia 3 cursos diferentes',
      icon: <Compass className="w-6 h-6 text-emerald-400"/>, 
      color: 'from-emerald-500/20 to-green-600/20', 
      unlocked: journeyCourses.length >= 3
    },
    { 
      id: 'veteran',
      name: 'Agente Veterano', 
      desc: 'Alcanza el Nivel 3 de Rango',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400"/>, 
      color: 'from-purple-500/20 to-indigo-600/20', 
      unlocked: nivelActual >= 3
    },
    { 
      id: 'master',
      name: 'Sabio Estelar', 
      desc: 'Completa 5 misiones con éxito',
      icon: <Trophy className="w-6 h-6 text-amber-300"/>, 
      color: 'from-amber-500/20 to-yellow-600/20', 
      unlocked: completedCourses.length >= 5 
    },
  ];

  // Función que se ejecuta cuando el alumno hace clic en un avatar de la galería
  const seleccionarAvatar = async (idAvatar) => {
    setActualizandoAvatar(true);
    await updateAvatar(idAvatar); // Llama al backend para guardar el cambio
    setActualizandoAvatar(false);
    document.getElementById('avatar_modal').close(); // Cierra el modal de galería
  };

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">

      {/* Luces decorativas de fondo (no interactivas) */}
      <div className="fixed top-20 left-10 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_10s_infinite] -z-10"></div>
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_8s_infinite] -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ══════════════════════════════════════════
            SECCIÓN 1: TARJETA DE PERFIL DEL ALUMNO
            ══════════════════════════════════════════ */}
        <section className="card bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Barra de color en la parte superior de la tarjeta */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500"></div>

          <div className="card-body p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">

            {/* Avatar del alumno — al hacer clic abre la galería de búhos */}
            <div
              className="relative shrink-0 group cursor-pointer"
              onClick={() => document.getElementById('avatar_modal').showModal()}
            >
              {/* Halo brillante detrás del avatar */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>

              {/* Marco del avatar con animación cuando se está actualizando */}
              <div className={`w-32 h-32 rounded-full border-4 ${actualizandoAvatar ? 'border-amber-400 animate-pulse' : 'border-slate-900'} relative z-10 p-1 bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                <img
                  src={getStudentAvatar(idAvatarActual)}
                  alt="Avatar del alumno"
                  className="w-full h-full object-cover rounded-full bg-slate-800"
                />
                {/* Efecto hover: muestra texto "Cambiar" al pasar el ratón */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-full">
                  <div className="text-white text-xs font-bold bg-slate-900/80 px-2 py-1 rounded-full border border-white/20">Cambiar</div>
                </div>
              </div>

              {/* Insignia de nivel (esquina inferior derecha del avatar) */}
              <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-lg p-1 z-20 shadow-xl border border-white/10">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 font-black text-slate-900 px-3 py-1 rounded shadow-inner text-sm">
                  NVL. {nivelActual}
                </div>
              </div>
            </div>

            {/* Nombre del alumno y barra de progreso de XP */}
            <div className="flex-1 w-full text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-md tracking-tight">
                  Hola de nuevo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.username || 'Agente'}</span>
                </h1>
                <p className="text-slate-400 mt-1 font-medium">Estás a un paso de dominar el siguiente desafío.</p>
              </div>

              {/* Barra de XP: muestra cuánto ha ganado dentro de su nivel actual */}
              <div className="w-full mt-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3"/> Progreso de Rango
                  </span>
                  {/* Muestra el XP ganado en este nivel vs el necesario para subir */}
                  <span className="text-sm font-bold text-white">
                    {xpGanadoEnNivel} <span className="text-slate-500 font-medium">/ {xpRequeridoPorNivel} XP</span>
                  </span>
                </div>
                {/* Barra visual de progreso */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 relative transition-all duration-1000 ease-out"
                    style={{ width: `${porcentajeProgreso}%` }}
                  >
                    {/* Destello animado en el extremo derecho de la barra */}
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 animate-[pulse_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-right text-xs text-slate-500 mt-2 font-semibold">
                  Te faltan {xpRequeridoPorNivel - xpGanadoEnNivel} XP para ascender al Nivel {nivelActual + 1}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            GRID PRINCIPAL: MISIÓN + MEDALLAS + SIDEBAR
            ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

          {/* ── COLUMNA PRINCIPAL (ocupa 2/3 del espacio en pantallas grandes) ── */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-white px-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" /> Operación Principal
            </h2>

            {/* Lista de Misiones Activas (sin completar) */}
            <div className="space-y-4">
              {cargandoCursos ? (
                <div className="flex justify-center p-8 bg-slate-900/40 rounded-2xl border border-white/5">
                  <span className="loading loading-spinner text-cyan-400"></span>
                </div>
              ) : activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCourses.map((curso) => (
                    <div key={curso.id} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 rounded-2xl p-6 shadow-lg hover:border-cyan-400/50 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <Rocket className="w-12 h-12 text-cyan-400" />
                       </div>
                       <h3 className="text-cyan-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Misión en Curso</h3>
                       <h2 className="text-white text-lg font-bold mb-4 pr-8 line-clamp-1">{curso.title}</h2>
                       <Link 
                         to={`/player/${curso.id}`}
                         className="btn btn-sm btn-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-none font-bold shadow-lg shadow-cyan-900/20"
                       >
                          Continuar <Play className="w-3 h-3 ml-1" />
                       </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/40 backdrop-blur-md border border-dashed border-white/10 rounded-2xl p-10 text-center">
                   <Compass className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-500">Sin misiones activas</h3>
                   <p className="text-slate-600 text-sm mt-2">Visita el catálogo estelar para elegir tu próximo destino.</p>
                   <Link to="/courses" className="btn btn-outline border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 mt-6 rounded-xl">
                      Explorar Catálogo
                   </Link>
                </div>
              )}

              {/* Botón para ver trayectoria completa */}
              <div className="pt-4">
                <Link 
                  to="/dashboard/journey"
                  className="btn btn-block bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-2xl flex items-center justify-between px-6 h-16 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Ver Mi Trayectoria Estelar</p>
                      <p className="text-[10px] text-slate-500 italic">Historial completo y medallas desbloqueadas</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* ── VITRINA DE MEDALLAS ── */}
            <h2 className="text-2xl font-black text-white px-2 flex items-center gap-2 mt-10">
              <Trophy className="w-6 h-6 text-amber-500" /> Vitrina de Reconocimientos
            </h2>
            {/* Las medallas son por ahora estáticas (decorativas). En el futuro se conectarán al backend. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {achievements.map((badge) => (
                <div
                  key={badge.id}
                  className={`group relative rounded-2xl p-4 border flex flex-col items-center justify-center text-center transition-all duration-500 ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]` 
                      : 'bg-slate-900/30 border-white/5 opacity-40 hover:opacity-60'
                  }`}
                >
                  {/* Tooltip de descripción (aparece al hover) */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-2 px-3 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-2xl">
                    {badge.desc}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-white/10"></div>
                  </div>

                  <div className={`w-14 h-14 rounded-full bg-slate-950 border border-white/10 shadow-inner flex items-center justify-center mb-3 relative overflow-hidden ${!badge.unlocked && 'grayscale'}`}>
                    {badge.unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-pulse"></div>
                    )}
                    {badge.icon}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
                        <Lock className="w-4 h-4 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${badge.unlocked ? 'text-white' : 'text-slate-600'}`}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUMNA LATERAL DERECHA (sidebar) ── */}
          <div className="space-y-6">


            {/* TARJETA: CONSULTORIO GALÁCTICO (CLAUSTRO) */}
            <div className={`card bg-slate-800/40 backdrop-blur-sm border ${nivelSuscripcion >= 3 ? 'border-teal-500/30 hover:border-teal-400' : 'border-white/10'} shadow-lg relative overflow-hidden group transition-all`}>
              {/* Overlay para niveles restringidos (1 y 2) */}
              {nivelSuscripcion < 3 && (
                <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                   <Lock className="w-8 h-8 text-amber-500 mb-2" />
                   <p className="text-white font-bold text-sm tracking-tight">Consultorio Galáctico restringido</p>
                   <p className="text-slate-400 text-[10px] mt-1 italic">Válido solo para alumnos con Plan 3 (Agujero de Gusano)</p>
                   <Link to="/pricing" className="btn btn-xs btn-outline btn-amber mt-4 border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black">Subir Rango</Link>
                </div>
              )}

              <div className="card-body p-6">
                <h3 className={`font-bold ${nivelSuscripcion >= 3 ? 'text-teal-400' : 'text-slate-500'} mb-2 flex items-center gap-2 tracking-wider uppercase text-xs`}>
                  <GraduationCap className="w-5 h-5"/> Consultorio Galáctico
                </h3>
                <p className="text-white text-lg font-black leading-tight">Biblioteca de Maestros</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">Consulta el currículum de todos nuestros expertos y resuelve tus dudas académicas.</p>
                
                <div className="mt-6">
                  {nivelSuscripcion >= 3 ? (
                    <Link to="/dashboard/claustro" className="btn btn-sm btn-block bg-teal-600 hover:bg-teal-500 border-none text-white font-bold flex items-center gap-2">
                       Acceder al Claustro <Play className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button disabled className="btn btn-sm btn-block bg-white/5 border-white/10 text-slate-600 cursor-not-allowed">
                       Bloqueado
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MODAL: GALERÍA DE AVATARES (BÚHOS)
          Se abre al hacer clic en el avatar del perfil.
          El alumno puede cambiar su búho activo aquí.
          Los búhos bloqueados se muestran en escala de grises con un candado.
          ══════════════════════════════════════════ */}
      <dialog id="avatar_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-slate-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-4xl">
          {/* Botón de cierre (X) en la esquina superior derecha */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
          </form>

          <h3 className="font-black text-2xl text-white mb-2 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500"/> Colección de Búhos
          </h3>
          <p className="text-slate-400 text-sm mb-6">Equipa los búhos que hayas desbloqueado. Los búhos especiales se desbloquean al subir de nivel.</p>

          {/* Grid de todos los avatares disponibles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {avatarDatabase.map((avatar) => {
              // ¿Puede el alumno usar este búho? Depende de su nivel RPG actual.
              const estaDesbloqueado = nivelActual >= avatar.requiredLevel;
              // ¿Es este el búho que tiene equipado ahora mismo?
              const estaSeleccionado = idAvatarActual === avatar.id;

              return (
                <div
                  key={avatar.id}
                  className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                    estaSeleccionado
                      ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105 z-10'
                      : estaDesbloqueado
                      ? 'border-white/10 bg-slate-800/50 hover:bg-slate-700/50 hover:border-cyan-500/50 cursor-pointer'
                      : 'border-transparent bg-slate-900/50 opacity-80 cursor-not-allowed'
                  }`}
                  onClick={() => estaDesbloqueado && seleccionarAvatar(avatar.id)}
                >
                  {/* Imagen del búho (en gris si está bloqueado) */}
                  <div
                    className={`relative w-20 h-20 mb-3 ${!estaDesbloqueado ? 'tooltip tooltip-bottom' : ''}`}
                    data-tip={!estaDesbloqueado ? `Alcanza el Nivel ${avatar.requiredLevel} para desbloquear` : ''}
                  >
                    <img
                      src={avatar.src}
                      alt={avatar.name}
                      className={`w-full h-full object-contain drop-shadow-lg transition-all ${!estaDesbloqueado ? 'grayscale-[100%] brightness-[0.2] contrast-200' : ''}`}
                    />
                    {/* Candado encima del búho si está bloqueado */}
                    {!estaDesbloqueado && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                      </div>
                    )}
                  </div>

                  <span className={`text-xs font-bold text-center ${estaSeleccionado ? 'text-amber-400' : estaDesbloqueado ? 'text-white' : 'text-slate-500'}`}>
                    {avatar.name}
                  </span>
                  {/* Etiqueta "EQUIPADO" visible en el búho activo */}
                  {estaSeleccionado && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">EQUIPADO</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Zona exterior al modal: al hacer clic se cierra */}
        <form method="dialog" className="modal-backdrop">
          <button>Cerrar</button>
        </form>
      </dialog>

    </div>
  );
}
