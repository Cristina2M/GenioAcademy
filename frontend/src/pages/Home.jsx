import { ArrowRight, GraduationCap, Map, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import buho1 from '../assets/img/stikers/buho1.png';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      
      {/* Elementos decorativos simulando nebulosas brillantes */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="pt-20 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Texto y Botones */}
            <div className="text-center lg:text-left lg:w-3/5">
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/80 border border-pink-500/30 text-pink-300 font-semibold mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                ⭐ Educación Secundaria Interactiva
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                El universo de aprendizaje a tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">propio ritmo</span>
              </h1>
              <p className="py-2 text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Genio Academy es el "Netflix Educativo". Rompemos las reglas estructurando los cursos por <strong className="text-cyan-300">niveles de conocimiento</strong> específicos y temarios sueltos en lugar de cursos rígidos enteros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses" className="btn border-none bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white btn-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] rounded-full px-8">
                  Ver Catálogo Estelar <ArrowRight className="ml-2 w-5 h-5"/>
                </Link>
                <Link to="/signup" className="btn bg-slate-800/80 border border-slate-600 text-white hover:bg-slate-700 btn-lg rounded-full px-8">
                  Misión de Prueba
                </Link>
              </div>
            </div>

            {/* Búho Mascot (Sticker) */}
            <div className="lg:w-2/5 flex justify-center relative mt-12 lg:mt-0">
               {/* Resplandor detrás del búho */}
               <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl scale-110"></div>
               <img src={buho1} alt="Búho Genio Mascot" className="relative z-10 w-80 lg:w-96 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[bounce_4s_ease-in-out_infinite]" />
            </div>

          </div>
        </div>
      </div>

      {/* Características (Glassmorphism Cards) */}
      <div className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative">
             {/* "Hoja de Libreta" estilización para el título inspirada en la presentación */}
            <div className="inline-block relative">
               <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                 Nuestra Metodología
               </h2>
               <div className="h-2 w-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full mt-2 opacity-80"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] group">
              <div className="card-body items-center text-center">
                <div className="w-20 h-20 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(236,72,153,0.2)]">
                  <Map className="w-10 h-10"/>
                </div>
                <h3 className="card-title text-2xl font-bold text-white mb-2">Micro-Clases</h3>
                <p className="text-slate-400">Temario dividido en conocimientos hiper-específicos (ej. Funciones, Sintaxis). Directo al conocimiento exacto que necesitas.</p>
              </div>
            </div>

            <div className="card bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] group">
              <div className="card-body items-center text-center">
                <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]">
                  <BrainCircuit className="w-10 h-10"/>
                </div>
                <h3 className="card-title text-2xl font-bold text-white mb-2">IA Estelar</h3>
                <p className="text-slate-400">Resuelve dudas al instante con nuestro búho inteligente entrenado sobre los ejercicios y teoría del catálogo base.</p>
              </div>
            </div>

            <div className="card bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-transform duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group">
              <div className="card-body items-center text-center">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
                  <GraduationCap className="w-10 h-10"/>
                </div>
                <h3 className="card-title text-2xl font-bold text-white mb-2">Flexibilidad Total</h3>
                <p className="text-slate-400">Desde acceso libre a ejercicios autocorregibles, hasta tutorías personalizadas ilimitadas con nuestra academia central.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
