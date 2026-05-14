import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, GraduationCap, Briefcase, Cpu } from 'lucide-react';
import LanguageContext from '../context/LanguageContext';
import '../styles/professors.css';

/**
 * Vista Pública del Claustro (Formato Zig-Zag Narrativo para Padres)
 */
const HARDCODED_PROFESSORS = [
    {
        id: 1,
        full_name: "Dr. Aris Thorne",
        title: { es: "Comandante de Misiones Matemáticas", en: "Commander of Math Missions" },
        avatar_url: "/assets/professors/prof_math.png",
        bio: { 
            es: "Especialista en lógica pura y patrones estelares. Aris utiliza el lenguaje de los números para trazar las rutas más seguras a través del hiperespacio educativo.",
            en: "Specialist in pure logic and stellar patterns. Aris uses the language of numbers to chart the safest routes through educational hyperspace."
        },
        cv_json: {
            education: [
                { degree: {es: "Ph.D. en Matemáticas Aplicadas", en: "Ph.D. in Applied Mathematics"}, institution: "Oxford" },
                { degree: {es: "Máster en Teoría de Números", en: "Master in Number Theory"}, institution: "Princeton" },
                { degree: {es: "Grado en Astrofísica", en: "B.S. in Astrophysics"}, institution: "MIT" }
            ],
            experience: [
                { role: {es: "Catedrático de Cálculo", en: "Professor of Calculus"}, company: "Universidad de Cambridge" },
                { role: {es: "Investigador de Lógica", en: "Logic Researcher"}, company: "CERN" },
                { role: {es: "Director de Navegación", en: "Director of Navigation"}, company: "ESA" }
            ],
            methods: {es: ["Lógica Borrosa", "Cálculo Galáctico", "Modelado 3D"], en: ["Fuzzy Logic", "Galactic Calculus", "3D Modeling"]}
        }
    },
    {
        id: 2,
        full_name: "Dr. Felix Quantum",
        title: { es: "Arquitecto de Física y Química", en: "Architect of Physics & Chemistry" },
        avatar_url: "/assets/professors/prof_chem.png",
        bio: { 
            es: "Explorador de la materia y la energía. Felix transforma las leyes fundamentales del universo en experimentos asombrosos que desafían la gravedad de lo cotidiano.",
            en: "Explorer of matter and energy. Felix transforms the fundamental laws of the universe into amazing experiments that defy everyday gravity."
        },
        cv_json: {
            education: [
                { degree: {es: "Ph.D. en Física de Partículas", en: "Ph.D. in Particle Physics"}, institution: "CERN Academy" },
                { degree: {es: "Máster en Ingeniería Termonuclear", en: "Master in Thermonuclear Engineering"}, institution: "Caltech" },
                { degree: {es: "Grado en Nanotecnología", en: "B.S. in Nanotechnology"}, institution: "ETH Zurich" }
            ],
            experience: [
                { role: {es: "Consultor de Propulsión", en: "Propulsion Consultant"}, company: "SpaceX" },
                { role: {es: "Jefe de Laboratorio", en: "Head of Laboratory"}, company: "FermiLab" },
                { role: {es: "Divulgador Científico", en: "Science Communicator"}, company: "National Geographic" }
            ],
            methods: {es: ["Simuladores Cuánticos", "Gamificación", "Laboratorios VR"], en: ["Quantum Simulators", "Gamification", "VR Labs"]}
        }
    },
    {
        id: 3,
        full_name: "Dra. Elara Vantaris",
        title: {es: "Exploradora de Biología y Geología", en: "Explorer of Biology & Geology"},
        avatar_url: "/assets/professors/prof_bio.png",
        bio: {
            es: "Bióloga marina y experta en exobiología. Elara ha dedicado su carrera a entender cómo la vida florece en los rincones más extremos y fascinantes de la galaxia.",
            en: "Marine biologist and expert in exobiology. Elara has dedicated her career to understanding how life flourishes in the most extreme and fascinating corners of the galaxy."
        },
        cv_json: {
            education: [
                { degree: {es: "Doctorado en Exobiología", en: "Ph.D. in Exobiology"}, institution: "NASA Fellowship" },
                { degree: {es: "Máster en Ecología Marina", en: "Master in Marine Ecology"}, institution: "U. de Barcelona" },
                { degree: {es: "Grado en Ciencias de la Vida", en: "B.S. in Life Sciences"}, institution: "Sorbonne" }
            ],
            experience: [
                { role: {es: "Líder de Misión Antártica", en: "Antarctic Mission Leader"}, company: "British Antarctic Survey" },
                { role: {es: "Analista de Sustentabilidad", en: "Sustainability Analyst"}, company: "ONU" },
                { role: {es: "Profesora de Genética", en: "Professor of Genetics"}, company: "Harvard Medical School" }
            ],
            methods: {es: ["Análisis de ADN", "Bio-Mímica", "Ecosistemas Cerrados"], en: ["DNA Analysis", "Bio-Mimicry", "Closed Ecosystems"]}
        }
    },
    {
        id: 4,
        full_name: "Dra. Sarah Moon",
        title: {es: "Embajadora de Lengua y Literatura", en: "Ambassador of Language & Literature"},
        avatar_url: "/assets/professors/prof_lang.png",
        bio: {
            es: "Lingüista experta en comunicación inter-cultural. Sarah transforma el arte de las palabras en el viaje más emocionante que un estudiante puede emprender.",
            en: "Expert linguist in inter-cultural communication. Sarah transforms the art of words into the most exciting journey a student can undertake."
        },
        cv_json: {
            education: [
                { degree: {es: "Ph.D. en Literatura Comparada", en: "Ph.D. in Comparative Literature"}, institution: "Salamanca" },
                { degree: {es: "Máster en Lingüística Aplicada", en: "Master in Applied Linguistics"}, institution: "Columbia" },
                { degree: {es: "Grado en Filología Hispánica", en: "B.A. in Hispanic Philology"}, institution: "UAM" }
            ],
            experience: [
                { role: {es: "Editora Senior", en: "Senior Editor"}, company: "Penguin Random House" },
                { role: {es: "Catedrática de Poesía", en: "Professor of Poetry"}, company: "King's College London" },
                { role: {es: "Guionista Creativa", en: "Creative Writer"}, company: "Pixar Animation Studios" }
            ],
            methods: {es: ["Escritura Creativa", "Retórica Moderna", "Debates Dialécticos"], en: ["Creative Writing", "Modern Rhetoric", "Dialectical Debates"]}
        }
    },
    {
        id: 5,
        full_name: "Dra. Kiara Stone",
        title: {es: "Cronista de Geografía e Historia", en: "Chronicler of Geography & History"},
        avatar_url: "/assets/professors/prof_geo.png",
        bio: {
            es: "Historiadora y cartógrafa moderna. Kiara cree que entender nuestras raíces es la única brújula real para navegar el futuro de nuestra civilización.",
            en: "Modern historian and cartographer. Kiara believes that understanding our roots is the only real compass to navigate the future of our civilization."
        },
        cv_json: {
            education: [
                { degree: {es: "Cum Laude en Historia Universal", en: "Cum Laude in World History"}, institution: "U. de Bolonia" },
                { degree: {es: "Especialista en Cartografía Digital", en: "Specialist in Digital Cartography"}, institution: "Google Earth Labs" },
                { degree: {es: "Máster en Arqueología Espacial", en: "Master in Space Archaeology"}, institution: "Yale" }
            ],
            experience: [
                { role: {es: "Curadora de Museos", en: "Museum Curator"}, company: "The Smithsonian" },
                { role: {es: "Exploradora de Campo", en: "Field Explorer"}, company: "National Geographic" },
                { role: {es: "Asesora Histórica", en: "Historical Advisor"}, company: "UNESCO" }
            ],
            methods: {es: ["Mapas Holográficos", "Storytelling", "Análisis Forense"], en: ["Holographic Maps", "Storytelling", "Forensic Analysis"]}
        }
    },
    {
        id: 6,
        full_name: "Dr. Theo Canvas",
        title: {es: "Maestro de Expresión Artística", en: "Master of Artistic Expression"},
        avatar_url: "/assets/professors/prof_art.png",
        bio: {
            es: "Visionario del arte digital y tradicional. Theo enseña a plasmar ideas en lienzos infinitos utilizando tanto pinceles clásicos como algoritmos de vanguardia.",
            en: "Visionary of digital and traditional art. Theo teaches to capture ideas on infinite canvases using both classic brushes and cutting-edge algorithms."
        },
        cv_json: {
            education: [
                { degree: {es: "Doctorado en Bellas Artes", en: "Ph.D. in Fine Arts"}, institution: "Royal College of Art" },
                { degree: {es: "Máster en Diseño Digital", en: "Master in Digital Design"}, institution: "Parsons School of Design" },
                { degree: {es: "Grado en Historia del Arte", en: "B.A. in Art History"}, institution: "Louvre School" }
            ],
            experience: [
                { role: {es: "Concept Artist Principal", en: "Lead Concept Artist"}, company: "Industrial Light & Magic" },
                { role: {es: "Director de Arte", en: "Art Director"}, company: "Ubisoft" },
                { role: {es: "Artista de Galería", en: "Gallery Artist"}, company: "MoMA New York" }
            ],
            methods: {es: ["Pintura Digital", "Escultura 3D", "Luz y Color"], en: ["Digital Painting", "3D Sculpting", "Light and Color"]}
        }
    }
];

