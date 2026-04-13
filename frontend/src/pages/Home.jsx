import { ArrowRight, Map, BrainCircuit, Compass, Telescope, Star, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import buhoMascot from '../assets/img/stikers/buho1.png';
import ProfessorCard from '../components/ProfessorCard';

export default function Home() {
  const [featuredProfs, setFeaturedProfs] = useState([]);

  useEffect(() => {
    // Cargar solo los profesores destacados (acceso público)
    axios.get('http://localhost:8000/api/teachers/professors/')
      .then(res => setFeaturedProfs(res.data))
      .catch(err => console.error("Error cargando profesores destacados:", err));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Elementos decorativos (Nebulosas de fondo animadas) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none animate-[pulse_8s_infinite] z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[0%] left-[20%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <div className="pt-24 pb-32 relative z-10 flex items-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Texto y Botones (Izquierda) */}
            <div className="text-center lg:text-left lg:w-[55%] relative">
              
              {/* Etiqueta flotante */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 font-semibold mb-8 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md animate-[bounce_4s_infinite]">
                <Star className="w-5 h-5 text-amber-400" /> La nueva era de la Educación Secundaria
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[1.1] drop-shadow-lg">
                El universo de aprendizaje a tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]">propio ritmo</span>
              </h1>
              
              <p className="py-2 text-2xl text-slate-300/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Genio Academy revoluciona tu aprendizaje estructurando el currículo escolar por 
                <strong className="text-cyan-300 font-bold mx-2">cápsulas hiper-específicas</strong>. 
                Conquista cada tema y descubre de lo que eres capaz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/courses" className="btn border-none bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 btn-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] rounded-2xl px-8 font-extrabold text-lg hover:-translate-y-1 transition-transform">
                  Entrar al Catálogo <ArrowRight className="ml-2 w-6 h-6"/>
                </Link>
                <Link to="/mission" className="btn bg-slate-900/60 backdrop-blur-md border border-slate-600 text-white hover:bg-slate-800 hover:border-pink-500/50 btn-lg rounded-2xl px-8 text-lg hover:-translate-y-1 transition-all">
                  Descubrir la Filosofía
                </Link>
              </div>

              {/* Estadísticas rápidas o prueba social */}
              <div className="mt-14 flex items-center justify-center lg:justify-start gap-8 border-t border-white/10 pt-8">
                <div>
                  <div className="text-3xl font-black text-white">40+</div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold mt-1">Galaxias (Temas)</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">24/7</div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold mt-1">Asistencia IA</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="flex items-center -space-x-3 mb-1 justify-center lg:justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-900"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 border-2 border-slate-900"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-bold">+1k</div>
                  </div>
                  <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Alumnos activos</div>
                </div>
              </div>

            </div>

            {/* Búho Mascot y Elemento visual derecho */}
            <div className="lg:w-[45%] flex justify-center relative mt-16 lg:mt-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 rounded-full blur-[100px] scale-125"></div>
               
               {/* Orbitalrings effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-cyan-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
               
               <img src={buhoMascot} alt="Búho Genio Mascot" className="relative z-10 w-96 lg:w-[32rem] drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-[bounce_5s_ease-in-out_infinite]" />
               
            </div>

          </div>
        </div>
      </div>

      {/* Características (Glassmorphism Cards) */}
      <div className="py-32 relative z-10 border-t border-white/5 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-24 relative">
             <span className="text-cyan-400 font-bold tracking-widest uppercase mb-3 block">Nuestra nave nodriza</span>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
               Una Plataforma de Otro <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Mundo</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl hover:-translate-y-3 transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_0_50px_rgba(236,72,153,0.15)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="card-body items-start text-left p-10">
                <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-8 text-pink-400 shadow-[inset_0_0_20px_rgba(236,72,153,0.2)] border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                  <Map className="w-8 h-8"/>
                </div>
                <h3 className="card-title text-3xl font-bold text-white mb-4">Micro-Cápsulas</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Olvídate de matricularte en cursos genéricos enteros. Accede al catálogo, busca exactamente el conocimiento hiper-específico que se te resiste, y destrózalo en un tiempo récord y a tu ritmo logrando victorias rápidas y continuas.</p>
              </div>
            </div>

            <div className="card bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl hover:-translate-y-3 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.15)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="card-body items-start text-left p-10">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                  <BrainCircuit className="w-8 h-8"/>
                </div>
                <h3 className="card-title text-3xl font-bold text-white mb-4">IA Estelar</h3>
                <p className="text-slate-400 text-lg leading-relaxed">¿Te estancas en un ejercicio a las 2 de la madrugada? Resuelve dudas al instante con nuestro Búho Inteligente. Está entrenado exclusivamente sobre la teoría para dar pistas socráticas sin revelar nunca directamente el tesoro a tus hijos.</p>
              </div>
            </div>

            <div className="card bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl hover:-translate-y-3 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-150 duration-700"></div>
              <div className="card-body items-start text-left p-10">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-400 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)] border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Telescope className="w-8 h-8"/>
                </div>
                <h3 className="card-title text-3xl font-bold text-white mb-4">Tutorías 1 a 1</h3>
                <p className="text-slate-400 text-lg leading-relaxed">No hemos olvidado el calor humano. La tecnología está guiada por expertos académicos. Si te pierdes en las órbitas altas y necesitas apoyo crítico, puedes agendar videollamadas privadas para solventar tus mayores desafíos de la ESO con empatía real.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Sección del Claustro Destacado (Para padres y visitantes) */}
      <div className="py-32 relative z-10 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div className="max-w-2xl text-left">
                    <span className="text-teal-400 font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5"/> Experiencia de Vanguardia
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                        Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Facultad Galáctica</span>
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed">
                        En Genio Academy, la tecnología está al servicio de la maestría humana. 
                        Contamos con un equipo de docentes apasionados, especializados en motivar y guiar 
                        a los alumnos a través de los desafíos más complejos de la ESO.
                    </p>
                </div>
                <Link to="/register" className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-black rounded-2xl px-10">
                    Conocer a todo el equipo
                </Link>
            </div>

            {/* Grid de profesores destacados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredProfs.map(prof => (
                    <ProfessorCard key={prof.id} professor={prof} />
                ))}
                
                {/* Card de "Únete" para fomentar el registro */}
                <div className="card bg-gradient-to-br from-slate-900/60 to-purple-900/20 backdrop-blur-xl border border-dashed border-white/10 shadow-2xl flex items-center justify-center p-10 text-center group hover:border-purple-500/50 transition-all">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Users className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">¿Buscas un tutor específico?</h3>
                    <p className="text-slate-400 mb-8">Registra a tu hijo para acceder al claustro completo de expertos y agendar su primera tutoría.</p>
                    <Link to="/register" className="btn btn-primary rounded-xl px-8 shadow-lg shadow-purple-500/20">
                        Abrir Cuenta de Alumno
                    </Link>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}
