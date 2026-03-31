import { Rocket, Target, Users, BookOpen, ShieldCheck, Brain, ArrowRight, Star, CheckCircle2, HelpCircle } from 'lucide-react';
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
            <Star className="w-5 h-5 text-amber-400" /> Para Padres, Madres y Tutores Inconformistas
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
            <ul className="space-y-5 text-slate-300 text-lg">
              <li className="flex gap-4 items-start">
                <span className="text-red-400 mt-1">❌</span> 
                <span><strong>El ritmo es inamovible:</strong> El profesor avanza para 30 alumnos al mismo tiempo. Si no lo entiendes, te quedas atrás irremediablemente.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-red-400 mt-1">❌</span> 
                <span><strong>La bola de nieve de las lagunas:</strong> Las matemáticas son secuenciales. No entender el nivel básico hace imposible aprobar el nivel avanzado.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-red-400 mt-1">❌</span> 
                <span><strong>Penalización social:</strong> Los errores se marcan en rojo frente a todos. Esto anula la confianza y genera fobia a intentar resolver problemas difíciles.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_30px_rgba(34,211,238,0.1)] relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors"></div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3 relative z-10">
              <span className="w-8 h-1 bg-cyan-400 rounded-full"></span> La Galaxia "Genio"
            </h3>
            <ul className="space-y-5 text-slate-300 text-lg relative z-10">
              <li className="flex gap-4 items-start">
                <span className="text-cyan-400 mt-1 text-2xl">✅</span> 
                <span><strong>Aprendizaje a tu ritmo:</strong> Como un "Netflix". Tu hijo consume, repasa y avanza en los conceptos al ritmo que su cerebro dicta, sin estrés de calendario.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-cyan-400 mt-1 text-2xl">✅</span> 
                <span><strong>Micro-clases focalizadas:</strong> Compras habilidades, no cursos anuales. Solucionamos la laguna exacta que necesita para sacar adelante sus exámenes de instituto hoy mismo.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-cyan-400 mt-1 text-2xl">✅</span> 
                <span><strong>El error como herramienta:</strong> Nuestra IA y nuestro entorno premian el intento constante. Fracasar no baja la nota en un examen público, sube la experiencia en un juego mental privado.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Profundizamos en el Método */}
        <div className="mb-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20 drop-shadow-sm">Nuestra Metodología en 3 Pilares</h2>
          
          <div className="space-y-12">
            {/* Pilar 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-pink-500/30 transition-all shadow-xl">
              <div className="p-6 bg-pink-500/10 rounded-3xl flex-shrink-0 shadow-[inset_0_0_20px_rgba(236,72,153,0.3)] border border-pink-500/20">
                <Target className="w-16 h-16 text-pink-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Currículo Troceado para Victorias Rápidas</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Ya no vendemos cursos rígidos enteros de "Matemáticas de 3º ESO". Si tu hijo o hija es excelente en geometría pero tiene problemas severos con las fracciones, <strong>no le hacemos perder el tiempo</strong> repitiendo lo que ya sabe. Nuestro temario está troceado en conocimientos hiper-específicos. Entra al catálogo, selecciona "Fracciones", y domina esa cápsula en exclusiva para lograr un subidón de la nota inmediato y directo.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all shadow-xl">
              <div className="p-6 bg-purple-500/10 rounded-3xl flex-shrink-0 shadow-[inset_0_0_20px_rgba(168,85,247,0.3)] border border-purple-500/20">
                <Brain className="w-16 h-16 text-purple-400" />
              </div>
              <div className="lg:text-right">
                <h3 className="text-3xl font-bold text-white mb-4">Inteligencia Artificial Especializada & Profesores Humanos</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Genio Academy nunca duerme. Contamos con un <strong>Asistente Estelar de Inteligencia Artificial ("Búho Genio")</strong>, entrenado exclusivamente con nuestro temario para resolver dudas de los ejercicios hasta la madrugada si tienen un examen al día siguiente. Y para cuando una máquina no basta, nuestros niveles de suscripción premium proporcionan <strong>tutorías 1 a 1 integradas</strong> con profesores expertos. Siempre habrá alguien ahí para desatascar la mente.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 bg-slate-800/40 rounded-3xl p-8 border border-white/5 hover:border-cyan-500/30 transition-all shadow-xl">
              <div className="p-6 bg-cyan-500/10 rounded-3xl flex-shrink-0 shadow-[inset_0_0_20px_rgba(34,211,238,0.3)] border border-cyan-500/20">
                <ShieldCheck className="w-16 h-16 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">El Santuario de la Confianza y la Práctica</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Sabemos que la barrera número uno para el rendimiento bajo es el miedo atroz al ridículo en clase. Nuestra plataforma fomenta la práctica intensiva y privada. Tienen <strong>ejercicios gamificados e ilimitados</strong> con corrección instantánea y pistas. Es un entorno libre de prejuicios en donde sentirse estancado es normal y superar cada nivel se siente como ganar en su videojuego favorito. Promovemos el <em>'aprender haciendo'</em> de forma contínua y adictiva.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planes de Misión (Pricing) */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Misiones adaptadas a cada familia</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              No importa si necesitas un pequeño apoyo puntual, o requieres una inmersión completa para aprobar un trimestre crítico. Tenemos un billete preparado en nuestra nave nodriza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-10 max-w-6xl mx-auto">
            
            {/* Nivel 1 - Órbita Base */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Órbita Base</h3>
              <p className="text-slate-400 mb-6 min-h-[50px]">El acceso perfecto para mentes autodidactas que solo necesitan los materiales.</p>
              <div className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-6 w-full">
                6,99€<span className="text-sm font-normal text-slate-500 block mt-2">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 text-left w-full text-sm">
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Acceso visual ilimitado al índice del Catálogo Estelar.</li>
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Micro-clases teóricas completas basadas en texto.</li>
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" /> Evaluaciones básicas limitadas al final de la lección.</li>
              </ul>
              <div className="mt-auto w-full">
                <Link to="/register" className="btn btn-outline border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 w-full rounded-2xl">
                  Empezar por 6,99€
                </Link>
              </div>
            </div>

            {/* Nivel 2 - Velocidad Luz (Destacado) */}
            <div className="bg-slate-800/80 backdrop-blur-xl border-2 border-pink-500 rounded-3xl p-8 transform md:-translate-y-4 shadow-[0_0_40px_rgba(236,72,153,0.3)] relative flex flex-col items-center text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black px-6 py-2 rounded-full text-sm tracking-wide shadow-lg uppercase">
                La Misión Estrella ⭐
              </div>
              <Rocket className="w-14 h-14 text-pink-400 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
              <h3 className="text-3xl font-bold text-pink-300 mb-2">Velocidad Luz</h3>
              <p className="text-slate-300 mb-6 min-h-[50px]">El equilibrio perfecto: Acompañamiento impulsado por Inteligencia Artificial y datos.</p>
              <div className="w-full border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-slate-400 line-through text-2xl font-bold">12,99€</span>
                  <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-black px-2 py-0.5 rounded-full">-23%</span>
                </div>
                <div className="text-6xl font-black text-white">
                  9,99€<span className="text-xl text-pink-300 font-normal">/mes</span>
                </div>
                <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl px-4 py-2 flex items-center justify-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span className="text-amber-300 font-black text-sm uppercase tracking-wide">Precio Fundador · Solo los 2 primeros meses</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Después, 12,99€/mes. Cancela cuando quieras.</p>
              </div>
              <ul className="space-y-4 mb-8 text-left w-full text-base">
                <li className="flex items-start gap-3 text-white font-medium border-b border-white/5 pb-2"><CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0" /> Todo lo incluido en "Órbita Base"</li>
                <li className="flex items-start gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" /> <strong>Ejercicios Interactivos Ilimitados</strong> (Sin barreras) que se corrigen automáticamente.</li>
                <li className="flex items-start gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" /> <strong>Asistente Educativo de IA "Búho Genio" 24/7</strong> para resolver dudas en cualquier tarea.</li>
                <li className="flex items-start gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" /> Panel de métricas y reporte mensual de progreso enviado a los padres.</li>
              </ul>
              <div className="mt-auto w-full">
                <Link to="/register" className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white border-none w-full rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)] text-lg">
                  Empezar por 9,99€
                </Link>
              </div>
            </div>

            {/* Nivel 3 - Agujero de Gusano */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-purple-300 mb-2">Agujero de Gusano</h3>
              <p className="text-slate-400 mb-6 min-h-[50px]">La experiencia mega-premium para recuperar control cuando hay suspensos críticos importantes.</p>
              <div className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-6 w-full">
                24,99€<span className="text-xl text-slate-400 font-normal">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 text-left w-full text-sm">
                <li className="flex items-start gap-3 text-slate-200 font-medium border-b border-white/5 pb-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> Todo lo incluido en "Velocidad Luz"</li>
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> <strong>2 horas de Tutoría Privada Semanal ("1 a 1")</strong> por videollamada con un profesor titular de Genio Academy.</li>
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Corrección manual de simulacros de Exámenes Oficiales de ESO.</li>
                <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> <strong>Seguimiento Personalizado:</strong> Plan de ruta semanal trazado por el tutor en contacto con el padre/tutor legal.</li>
              </ul>
              <div className="mt-auto w-full">
                <Link to="/register" className="btn bg-slate-800/80 border border-purple-500/50 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 w-full rounded-2xl transition-all">
                  Consultar Disponibilidad
                </Link>
              </div>
            </div>
            
          </div>
        </div>

        {/* Preguntas Frecuentes (FAQ) */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white flex items-center justify-center gap-4">
              <HelpCircle className="w-10 h-10 text-cyan-400" /> Resolución de Coordendas (FAQ)
            </h2>
            <p className="text-xl text-slate-400 mt-4">Las dudas más habituales de los comandantes familiares en la base.</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            
            <div className="collapse collapse-plus bg-slate-900/60 border border-white/5 shadow-lg group">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title text-xl font-medium text-white group-hover:text-cyan-300 transition-colors">
                ¿Qué pasa si mi hijo necesita ayuda urgente con los deberes a altas horas?
              </div>
              <div className="collapse-content text-slate-400 text-lg leading-relaxed">
                <p>Nuestra Inteligencia Artificial "Búho Genio" (incluída en el plan Velocidad Luz) está capacitada con el temario oficial de Secundaria. Es capaz de guiar a tu hijo paso a paso hacia la respuesta <strong className="text-pink-300">sin darle jamás el resultado masticado o directo.</strong> Es el equivalente a tener un tutor muy paciente al lado del escritorio, disponible a las 2 de la madrugada para que nunca se rinda y se acueste habiendo resuelto sus deberes.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-slate-900/60 border border-white/5 shadow-lg group">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-medium text-white group-hover:text-cyan-300 transition-colors">
                ¿Cómo sé si realmente están progresando y no perdiendo el tiempo?
              </div>
              <div className="collapse-content text-slate-400 text-lg leading-relaxed">
                <p>En el plan central y premium, como tutor principal, recibirás notificaciones y un panel con <strong className="text-pink-300">métricas claras de tiempo útil, ejercicios aprobados y áreas de fricción</strong>. En caso de suscripción superior, un profesor humano hablará contigo rutinariamente para exponerte las mejoras metodológicas implementadas y evitar que te preocupes excesivamente la noche antes del examen escolar.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-slate-900/60 border border-white/5 shadow-lg group">
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-xl font-medium text-white group-hover:text-cyan-300 transition-colors">
                ¿Sirve Genio Academy para un niño que va bien en clase o solo es para reforzar?
              </div>
              <div className="collapse-content text-slate-400 text-lg leading-relaxed">
                <p>Es para ambos perfiles. Como Genio Academy se basa en <strong className="text-pink-300">"Cápsulas Híper-Específicas"</strong>, los estudiantes sobresalientes lo utilizan de maravilla para avanzar en temas de cursos superiores o potenciar sus habilidades, saciando el aburrimiento típico que a veces sufren en la escuela presencial.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Sección de Confianza / CTA para Padres */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 md:p-16 lg:p-20 border border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.2)] text-center relative overflow-hidden mt-32">
          {/* Constelación de fondo decorativa minimalista */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 justify-between">
            <div className="text-left md:w-2/3">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">¿Listo para encender los motores del éxito escolar?</h2>
              <p className="text-indigo-200 text-xl lg:text-2xl mb-10 leading-relaxed font-light">
                Invertir en la educación <strong>adaptativa</strong> de tus hijos es garantizarles habilidades transversales para toda la vida: gestión eficiente del tiempo de estudio, autonomía ante la frustración y una relación mental sana con el error.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/courses" className="btn bg-cyan-500 hover:bg-cyan-400 text-slate-900 border-none btn-lg px-8 rounded-2xl font-bold shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  Explorar Catálogo Estelar
                </Link>
                <Link to="/login" className="btn btn-outline border-indigo-400 text-indigo-300 hover:bg-indigo-500 hover:text-white btn-lg px-8 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] backdrop-blur-md">
                  Contactar con la Comandancia <ArrowRight className="ml-2 w-5 h-5"/>
                </Link>
              </div>
            </div>

            <div className="md:w-1/3 flex justify-center relative">
               <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none"></div>
               <img src={buhoMascot} alt="Garantía Académica" className="w-72 md:w-96 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-[bounce_4s_ease-in-out_infinite] relative z-20" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