const Claustro = () => {
    const { language } = useContext(LanguageContext);
    const professors = HARDCODED_PROFESSORS;

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
                        <ShieldCheck className="w-4 h-4"/> {language === 'es' ? 'La Élite Académica a su Alcance' : 'Academic Elite at Your Fingertips'}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        {language === 'es' ? 'Mentes que ' : 'Minds that '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">{language === 'es' ? 'Modelan el Futuro' : 'Shape the Future'}</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed border-l-4 border-teal-500/30 pl-8 text-left md:text-center md:border-l-0 md:pl-0">
                        {language === 'es' 
                          ? 'En Genio Academy, no solo contratamos profesores; seleccionamos mentores con trayectorias estelares verificadas para garantizar que la educación de sus hijos sea simplemente excepcional.'
                          : 'At Genio Academy, we don\'t just hire teachers; we select mentors with verified stellar trajectories to ensure your children\'s education is simply exceptional.'}
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
                                        <p className="text-teal-400 font-black tracking-widest uppercase text-xs">{p.title[language]}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LADO TEXTO / TRAYECTORIA */}
                            <div className="w-full lg:w-1/2 flex flex-col items-start">
                                <div className="hidden lg:block mb-8">
                                    <h3 className="text-6xl font-black text-white tracking-tighter mb-4">{p.full_name}</h3>
                                    <p className="text-teal-400 font-black tracking-[0.2em] uppercase text-xs bg-teal-400/5 px-4 py-2 rounded-full border border-teal-400/20 inline-block">
                                        {p.title[language]}
                                    </p>
                                </div>

                                <div className="space-y-10 w-full">
                                    {/* Resumen Académico */}
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <p className="text-slate-300 text-lg italic leading-relaxed font-medium">"{p.bio[language]}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* Educación (Top 3) */}
                                        <div className="space-y-4">
                                            <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em]">
                                                <GraduationCap className="w-4 h-4 text-purple-500"/> {language === 'es' ? 'ADN Académico' : 'Academic DNA'}
                                            </h4>
                                            <ul className="space-y-3">
                                                {p.cv_json?.education?.slice(0, 3).map((edu, idx) => (
                                                    <li key={idx} className="border-l-2 border-purple-500/20 pl-4 py-1">
                                                        <p className="text-white text-sm font-bold leading-tight">{edu.degree[language]}</p>
                                                        <p className="text-slate-500 text-xs mt-1">{edu.institution}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Experiencia (Top 3) */}
                                        <div className="space-y-4">
                                            <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em]">
                                                <Briefcase className="w-4 h-4 text-blue-500"/> {language === 'es' ? 'Misiones Clave' : 'Key Missions'}
                                            </h4>
                                            <ul className="space-y-3">
                                                {p.cv_json?.experience?.slice(0, 3).map((exp, idx) => (
                                                    <li key={idx} className="border-l-2 border-blue-500/20 pl-4 py-1">
                                                        <p className="text-white text-sm font-bold leading-tight">{exp.role[language]}</p>
                                                        <p className="text-slate-500 text-xs mt-1">{exp.company}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Metodología */}
                                    <div className="pt-6">
                                        <h4 className="text-white/30 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.3em] mb-4">
                                            <Cpu className="w-4 h-4 text-green-500"/> {language === 'es' ? 'Tecnologías de Crecimiento' : 'Growth Technologies'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {p.cv_json?.methods[language]?.slice(0, 4).map((m, idx) => (
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
