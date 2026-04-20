import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios';
import { Sparkles, ShieldCheck, GraduationCap, Award, Briefcase, Cpu } from 'lucide-react';
import '../styles/professors.css';

/**
 * Vista Pública del Claustro (Formato Zig-Zag Narrativo para Padres)
 */
const Claustro = () => {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await axiosInstance.get('teachers/professors/');
                setProfessors(response.data);
            } catch (error) {
                console.error('Error al cargar el claustro público:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessors();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center">
                <span className="loading loading-orbit loading-lg text-teal-400"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-32 px-4 md:px-8 relative overflow-hidden">
            {/* Elementos decorativos (Nebulosas sincronizadas) */}
            <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_8s_infinite] z-0"></div>
            <div className="fixed top-[30%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Narrativo */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-black uppercase tracking-[0.4em] mb-8">
                        <ShieldCheck className="w-4 h-4"/> La Élite Académica a su Alcance
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        Mentes que <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">Modelan el Futuro</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed border-l-4 border-teal-500/30 pl-8 text-left md:text-center md:border-l-0 md:pl-0">
                        En Genio Academy, no solo contratamos profesores; seleccionamos mentores con trayectorias estelares verificadas para garantizar que la educación de sus hijos sea simplemente excepcional.
                    </p>
                </motion.div>

                {/* Lista en Zig-Zag */}
                <div className="flex flex-col gap-40">
                    {professors.map((p, index) => (
                        <motion.section 
                            key={p.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
                        >
                            {/* LADO IMAGEN */}
                            <div className="w-full lg:w-1/2 relative group">
                                <div className={`absolute -inset-4 bg-gradient-to-tr ${index % 2 === 0 ? 'from-teal-500/20 to-transparent' : 'from-purple-500/20 to-transparent'} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
                                    <img 
                                        src={p.avatar_url || '/assets/professors/default_astro.png'} 
                                        alt={p.full_name} 
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90 lg:opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    
                                    {/* Badge flotante en imagen (solo en desktop) */}
                                    <div className="absolute bottom-8 left-8 right-8 lg:hidden">
                                        <h3 className="text-3xl font-black text-white mb-2">{p.full_name}</h3>
                                        <p className="text-teal-400 font-black tracking-widest uppercase text-xs">{p.title}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LADO TEXTO / TRAYECTORIA */}
                            <div className="w-full lg:w-1/2 flex flex-col items-start">
                                <div className="hidden lg:block mb-8">
                                    <h3 className="text-6xl font-black text-white tracking-tighter mb-4">{p.full_name}</h3>
                                    <p className="text-teal-400 font-black tracking-[0.2em] uppercase text-xs bg-teal-400/5 px-4 py-2 rounded-full border border-teal-400/20 inline-block">
                                        {p.title}
                                    </p>
                                </div>

                                <div className="space-y-10 w-full">
                                    {/* Resumen Académico */}
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <p className="text-slate-300 text-lg italic leading-relaxed font-medium">"{p.bio}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* Educación (Top 3) */}
                                        <div className="space-y-4">
                                            <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em]">
                                                <GraduationCap className="w-4 h-4 text-purple-500"/> ADN Académico
                                            </h4>
                                            <ul className="space-y-3">
                                                {p.cv_json?.education?.slice(0, 3).map((edu, idx) => (
                                                    <li key={idx} className="border-l-2 border-purple-500/20 pl-4 py-1">
                                                        <p className="text-white text-sm font-bold leading-tight">{edu.degree}</p>
                                                        <p className="text-slate-500 text-xs mt-1">{edu.institution}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Experiencia (Top 3) */}
                                        <div className="space-y-4">
                                            <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em]">
                                                <Briefcase className="w-4 h-4 text-blue-500"/> Misiones Clave
                                            </h4>
                                            <ul className="space-y-3">
                                                {p.cv_json?.experience?.slice(0, 3).map((exp, idx) => (
                                                    <li key={idx} className="border-l-2 border-blue-500/20 pl-4 py-1">
                                                        <p className="text-white text-sm font-bold leading-tight">{exp.role}</p>
                                                        <p className="text-slate-500 text-xs mt-1">{exp.company}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Metodología */}
                                    <div className="pt-6">
                                        <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em] mb-4">
                                            <Cpu className="w-4 h-4 text-green-500"/> Tecnologías de Crecimiento
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {p.cv_json?.methods?.slice(0, 4).map((m, idx) => (
                                                <span key={idx} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Footer del Claustro */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 text-center border-t border-white/5 pt-20"
                >
                    <div className="flex justify-center gap-4">
                         <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                         <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                         <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Claustro;
