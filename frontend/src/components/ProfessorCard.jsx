import React from 'react';

/**
 * Tarjeta de Profesor estilo Premium / Glassmorphism.
 * Muestra la foto, el título académico y las asignaturas vinculadas.
 */
const ProfessorCard = ({ professor }) => {
    // Si no hay avatar, usamos un placeholder galáctico
    const avatar = professor.avatar_url || '/assets/professors/default_astro.png';

    return (
        <div className="card bg-gray-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
            {/* Cabecera con Imagen */}
            <figure className="relative h-64 overflow-hidden">
                <img 
                    src={avatar} 
                    alt={professor.full_name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Degradado sobre la imagen */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                
                {/* Badge de título */}
                <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-purple-600/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest border border-white/20">
                        {professor.title}
                    </span>
                </div>
            </figure>

            {/* Cuerpo de la tarjeta */}
            <div className="card-body p-6">
                <h2 className="card-title text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {professor.full_name}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {professor.bio}
                </p>

                {/* Asignaturas (Tags) */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {professor.subjects_detail?.map(subject => (
                        <span 
                            key={subject.id} 
                            className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-1 rounded tracking-tighter uppercase font-mono"
                        >
                            {subject.name}
                        </span>
                    ))}
                </div>

                {/* Botón de Perfil (Futuro Hito VI - Fase 17) */}
                <div className="card-actions mt-6">
                    <button 
                        className="btn btn-outline btn-primary btn-sm w-full gap-2 border-white/20 text-white hover:bg-white hover:text-black transition-all"
                        onClick={() => document.getElementById(`modal_prof_${professor.id}`).showModal()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Ver Trayectoria
                    </button>
                </div>
            </div>

            {/* MODAL DE TRAYECTORIA */}
            <dialog id={`modal_prof_${professor.id}`} className="modal modal-bottom sm:modal-middle backdrop-blur-md">
                <div className="modal-box bg-[#0c0c1d] border border-white/10 shadow-2xl p-0 overflow-hidden max-w-2xl">
                    <button 
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-white z-50 hover:bg-white/10"
                        onClick={() => document.getElementById(`modal_prof_${professor.id}`).close()}
                    >✕</button>
                    
                    <div className="px-8 pt-10 pb-16 relative z-10">
                        {/* Header: Avatar + Nombre al lado */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-8 border-b border-white/5">
                            <div className="w-28 h-28 rounded-2xl border-2 border-teal-500/30 overflow-hidden shadow-2xl bg-slate-800 flex-shrink-0">
                                <img src={avatar} alt={professor.full_name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="text-center md:text-left pt-2">
                                <h3 className="font-black text-4xl text-white mb-2 tracking-tight">{professor.full_name}</h3>
                                <p className="text-teal-400 font-bold tracking-widest uppercase text-xs flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                    {professor.title}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                            {/* SECCIÓN: PERFIL Y METODOLOGÍA */}
                            <div className="space-y-8">
                                <section>
                                    <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-4 opacity-50 uppercase tracking-widest">
                                        <div className="w-8 h-[1px] bg-teal-500"></div> Perfil Profesional
                                    </h4>
                                    <p className="text-slate-300 leading-relaxed text-sm italic">
                                        "{professor.bio}"
                                    </p>
                                </section>

                                <section>
                                    <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-4 opacity-50 uppercase tracking-widest">
                                        <div className="w-8 h-[1px] bg-teal-500"></div> Metodología Pedagógica
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {professor.cv_json?.methods?.map((method, idx) => (
                                            <span key={idx} className="badge badge-outline border-teal-500/30 text-teal-400 p-3 text-xs">
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* SECCIÓN: FORMACIÓN */}
                                    <section>
                                        <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-6 opacity-50 uppercase tracking-widest">
                                            <div className="w-8 h-[1px] bg-teal-500"></div> Formación Académica
                                        </h4>
                                        <div className="space-y-4 border-l border-white/10 ml-2 pl-4">
                                            {professor.cv_json?.education?.map((edu, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.6)]"></div>
                                                    <p className="text-[10px] text-teal-500 font-bold mb-1">{edu.year}</p>
                                                    <p className="text-white text-sm font-semibold">{edu.degree}</p>
                                                    <p className="text-slate-500 text-xs">{edu.institution}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* SECCIÓN: EXPERIENCIA */}
                                    <section>
                                        <h4 className="text-white text-sm font-bold flex items-center gap-2 mb-6 opacity-50 uppercase tracking-widest">
                                            <div className="w-8 h-[1px] bg-teal-500"></div> Trayectoria Profesional
                                        </h4>
                                        <div className="space-y-4 border-l border-white/10 ml-2 pl-4">
                                            {professor.cv_json?.experience?.map((exp, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                                                    <p className="text-[10px] text-blue-400 font-bold mb-1">{exp.period}</p>
                                                    <p className="text-white text-sm font-semibold">{exp.role}</p>
                                                    <p className="text-slate-500 text-xs">{exp.company}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                    DOCENTE VERIFICADO
                                </div>
                                <div className="text-slate-500 text-[10px] font-medium italic">
                                    Expediente académico validado por Genio Academy
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-action p-4 bg-slate-950/50 flex justify-center">
                        <button className="btn btn-sm btn-ghost text-slate-400" onClick={() => document.getElementById(`modal_prof_${professor.id}`).close()}>Cerrar</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ProfessorCard;
