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
                    <button className="btn btn-outline btn-primary btn-sm w-full gap-2 border-white/20 text-white hover:bg-white hover:text-black transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Ver Trayectoria
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessorCard;
