import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff, AlertCircle, Rocket, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);

  // Estados del Formulario (Wizard)
  const [step, setStep] = useState(1); // 1 = Selección de Plan, 2 = Datos de Usuario
  const [selectedPlan, setSelectedPlan] = useState(1); // 1: Base, 2: Luz, 3: Gusano

  // Datos del Usuario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setStep(2); // Avanza al formulario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("Todos los campos obligatorios.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    
    // Inyectamos subscription_level: selectedPlan
    const result = await registerUser({ 
        username, 
        email, 
        password,
        subscription_level: selectedPlan
    });
    
    if (!result.success) {
      setErrorMsg(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-24 pb-32 overflow-hidden">
      
      {/* Luces expansivas de fondo */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_7s_infinite] z-0"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none animate-[pulse_5s_infinite] z-0"></div>

      {step === 1 && (
        <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4">
                Elige tu billete a las <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">estrellas</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                Para completar la matriculación en Genio Academy, selecciona el nivel de soporte que tu tripulación necesita.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
              {/* Nivel 1 */}
              <div 
                onClick={() => handleSelectPlan(1)}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-8 hover:-translate-y-4 hover:border-cyan-500/50 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
              >
                <BookOpen className="w-12 h-12 text-slate-400 mb-6 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-2xl font-bold text-white mb-2">Órbita Base</h3>
                <p className="text-slate-400 mb-6 min-h-[50px] text-sm">El acceso perfecto para mentes autodidactas que solo necesitan los materiales.</p>
                <div className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-6 w-full">
                  Gratis
                </div>
                <ul className="space-y-4 mb-8 text-left w-full text-sm">
                  <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Acceso visual ilimitado al índice.</li>
                  <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Micro-clases teóricas (Lectura).</li>
                  <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Evaluaciones límite al final de la lección.</li>
                </ul>
                <div className="mt-auto w-full">
                  <button className="btn btn-outline border-cyan-500/50 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 w-full rounded-2xl">
                    Crear Cuenta Base
                  </button>
                </div>
              </div>

              {/* Nivel 2 */}
              <div 
                onClick={() => handleSelectPlan(2)}
                className="bg-slate-800/90 backdrop-blur-xl border-2 border-pink-500 rounded-3xl p-8 transform md:-translate-y-6 shadow-[0_0_50px_rgba(236,72,153,0.2)] hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] transition-all flex flex-col items-center text-center cursor-pointer relative group"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black px-6 py-2 rounded-full text-sm tracking-wide shadow-lg uppercase whitespace-nowrap">
                  Plan Estrella ⭐
                </div>
                <Rocket className="w-14 h-14 text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-bold text-pink-300 mb-2">Velocidad Luz</h3>
                <p className="text-slate-300 mb-6 min-h-[50px] text-sm">Acompañamiento impulsado por Inteligencia Artificial y datos de rendimiento.</p>
                <div className="text-5xl font-black text-white mb-8 border-b border-white/10 pb-6 w-full">
                  19€<span className="text-xl text-slate-400 font-normal">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 text-left w-full text-sm">
                  <li className="flex items-start gap-3 text-white font-medium border-b border-white/5 pb-2"><CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" /> Todo lo incluido en Base</li>
                  <li className="flex items-start gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" /> Ejercicios Interactivos Ilimitados</li>
                  <li className="flex items-start gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" /> Asistente de IA (Búho Genio) 24/7</li>
                </ul>
                <div className="mt-auto w-full">
                  <button className="btn bg-gradient-to-r from-pink-500 to-purple-600 group-hover:from-pink-400 group-hover:to-purple-500 text-white border-none w-full rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)] text-lg">
                    Empezar Plan Pro
                  </button>
                </div>
              </div>

              {/* Nivel 3 */}
              <div 
                onClick={() => handleSelectPlan(3)}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-8 hover:-translate-y-4 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
              >
                <Users className="w-12 h-12 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors" />
                <h3 className="text-2xl font-bold text-purple-300 mb-2">Agujero de Gusano</h3>
                <p className="text-slate-400 mb-6 min-h-[50px] text-sm">Experiencia mega-premium con profesores reales para suspensos críticos.</p>
                <div className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-6 w-full">
                  89€<span className="text-xl text-slate-400 font-normal">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 text-left w-full text-sm">
                  <li className="flex items-start gap-3 text-slate-200 font-medium border-b border-white/5 pb-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> Todo lo de Velocidad Luz</li>
                  <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> 2h de Tutoría Privada por videollamada</li>
                  <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Contacto directo con padres semestral</li>
                </ul>
                <div className="mt-auto w-full">
                  <button className="btn bg-slate-800/80 border border-purple-500/50 text-purple-300 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400 w-full rounded-2xl transition-all">
                    Matricular Plan Élite
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-slate-400">
               ¿Ya tienes tu billete sellado? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors hover:underline">Accede a la Terminal</Link>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="relative z-10 w-full max-w-lg px-6 animate-[scale-up_0.3s_ease-out]">
          <div className="card bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
            
            {/* Adorno superior central modificado según el plan */}
            <div className={`absolute -top-6 w-12 h-12 rounded-xl rotate-45 border-4 border-slate-900 flex items-center justify-center shadow-lg
              ${selectedPlan === 1 ? 'bg-cyan-500 text-slate-900' : selectedPlan === 2 ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'bg-purple-600 text-white'}
            `}>
               <div className="-rotate-45">
                  <UserPlus className="w-5 h-5"/>
               </div>
            </div>

            <div className="card-body p-8 sm:p-10 w-full mt-6">
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn btn-sm btn-ghost absolute top-4 left-4 text-slate-400 hover:text-white"
              >
                Vover Iniciar
              </button>

              <div className="text-center mb-8 mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border
                   ${selectedPlan === 1 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 
                     selectedPlan === 2 ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 
                     'bg-purple-500/20 text-purple-300 border-purple-500/30'}
                `}>
                  Plan Seleccionado: Nivel {selectedPlan}
                </span>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-md">
                  Crear Identidad
                </h1>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Protegemos tus datos con cifrado de grado espacial. (No se cobrará nada durante el registro simulado).</p>
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
                  className={`btn w-full mt-6 border-none shadow-lg rounded-xl font-extrabold text-base transition-transform
                    ${selectedPlan === 1 ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.3)]' :
                      selectedPlan === 2 ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' :
                      'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'}
                  `}
                >
                  {isLoading ? <span className="loading loading-spinner text-white"></span> : <>Finalizar Misión de Registro <ArrowRight className="w-5 h-5 ml-1"/></>}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
