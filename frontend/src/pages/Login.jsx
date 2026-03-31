import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-20 overflow-hidden">
      
      {/* Luces y Nebulosas de fondo animadas (Aura espacial) */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none animate-[pulse_6s_infinite] z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_infinite] z-0"></div>

      {/* Tarjeta Glassmorfismo de Login */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Orbital ring centralizado en la tarjeta */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-[spin_40s_linear_infinite] -z-10"></div>
        
        <div className="card bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="card-body p-8 sm:p-10">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                Bienvenido de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Vuelta</span>
              </h1>
              <p className="text-slate-400 text-sm">Introduce tus credenciales para reanudar tu viaje de conocimiento.</p>
            </div>

            <form className="space-y-6">
              
              {/* Campo Nombre de Usuario (Para SimpleJWT solemos usar username o email) */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-slate-300 font-semibold text-sm tracking-wide">Usuario / Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="estudiante@genio.edu" 
                    className="input w-full pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all rounded-xl" 
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-slate-300 font-semibold text-sm tracking-wide">Contraseña secreta</span>
                  <a href="#" className="label-text-alt text-cyan-400 hover:text-cyan-300 transition-colors">¿Contraseña olvidada?</a>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="input w-full pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all rounded-xl" 
                  />
                </div>
              </div>

              {/* Botón Principal Login */}
              <button 
                type="button" 
                className="btn w-full mt-4 border-none bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-xl font-extrabold text-base hover:-translate-y-0.5 transition-transform"
              >
                <LogIn className="w-5 h-5 mr-1" /> Desbloquear Terminal
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
              ¿Eres un nuevo recluta? <br className="sm:hidden"/>
              <Link to="/register" className="text-pink-400 hover:text-pink-300 font-bold ml-1 transition-colors drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:underline inline-flex items-center">
                Inicia tu proceso de admisión <ArrowRight className="w-4 h-4 ml-1 inline"/>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
