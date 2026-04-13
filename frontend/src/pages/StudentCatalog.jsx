import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import ProfessorCard from '../components/ProfessorCard';
import AuthContext from '../context/AuthContext';
import { Search, GraduationCap, Filter } from 'lucide-react';

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
                // Usamos la instancia configurada que ya maneja tokens y baseURL
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
    }, []);

    // Lógica de filtrado combinada
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
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-[#050510] relative">
            {/* Luces decorativas */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header Alumno */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 text-teal-400 mb-2 uppercase tracking-widest font-black text-sm">
                        <GraduationCap className="w-5 h-5"/> Directorio de Maestros
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Sabios Estelares</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl font-medium">
                        Consulta la trayectoria completa de tus mentores. Filtra por especialidad para encontrar al guía adecuado para tu próxima misión.
                    </p>
                </div>

                {/* Filtros y Buscador */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center flex-1 justify-center lg:justify-start">
                        <div className="flex items-center gap-2 text-slate-500 mr-2">
                            <Filter className="w-4 h-4"/> <span className="text-[10px] font-bold uppercase tracking-widest">Especialidades:</span>
                        </div>
                        <button 
                            className={`btn btn-sm btn-outline rounded-full text-[10px] ${selectedCategory === 'all' ? 'bg-teal-600 text-white border-none' : 'text-slate-400 border-white/10 hover:bg-white/5'}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            Todas las Ramas
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                className={`btn btn-sm btn-outline rounded-full text-[10px] ${selectedCategory === cat.id.toString() ? 'bg-teal-600 text-white border-none' : 'text-slate-400 border-white/10 hover:bg-white/5'}`}
                                onClick={() => setSelectedCategory(cat.id.toString())}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar maestro por nombre..." 
                            className="input input-bordered w-full bg-black/40 border-white/10 rounded-full pl-12 text-sm text-white focus:border-teal-500 focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Resultados */}
                {filteredProfessors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {filteredProfessors.map(prof => (
                            <ProfessorCard key={prof.id} professor={prof} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-[2.5rem] bg-indigo-500/5 border border-dashed border-white/5">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                             <Search className="w-10 h-10"/>
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">Sin rastro del maestro</h3>
                        <p className="text-slate-500 italic max-w-xs mx-auto">No hemos encontrado ningún docente que coincida con tu búsqueda en este sector estelar.</p>
                        <button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} className="btn btn-ghost btn-xs text-teal-400 mt-4">Reiniciar filtros</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCatalog;
