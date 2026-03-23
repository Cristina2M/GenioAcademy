import { Rocket, Target, Users, BookOpen, ShieldCheck, Brain, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import buhoMascot from '../assets/img/stikers/buho5.png'; // Cambiamos el buho para variar

export default function Mission() {
  return (
    <div className="min-h-screen relative pt-16 pb-32">
      {/* Fondos Decorativos */}
      <div className="absolute top-[5%] left-[5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera para Padres */}
        <div className="text-center mb-24 lg:w-4/5 mx-auto">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/80 border border-purple-500/30 text-purple-300 font-semibold mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Star className="w-5 h-5 text-amber-400" /> Para Padres y Madres Inconformistas
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-md mb-8 leading-tight">
            El futuro de tus hijos no cabe en un aula <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">tradicional</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
            Genio Academy es la primera plataforma online para alumnos de Educación Secundaria (ESO) diseñada para romper las limitaciones del modelo clásico. Aquí, el temario se adapta al estudiante, y no al revés.
          </p>
        </div>

        {/* El Problema vs La Solución */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden group">
            <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-red-400 rounded-full"></span> El Problema Actual
            </h3>
            <ul className="space-y-4 text-slate-300 text-lg">
              <li className="flex gap-3">
                <span className="text-red-400">❌</span> El aula obliga a 30 alumnos a avanzar al mismo ritmo.
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">❌</span> Si tu hijo no entiende la base, se frustra en los temas más avanzados.
              </li>
              <li className="flex gap-3">
                <span className="text-red-400">❌</span> Los errores se penalizan públicamente, generando miedo a participar o preguntar dudas.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors"></div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3 relative z-10">
              <span className="w-8 h-1 bg-cyan-400 rounded-full"></span> La Galaxia "Genio"
            </h3>
            <ul className="space-y-4 text-slate-300 text-lg relative z-10">
              <li className="flex gap-3">
                <span className="text-cyan-400 text-xl">✅</span> Aprendizaje asíncrono y flexible, como un "Netflix" del conocimiento.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 text-xl">✅</span> Micro-clases específicas: cubrimos las lagunas de aprendizaje exactas que necesite.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 text-xl">✅</span> El error es parte de la misión. Fallar un ejercicio es el primer paso para dominarlo.
              </li>
            </ul>
          </div>
        </div>

        {/* Profundizamos en el Método */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Nuestra Metodología en 3 Pilares</h2>
          
          <div className="space-y-12">
            {/* Pilar 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-pink-500/30 transition-all">
              <div className="p-6 bg-pink-500/10 rounded-2xl flex-shrink-0">
                <Target className="w-16 h-16 text-pink-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Temario Modular y Especifico</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Ya no vendemos cursos enteros de "Matemáticas de 3º ESO". Si tu hijo o hija sabe geometría pero tiene problemas con las fracciones, no le hacemos repetir todo. Nuestro temario está troceado en conocimientos hiper-específicos. Entra, busca el catálogo exacto de "Fracciones", y domina esa cápsula de conocimiento de forma enfocada y rápida.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all">
              <div className="p-6 bg-purple-500/10 rounded-2xl flex-shrink-0">
                <Brain className="w-16 h-16 text-purple-400" />
              </div>
              <div className="lg:text-right">
                <h3 className="text-3xl font-bold text-white mb-4">Inteligencia Artificial y Profesores Reales</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Contamos con un Asistente Búho de IA entrenado exclusivamente con nuestro temario para resolver dudas a las 3 de la mañana si es necesario. Y si eso no basta, nuestros planes superiores incluyen tutorías "1 a 1" ilimitadas con profesores cualificados. Siempre habrá alguien ahí para desatascar el aprendizaje.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="p-6 bg-cyan-500/10 rounded-2xl flex-shrink-0">
                <ShieldCheck className="w-16 h-16 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Un Entorno Totalmente Seguro</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  La barrera número uno en la educación presencial es el miedo al ridículo frente a compañeros. En Genio Academy fomentamos la autonomía. Los ejercicios autocorregibles gamificados permiten intentarlo tantas veces como se necesite sin juzgar, premiando el esfuerzo y la constancia diaria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Confianza / CTA para Padres */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-10 md:p-16 border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="text-left md:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para encender los motores del éxito escolar?</h2>
              <p className="text-indigo-200 text-xl mb-8">
                Invertir en la educación adaptada de tus hijos es garantizarles habilidades vitales como la gestión del tiempo, autonomía y pensamiento crítico. 
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn bg-cyan-500 hover:bg-cyan-400 text-slate-900 border-none btn-lg px-8 rounded-full font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  Explorar Catálogo de Estímulos
                </Link>
                <Link to="/login" className="btn btn-outline border-indigo-400 text-indigo-300 hover:bg-indigo-500 hover:text-white btn-lg px-8 rounded-full">
                  Contactar con un Asesor <ArrowRight className="ml-2 w-5 h-5"/>
                </Link>
              </div>
            </div>

            <div className="md:w-1/3 flex justify-center">
               <img src={buhoMascot} alt="Garantía Genio Academy" className="w-64 md:w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-[bounce_4s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
