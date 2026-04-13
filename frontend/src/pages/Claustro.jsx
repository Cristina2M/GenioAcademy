import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProfessorCard from '../components/ProfessorCard';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, GraduationCap } from 'lucide-react';

/**
 * Vista del Claustro de Profesores.
 * Adaptable: Vista pública para padres vs Vista privada para alumnos.
 */
const Claustro = () => {
    const { user } = useContext(AuthContext);
    const [professors, setProfessors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                
                // Cargar profesores y categorías
                const [profRes, catRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/teachers/professors/', config),
                    axios.get('http://localhost:8000/api/courses/categories/', config)
                ]);

                setProfessors(profRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Error cargando el claustro:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrado lógico
    const filteredProfessors = selectedCategory === 'all' 
        ? professors 
        : professors.filter(p => p.subjects.includes(parseInt(selectedCategory)));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center">
                <span className="loading loading-orbit loading-lg text-purple-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            {/* Header Adaptativo */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                {!user ? (
                    <>
                        <span className="text-teal-400 font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                           <ShieldCheck className="w-6 h-6"/> Compromiso con la Excelencia Educativa
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400">
                            Nuestro Equipo Docente
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            Padres y tutores: En Genio Academy entendemos que la educación de sus hijos es lo más importante. 
                            Presentamos una selección de nuestros expertos académicos, profesionales dedicados no solo a enseñar, 
                            sino a inspirar la próxima generación de mentes brillantes.
                        </p>
                    </>
                ) : (
                    <>
                        <span className="text-purple-400 font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                           <GraduationCap className="w-6 h-6"/> Tu Guía Estelar
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
                            Claustro Galáctico
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                            Hola explorador. Aquí tienes a los maestros que te acompañarán en tus misiones. 
                            Filtra por asignatura para encontrar al experto que necesitas.
                        </p>
                    </>
                )}
            </div>

            {/* Filtros */}
            <div className="max-w-7xl mx-auto mb-12 flex justify-center">
                <div className="join bg-black/40 p-1 border border-white/10 rounded-full backdrop-blur-md">
                    <button 
                        className={`join-item btn btn-sm rounded-full px-6 border-none ${selectedCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`join-item btn btn-sm rounded-full px-6 border-none ${selectedCategory === cat.id.toString() ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Profesores */}
            <div className="max-w-7xl mx-auto">
                {filteredProfessors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProfessors.map(prof => (
                            <ProfessorCard key={prof.id} professor={prof} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-500 text-xl italic">No hay docentes asignados a este sector actualmente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Claustro;
