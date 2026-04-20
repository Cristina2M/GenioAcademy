import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Timer, 
  Map as MapIcon,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import axiosInstance from '../api/axios';

// ==========================================
// PÁGINA: Mi Trayectoria Estelar (MySpaceJourney.jsx)
// ==========================================
// Esta página centraliza todo el progreso del alumno, permitiéndole
// filtrar por materia y estado para gestionar su aprendizaje libre.

export default function MySpaceJourney() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para Filtros
  const [filterSubject, setFilterSubject] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const subjects = ['Todas', 'Matemáticas', 'Física', 'Biología y Geología', 'Geografía e Historia', 'Lengua y Literatura'];
  const statuses = ['Todos', 'En Progreso', 'Completados'];

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await axiosInstance.get('courses/courses/my_full_journey/');
        setCourses(response.data);
      } catch (err) {
        setError('No se pudo establecer contacto con el registro de misiones.');
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  // Lógica de Filtrado al vuelo
  const filteredCourses = courses.filter(course => {
    // 1. Filtro por Temario (Asunto)
    const matchesSubject = filterSubject === 'Todas' || course.knowledge_level_name.includes(filterSubject) || (course.category_name === filterSubject);
    
    // 2. Filtro por Estado
    const matchesStatus = filterStatus === 'Todos' || 
      (filterStatus === 'Completados' && course.is_completed) || 
      (filterStatus === 'En Progreso' && !course.is_completed);
    
    // 3. Filtro por búsqueda de texto
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSubject && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fondo espacial decorativo */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-950/20"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header con navegación atrás */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 font-bold text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Volver al Puente de Mando
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
              Mi Trayectoria <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Estelar</span>
              <MapIcon className="w-10 h-10 text-purple-500 hidden md:block" />
            </h1>
            <p className="text-slate-400 mt-2 text-lg max-w-2xl font-medium italic">
              "El conocimiento es el único mapa para navegar el infinito." - Archivo del Maestro.
            </p>
          </div>
          
          <div className="flex bg-slate-800/40 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-xl">
             <div className="text-center px-6 border-r border-white/10">
                <span className="block text-2xl font-black text-white">{courses.length}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Misiones Totales</span>
             </div>
             <div className="text-center px-6">
                <span className="block text-2xl font-black text-green-400">{courses.filter(c => c.is_completed).length}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Completadas</span>
             </div>
          </div>
        </div>

        {/* Barra de Filtros Premium */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          
          {/* Búsqueda */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar misión..." 
              className="input w-full pl-12 bg-slate-950/50 border-white/5 focus:border-cyan-500/50 text-white rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro Temario */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select 
              className="select w-full pl-12 bg-slate-950/50 border-white/5 focus:border-purple-500/50 text-white rounded-2xl appearance-none"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Filtro Estado */}
          <div className="relative">
            <Timer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select 
              className="select w-full pl-12 bg-slate-950/50 border-white/5 focus:border-pink-500/50 text-white rounded-2xl appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button 
            onClick={() => {setFilterSubject('Todas'); setFilterStatus('Todos'); setSearchTerm('');}}
            className="btn bg-slate-950 border-white/5 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold"
          >
            Limpiar Sensores
          </button>
        </div>

        {/* Listado de Cursos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-orbit loading-lg text-cyan-400"></span>
            <p className="mt-4 text-slate-500 font-bold tracking-widest animate-pulse">RECONSTRUYENDO MAPA ESTELAR...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="group relative bg-slate-900/40 border border-white/5 rounded-3xl p-1 transition-all duration-500 hover:scale-[1.02] hover:border-white/20"
              >
                <div className="h-full bg-slate-950/40 backdrop-blur-sm rounded-[22px] p-6 flex flex-col">
                  {/* Status Tag */}
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${
                      course.is_completed 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {course.is_completed ? <CheckCircle2 className="w-3 h-3" /> : <Timer className="w-3 h-3" />}
                      {course.is_completed ? 'Completada' : 'En Progreso'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">{course.category_name}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                    {course.title}
                  </h3>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <BookOpen className="w-4 h-4 text-purple-400" /> 3 Unidades Teóricas
                    </div>
                    <Link 
                      to={`/player/${course.id}`}
                      className={`btn btn-block rounded-2xl font-black text-xs tracking-widest border-none ${
                        course.is_completed 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20'
                      }`}
                    >
                      {course.is_completed ? 'REPASAR DATOS' : 'CONTINUAR MISIÓN'} 
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
            <Rocket className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-500">No se han detectado misiones en este cuadrante.</h2>
            <p className="text-slate-600 mt-2">Prueba a cambiar los filtros o inicia una nueva misión desde el catálogo.</p>
            <Link to="/courses" className="btn btn-outline border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-slate-900 mt-8 rounded-2xl">
              Explorar Catálogo Estelar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
