import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Sparkles, Award } from 'lucide-react';
import '../styles/professors.css';

/**
 * Tarjeta de Profesor estilo Premium / Glassmorphism.
 * Muestra la foto, el título académico y las asignaturas vinculadas.
 */
const ProfessorCard = ({ professor }) => {
    // Si no hay avatar, usamos un placeholder galáctico
    const avatar = professor.avatar_url || '/assets/professors/default_astro.png';

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="professor-card-glow card bg-gray-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-purple-500/50 transition-all duration-300 group overflow-hidden h-full flex flex-col"
            >
                {/* Cabecera con Imagen */}
                <figure className="relative h-64 overflow-hidden">
                    <motion.img 
                        src={avatar} 
                        alt={professor.full_name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Degradado sobre la imagen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                    
                </figure>

                {/* Cuerpo de la tarjeta */}
                <div className="card-body p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <h2 className="card-title text-2xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors tracking-tighter">
                            {professor.full_name}
                        </h2>
                        <div className="flex items-center gap-2">
                             <Sparkles className="w-3 h-3 text-teal-400" />
                             <p className="text-teal-400/90 text-[10px] font-black uppercase tracking-[0.2em] leading-tight">
                                {professor.title}
                            </p>
                        </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                        {professor.bio}
                    </p>

                    {/* Asignaturas (Tags) */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {professor.subjects_detail?.map(subject => (
                            <span 
                                key={subject.id} 
                                className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full tracking-tighter uppercase font-black"
                            >
                                # {subject.name}
                            </span>
                        ))}
                    </div>

                    {/* Botón de Perfil */}
                    <div className="card-actions mt-6">
                        <button 
                            className="btn btn-outline btn-sm w-full gap-2 border-white/10 text-white hover:bg-white hover:text-black hover:border-white transition-all rounded-xl font-bold uppercase tracking-widest text-[10px]"
                            onClick={() => document.getElementById(`modal_prof_${professor.id}`).showModal()}
                        >
                            <BookOpen className="w-4 h-4" />
                            Explorar Trayectoria
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* MODAL DE TRAYECTORIA */}
            <dialog id={`modal_prof_${professor.id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-md">
                <div className="modal-box glass-deep border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 overflow-hidden max-w-3xl max-h-[90vh] flex flex-col rounded-[2.5rem]">
                    {/* BOTÓN X FIJO */}
                    <button 
                        className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6 text-white z-50 bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/5"
                        onClick={() => document.getElementById(`modal_prof_${professor.id}`).close()}
                    >✕</button>
                    
                    {/* CONTENEDOR SCROLLABLE */}
                    <div className="overflow-y-auto px-10 pt-12 pb-20 custom-scroll flex-1">
                        {/* Header: Avatar + Nombre al lado */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pb-10 border-b border-white/5">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-teal-500/20 blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                                <div className="relative w-36 h-36 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl flex-shrink-0">
                                    <img src={avatar} alt={professor.full_name} className="w-full h-full object-cover" />
                                </div>
                            </motion.div>
                            
                            <div className="text-center md:text-left pt-2">
                                <h3 className="font-black text-5xl text-white mb-2 tracking-tighter leading-none">{professor.full_name}</h3>
                                <div className="flex flex-col md:flex-row gap-4 mt-4">
                                    <p className="text-teal-400 font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-center md:justify-start gap-2 bg-teal-400/5 px-4 py-2 rounded-full border border-teal-400/20">
                                        <Award className="w-4 h-4"/>
                                        {professor.title}
                                    </p>
                                    <p className="text-slate-400 font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-center md:justify-start gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <MapPin className="w-4 h-4"/>
                                        Sector Académico Verificado
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-12">
                            {/* SECCIÓN: PERFIL */}
                            <motion.section 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 mb-6 uppercase tracking-[0.3em]">
                                    <div className="w-10 h-[1px] bg-teal-500"></div> Perfil Profesional
                                </h4>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full"></div>
                                    <p className="text-slate-200 leading-relaxed text-lg font-medium relative z-10 italic">
                                        "{professor.bio}"
                                    </p>
                                </div>
                            </motion.section>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* SECCIÓN: FORMACIÓN */}
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 mb-8 uppercase tracking-[0.3em]">
                                        <div className="w-10 h-[1px] bg-purple-500"></div> ADN Académico
                                    </h4>
                                    <div className="space-y-6 border-l-2 border-white/5 ml-3 pl-8">
                                        {professor.cv_json?.education?.map((edu, idx) => (
                                            <div key={idx} className="relative group/edu">
                                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0c0c1d] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform group-hover/edu:scale-125"></div>
                                                <p className="text-[10px] text-purple-400 font-black mb-1 opacity-70 tracking-widest">{edu.year}</p>
                                                <p className="text-white text-base font-bold tracking-tight">{edu.degree}</p>
                                                <p className="text-slate-500 text-sm font-medium">{edu.institution}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* SECCIÓN: EXPERIENCIA */}
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 mb-8 uppercase tracking-[0.3em]">
                                        <div className="w-10 h-[1px] bg-blue-500"></div> Historial de Misiones
                                    </h4>
                                    <div className="space-y-6 border-l-2 border-white/5 ml-3 pl-8">
                                        {professor.cv_json?.experience?.map((exp, idx) => (
                                            <div key={idx} className="relative group/exp">
                                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0c0c1d] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-transform group-hover/exp:scale-125"></div>
                                                <p className="text-[10px] text-blue-400 font-black mb-1 opacity-70 tracking-widest">{exp.period}</p>
                                                <p className="text-white text-base font-bold tracking-tight">{exp.role}</p>
                                                <p className="text-slate-500 text-sm font-medium">{exp.company}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            </div>

                            {/* SECCIÓN: METODOLOGÍA */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 mb-6 uppercase tracking-[0.3em]">
                                    <div className="w-10 h-[1px] bg-green-500"></div> Protocolos de Enseñanza
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {professor.cv_json?.methods?.map((method, idx) => (
                                        <span key={idx} className="px-5 py-2 rounded-2xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 text-green-400 text-[11px] font-black tracking-wider uppercase shadow-inner">
                                            {method}
                                        </span>
                                    ))}
                                </div>
                            </motion.section>
                        </div>

                        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500/10 text-green-400 px-5 py-2 rounded-full text-[10px] font-black border border-green-500/20 flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                                    IDENTIDAD ACADÉMICA VERIFICADA
                                </div>
                            </div>
                            <div className="text-slate-500 text-[10px] font-black tracking-widest uppercase opacity-40">
                                Siglo XXI - Era Estelar
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-black/80 backdrop-blur-md">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default ProfessorCard;
