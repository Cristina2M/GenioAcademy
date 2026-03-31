import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Target, Trophy, Flame, Compass, Play, BookOpen, Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import avatarPlaceholder from '../assets/img/stikers/buho2.png';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // Cálculos de Gamificación (Podríamos traerlos del backend luego, aquí lo simulamos con lo que da el Token)
  const currentXP = user?.experience_points || 350; // Extraído del backend si lo configuraste, o mock
  const currentLevel = user?.current_student_level || 1;
  const xpForNextLevel = currentLevel * 500;
  const progressPercentage = Math.round((currentXP / xpForNextLevel) * 100);

  return (
    <div className="min-h-screen relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Nebulosas de fondo */}
      <div className="fixed top-20 left-10 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_10s_infinite] -z-10"></div>
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_8s_infinite] -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ==========================================
            SECCIÓN 1: CABECERA DEL JUGADOR
            ========================================== */}
        <section className="card bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* El brillo de la barra superior de la tarjeta */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500"></div>

          <div className="card-body p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar Magnético */}
            <div className="relative shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 relative z-10 p-1 bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center overflow-hidden">
                <img src={avatarPlaceholder} alt="Avatar de Estudiante" className="w-full h-full object-cover rounded-full bg-slate-800" />
              </div>
              
              {/* Insignia de Nivel superpuesta */}
              <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-lg p-1 z-20 shadow-xl border border-white/10">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 font-black text-slate-900 px-3 py-1 rounded shadow-inner text-sm">
                  NVL. {currentLevel}
                </div>
              </div>
            </div>

            {/* Info y Barra de Progreso XP */}
            <div className="flex-1 w-full text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-md tracking-tight">
                  Hola de nuevo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.username || 'Agente'}</span>
                </h1>
                <p className="text-slate-400 mt-1 font-medium">Estás a un paso de dominar el siguiente desafío.</p>
              </div>

              {/* Barra de DaisyUI */}
              <div className="w-full mt-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3"/> Progreso de Rango
                  </span>
                  <span className="text-sm font-bold text-white">
                    {currentXP} <span className="text-slate-500 font-medium">/ {xpForNextLevel} XP</span>
                  </span>
                </div>
                {/* Progress Bar simulada con div para poder poner degradados épicos */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 relative transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {/* Efecto de luz moviéndose */}
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 animate-[pulse_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-right text-xs text-slate-500 mt-2 font-semibold">Te faltan {xpForNextLevel - currentXP} XP para ascender.</p>
              </div>
            </div>

          </div>
        </section>


        {/* ==========================================
            GRID SECUNDARIO: ACCESOS Y MEDALLAS
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

          {/* COLUMNA SUPER IZQUIERDA: CURSO ACTUAL */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-white px-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" /> Operación Principal
            </h2>
            
            <div className="card bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl hover:border-pink-500/30 transition-colors group">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge bg-pink-500/20 text-pink-400 border-pink-500/30 font-bold tracking-wide mb-3">MATEMÁTICAS - ESO 1</span>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Álgebra: Rescate de Variables (Mock)</h3>
                    <p className="text-slate-400">Te quedaste en la Lección 3 analizando las ecuaciones de primer grado para rescatar a 'X'.</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                    <span className="text-xl font-bold text-white">45%</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/courses" className="btn bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white border-none w-full sm:w-auto px-8 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    <Play className="w-4 h-4 mr-2 fill-current"/> Reanudar Vuelo
                  </Link>
                  <Link to="/courses" className="btn btn-ghost text-slate-300 hover:text-white hover:bg-white/5 w-full sm:w-auto">
                     <BookOpen className="w-4 h-4 mr-2" /> Explorar Catálogo
                  </Link>
                </div>
              </div>
            </div>

             {/* ZONA DE MEDALLAS FALSAS */}
             <h2 className="text-2xl font-black text-white px-2 flex items-center gap-2 mt-10">
              <Trophy className="w-6 h-6 text-amber-500" /> Vitrina de Reconocimientos
            </h2>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Primer Despegue', icon: <Flame className="w-6 h-6 text-orange-500"/>, color: 'from-orange-500/20 to-red-600/20', unlocked: true },
                  { name: 'Matemático Novato', icon: <Target className="w-6 h-6 text-blue-400"/>, color: 'from-blue-500/20 to-cyan-500/20', unlocked: true },
                  { name: 'Cartógrafo Espacial', icon: <Compass className="w-6 h-6 text-emerald-400"/>, color: 'from-emerald-500/20 to-green-600/20', unlocked: false },
                  { name: 'Sabio Estelar', icon: <Trophy className="w-6 h-6 text-amber-300"/>, color: 'from-amber-500/20 to-yellow-600/20', unlocked: false },
                ].map((badge, idx) => (
                  <div key={idx} className={`rounded-2xl p-4 border flex flex-col items-center justify-center text-center transition-all ${badge.unlocked ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-lg` : 'bg-slate-900/30 border-white/5 grayscale opacity-50'}`}>
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/10 shadow-inner flex items-center justify-center mb-3">
                       {badge.icon}
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">{badge.name}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* COLUMNA DERECHA: SIDEBAR */}
          <div className="space-y-6">
            <div className="card bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <div className="card-body p-6">
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
            
            <div className="rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 p-6 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
               <h3 className="font-black text-xl text-white mb-2 relative z-10">¿Perdido en el Espacio?</h3>
               <p className="text-sm text-slate-300 mb-6 relative z-10">Consulta a la Búho IA 24/7 para obtener pistas socráticas.</p>
               <button className="btn bg-white text-purple-900 hover:bg-slate-200 border-none w-full shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold relative z-10">
                 Despertar Búho IA
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
