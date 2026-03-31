import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("Todos los campos obligatorios.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    const result = await registerUser({ username, email, password });
    if (!result.success) {
      setErrorMsg(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center py-20 overflow-hidden">
      
      {/* Luces expansivas de fondo */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_7s_infinite] z-0"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none animate-[pulse_5s_infinite] z-0"></div>

      {/* Tarjeta de Registro */}
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="card bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
          
          {/* Adorno superior central */}
          <div className="absolute -top-6 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl rotate-45 border-4 border-slate-900 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center">
             <div className="-rotate-45 text-white">
                <UserPlus className="w-5 h-5"/>
             </div>
          </div>

          <div className="card-body p-8 sm:p-10 w-full mt-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                Únete a la <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Academia</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Configura tu perfil de estudiante y comienza a subir de rango hoy mismo.</p>
            </div>

            {errorMsg && (
              <div className="alert alert-error bg-pink-900/50 text-pink-200 border border-pink-500 mb-6 flex rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-slate-300 font-semibold text-sm tracking-wide">Código de Estudiante (Username)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ej: javier_alonso_04" 
                    className="input w-full pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all rounded-xl" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-slate-300 font-semibold text-sm tracking-wide">Correo electrónico</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="alumno@instituto.es" 
                    className="input w-full pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all rounded-xl" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-slate-300 font-semibold text-sm tracking-wide">Clave de Seguridad (Contraseña)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min 8 carácteres..." 
                    className="input w-full pl-11 pr-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all rounded-xl" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-pink-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn w-full mt-6 border-none bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-xl font-extrabold text-base transition-transform"
              >
                {isLoading ? <span className="loading loading-spinner text-white"></span> : <>Solicitar Acceso Oficial <ArrowRight className="w-5 h-5 ml-1"/></>}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/5 pt-6">
              ¿Ya estás matriculado?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:underline inline-flex items-center">
                Abre tu terminal aquí
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
