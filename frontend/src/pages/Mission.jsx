import { Rocket, Target, Users } from 'lucide-react';
import buhoMascot from '../assets/img/stikers/buho5.png'; // Cambiamos el buho para variar

export default function Mission() {
  return (
    <div className="min-h-screen relative pt-16 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/80 border border-purple-500/30 text-purple-300 font-semibold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            🌟 Nuestra Filosofía
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-md mb-6">
            La <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Misión</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Queremos transformar la manera en la que los estudiantes de la ESO entienden el mundo. Creemos que la educación no debe ser un bloque rígido, sino un viaje espacial a medida de cada mente curiosa.
          </p>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 border border-pink-500/30">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white">El "Netflix" Educativo</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                A diferencia de la enseñanza tradicional que te obliga a comprar cursos de un año completo, nosotros dividimos el currículo en "temas sueltos" (Micro-clases). Te suscribes y eliges dominar exactamente aquello en lo que necesitas ayuda hoy mismo.
              </p>
            </div>
            {/* Resplandor decorativo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors"></div>
          </div>

          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl scale-110"></div>
            <img src={buhoMascot} alt="Mascota Genio Academy" className="relative z-10 w-80 drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] animate-[pulse_4s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Filosofía y Valores */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl text-center relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 relative z-10">Por qué somos diferentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="bg-slate-800/70 rounded-2xl p-8 border border-white/5 border-t-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-shadow">
              <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">Avance Dinámico</h4>
              <p className="text-slate-400 leading-relaxed">Si eres excelente en geometría pero necesitas tiempo extra en fracciones, Genio Academy se adapta. Estudias cada materia según tu propio nivel real de conocimiento, no por tu edad cronológica.</p>
            </div>
            <div className="bg-slate-800/70 rounded-2xl p-8 border border-white/5 border-t-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-shadow">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">Entorno Sin Estrés</h4>
              <p className="text-slate-400 leading-relaxed">Nuestro ecosistema, tutorizado por inteligencia artificial y profesores de verdad, asegura un espacio libre de presiones donde equivocarte sea visto como el primer paso esencial para aprender.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
