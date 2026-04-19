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
import { Target, Trophy, Flame, Compass, Play, BookOpen, Star, Lock, X, Rocket, GraduationCap } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { getStudentAvatar, avatarDatabase } from '../utils/avatarUtils';

export default function Dashboard() {
  // Sacamos del contexto global los datos del alumno conectado y la función para cambiar avatar
  const { user, updateAvatar } = useContext(AuthContext);
  const [actualizandoAvatar, setActualizandoAvatar] = useState(false);

  // El curso que le sugerimos al alumno (obtenido del backend)
  const [cursoSugerido, setCursoSugerido] = useState(null);
  const [cargandoCurso, setCargandoCurso] = useState(true);

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

  // ─────────────────────────────────────────────
  // OBTENER EL CURSO SUGERIDO AL ARRANCAR
  // ─────────────────────────────────────────────
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        // Pedimos el árbol de categorías al backend.
        // Cada categoría tiene niveles, y cada nivel tiene cursos con "is_locked" e "is_completed".
        const respuesta = await axiosInstance.get('courses/categories/');
        const categorias = respuesta.data;

        let cursoDesbloquedoencontrado = null; // El primero que esté desbloqueado Y sin completar
        let ultimoCursoVisto = null;            // El último que hayamos visto, por si todo está completado

        // Recorremos el árbol: categoría → nivel → cursos
        for (const cat of categorias) {
          for (const nivel of cat.knowledge_levels) {
            // Solo miramos niveles que el alumno puede acceder (no bloqueados)
            if (!nivel.is_locked && nivel.courses && nivel.courses.length > 0) {
              for (const curso of nivel.courses) {
                ultimoCursoVisto = curso;
                if (!curso.is_completed) {
                  // ¡Encontramos un curso pendiente! Este es el que sugerimos.
                  cursoDesbloquedoencontrado = curso;
                  break;
                }
              }
            }
            if (cursoDesbloquedoencontrado) break;
          }
          if (cursoDesbloquedoencontrado) break;
        }

        if (cursoDesbloquedoencontrado) {
          setCursoSugerido(cursoDesbloquedoencontrado);
        } else if (ultimoCursoVisto) {
          // Si el alumno ha completado todos los cursos disponibles,
          // le sugerimos el último para que pueda repasar.
          setCursoSugerido(ultimoCursoVisto);
        }
      } catch (error) {
        console.error('Error al obtener cursos sugeridos', error);
      } finally {
        setCargandoCurso(false);
      }
    };

    cargarCursos();
  }, []);

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
              <div className={`w-32 h-32 rounded-full border-4 ${isUpdatingAvatar ? 'border-amber-400 animate-pulse' : 'border-slate-900'} relative z-10 p-1 bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                <img
                  src={getStudentAvatar(currentAvatarId)}
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
                  NVL. {currentLevel}
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

            {/* Tarjeta del curso sugerido (datos reales de la base de datos) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/60 transition-colors relative overflow-hidden group">
              {/* Icono decorativo de fondo grande */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-24 h-24 text-cyan-400" />
              </div>

              <h3 className="text-cyan-400 font-bold mb-1 uppercase tracking-widest text-xs flex items-center gap-2">
                Misión Sugerida {cargandoCurso && <span className="loading loading-spinner loading-xs"></span>}
              </h3>

              {/* Título del curso (o mensaje si no hay ninguno disponible) */}
              <h2 className="text-white text-xl font-bold mb-4">
                {cursoSugerido ? cursoSugerido.title : 'Inscríbete en una Misión'}
              </h2>

              {/* Barra de progreso del curso (verde = completado, azul = en progreso) */}
              {cursoSugerido && (
                <div className="flex flex-col gap-2 mb-6 relative z-10">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Estado Misión</span>
                    <span>{cursoSugerido.is_completed ? 'Completada ✔' : '0%'}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div className={`h-full ${cursoSugerido.is_completed ? 'bg-green-500 w-full' : 'bg-gradient-to-r from-cyan-500 to-pink-500 w-[0%]'}`}></div>
                  </div>
                </div>
              )}

              {/* Botón de acción: va al curso o al catálogo si no hay curso sugerido */}
              <div className="flex gap-4">
                {cursoSugerido ? (
                  <Link
                    to={`/player/${cursoSugerido.id}`}
                    className={`btn ${cursoSugerido.is_completed ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'} border-none w-full shadow-[0_0_15px_rgba(34,211,238,0.4)] font-bold relative z-10 transition-transform`}
                  >
                    {cursoSugerido.is_completed ? 'Repasar Entrenamiento' : 'Entrar a la Academia'} <Play className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <Link to="/courses" className="btn btn-outline border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 w-full relative z-10">
                    Explorar Catálogo <Compass className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* ── VITRINA DE MEDALLAS ── */}
            <h2 className="text-2xl font-black text-white px-2 flex items-center gap-2 mt-10">
              <Trophy className="w-6 h-6 text-amber-500" /> Vitrina de Reconocimientos
            </h2>
            {/* Las medallas son por ahora estáticas (decorativas). En el futuro se conectarán al backend. */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Primer Despegue', icon: <Flame className="w-6 h-6 text-orange-500"/>, color: 'from-orange-500/20 to-red-600/20', unlocked: true },
                { name: 'Matemático Novato', icon: <Target className="w-6 h-6 text-blue-400"/>, color: 'from-blue-500/20 to-cyan-500/20', unlocked: true },
                { name: 'Cartógrafo Espacial', icon: <Compass className="w-6 h-6 text-emerald-400"/>, color: 'from-emerald-500/20 to-green-600/20', unlocked: false },
                { name: 'Sabio Estelar', icon: <Trophy className="w-6 h-6 text-amber-300"/>, color: 'from-amber-500/20 to-yellow-600/20', unlocked: false },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border flex flex-col items-center justify-center text-center transition-all ${badge.unlocked ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-lg` : 'bg-slate-900/30 border-white/5 grayscale opacity-50'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/10 shadow-inner flex items-center justify-center mb-3">
                    {badge.icon}
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUMNA LATERAL DERECHA (sidebar) ── */}
          <div className="space-y-6">

            {/* Tarjeta de Misiones Diarias (pendiente de implementar en el futuro) */}
            <div className="card bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden group">
              {/* Overlay: aparece al pasar el ratón indicando que es próximamente */}
              <div className="absolute inset-0 bg-slate-950/60 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <span className="badge border-none bg-cyan-500 text-slate-900 font-bold px-4 py-2 shadow-[0_0_15px_rgba(34,211,238,0.5)]">PRÓXIMAMENTE</span>
              </div>
              {/* Contenido de la tarjeta (difuminado para indicar que no está activo) */}
              <div className="card-body p-6 opacity-60 grayscale transition-all group-hover:blur-sm">
                <h3 className="font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5"/> Misiones Diarias
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shrink-0 mt-0.5"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Completa 1 lección de Física</p>
                      <p className="text-xs text-cyan-500 font-bold">+50 XP</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 opacity-50 line-through">
                    <div className="w-6 h-6 rounded bg-pink-500/20 border border-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Resolver un Quiz Perfecto</p>
                      <p className="text-xs text-pink-500 font-bold">+100 XP</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

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

                  <span className={`text-xs font-bold text-center ${isSelected ? 'text-amber-400' : isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {avatar.name}
                  </span>
                  {/* Etiqueta "EQUIPADO" visible en el búho activo */}
                  {isSelected && (
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
