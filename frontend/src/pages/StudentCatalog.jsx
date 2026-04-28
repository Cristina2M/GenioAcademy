import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axios';
import ProfessorCard from '../components/ProfessorCard';
import AuthContext from '../context/AuthContext';
import { Search, GraduationCap, Filter, Sparkles } from 'lucide-react';
import '../styles/professors.css';

/**
 * Catálogo Escolar Galáctico - Vista exclusiva para alumnos.
 */
const StudentCatalog = () => {
    const { user } = useContext(AuthContext);
    const [professors, setProfessors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profRes, catRes] = await Promise.all([
                    axiosInstance.get('teachers/professors/'),
                    axiosInstance.get('courses/categories/')
                ]);

                setProfessors(profRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Error cargando el catálogo escolar:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Al entrar al Claustro, marcamos todas las notificaciones como leídas
        // para que el badge del Navbar desaparezca
        if (user?.subscription_level >= 3) {
            axiosInstance.post('teachers/consultations/mark_as_read/').catch(() => {});
        }
    }, []);

    const filteredProfessors = professors.filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.subjects.includes(parseInt(selectedCategory));
        const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center">
                <span className="loading loading-orbit loading-lg text-teal-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[#050510] relative overflow-hidden">
            {/* Luces decorativas de fondo */}
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Alumno */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 text-teal-400 mb-4 uppercase tracking-[0.4em] font-black text-xs">
                        <GraduationCap className="w-5 h-5"/> Directorio de Maestros
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                        Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 animate-gradient-x">Sabios Estelares</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl font-medium text-lg border-l-2 border-white/10 pl-6 py-2">
                        Consulta la trayectoria completa de tus mentores. Filtra por especialidad para encontrar al guía adecuado para tu próxima misión académica.
                    </p>
                </motion.div>

                {/* Filtros y Buscador */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col xl:flex-row gap-8 mb-16 items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md"
                >
                    <div className="flex flex-wrap gap-3 items-center flex-1 justify-center lg:justify-start">
                        <div className="flex items-center gap-2 text-slate-500 mr-4">
                            <Filter className="w-4 h-4"/> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sectores de Sabiduría:</span>
                        </div>
                        <button 
                            className={`btn btn-sm rounded-full px-6 text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${selectedCategory === 'all' ? 'bg-teal-500 text-black border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            Ver Todo el Firmamento
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                className={`btn btn-sm rounded-full px-6 text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${selectedCategory === cat.id.toString() ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                                onClick={() => setSelectedCategory(cat.id.toString())}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full max-w-sm search-glow rounded-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar maestro por nombre o título..." 
                            className="input input-bordered w-full bg-black/40 border-white/5 rounded-full pl-14 pr-6 h-14 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 placeholder:font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* Grid Resultados */}
                <AnimatePresence mode='wait'>
                    {filteredProfessors.length > 0 ? (
                        <motion.div 
                            key={selectedCategory + searchTerm}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20"
                        >
                            {filteredProfessors.map((prof, index) => (
                                <motion.div
                                    key={prof.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProfessorCard professor={prof} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-40 rounded-[3rem] bg-white/5 border border-dashed border-white/10"
                        >
                            <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-700 border border-white/5">
                                 <Search className="w-12 h-12"/>
                            </div>
                            <h3 className="text-white text-3xl font-black mb-4 tracking-tight">Señal Perdida en este Sector</h3>
                            <p className="text-slate-500 italic max-w-md mx-auto text-lg">No hemos localizado ningún mentor que coincida con tus coordenadas de búsqueda. Prueba con otros criterios o reinicia los sensores.</p>
                            <button 
                                onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} 
                                className="btn btn-ghost hover:bg-teal-500/10 text-teal-400 mt-8 rounded-full px-8 gap-2 font-black uppercase text-xs tracking-widest"
                            >
                                <Sparkles className="w-4 h-4" />
                                Reiniciar Sensores Galácticos
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentCatalog;
