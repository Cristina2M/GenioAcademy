// ============================================================
// ARCHIVO: StudentCardModal.jsx
// FUNCIÓN: Modal con la "ficha" de un alumno, visible sólo para profesores.
//
// Se abre desde el TeacherDashboard cuando el profesor hace clic en
// "Ver Ficha" de un alumno de su lista.
//
// Muestra:
//   - Avatar del alumno (su búho)
//   - Nombre de usuario y nivel RPG actual
//   - XP total acumulado y vidas (planetas) restantes
//   - Un diagnóstico rápido automático basado en sus estadísticas
//
// Props que recibe:
//   - student: Objeto con los datos del alumno (id, username, level, xp, lives, avatar)
//   - onClose: Función para cerrar el modal
// ============================================================

import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertTriangle, Battery, BatteryFull, BatteryMedium, Cpu, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axios';

const StudentCardModal = ({ student, onClose, onIniciarLlamada }) => {
    // Estados para la videollamada directa
    const [nombreLlamada, setNombreLlamada] = useState('');
    const [llamando, setLlamando] = useState(false);

    // Si no hay alumno seleccionado, no renderizamos nada (el modal permanece invisible)
    if (!student) return null;

    // Función para que el profesor inicie una videollamada sin ticket previo
    const manejarLlamadaDirecta = async () => {
        if (!nombreLlamada.trim()) return;
        setLlamando(true);
        try {
            // Creamos una consulta "fantasma" que represente esta llamada directa
            const respuesta = await axiosInstance.post('teachers/consultations/', {
                student: student.id,
                message: `Llamada Directa: ${nombreLlamada}`
            });
            // Iniciamos la videollamada usando el ID de la consulta recién creada
            await onIniciarLlamada(respuesta.data.id);
            onClose(); // Cerramos la ficha del alumno para ver la pantalla de Jitsi
        } catch (error) {
            console.error("Error al iniciar llamada directa:", error);
            alert("No se pudo iniciar la conexión galáctica.");
        } finally {
            setLlamando(false);
        }
    };

    return (
        <AnimatePresence>
            {/* Fondo oscuro semi-transparente que cubre toda la pantalla */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                {/* Clic en el fondo oscuro cierra el modal */}
                <div className="absolute inset-0" onClick={onClose}></div>

                {/* Tarjeta principal del modal */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                >
                    {/* Cabecera galáctica decorativa */}
                    <div className="relative h-32 bg-gradient-to-tr from-indigo-900 to-purple-900 overflow-hidden">
                        {/* Textura de estrellas (cargada desde URL externa decorativa) */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                        {/* Halo de luz púrpura detrás del avatar */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/50 blur-[50px] rounded-full"></div>
                    </div>

                    {/* Botón X para cerrar manualmente */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-md transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="px-8 pb-8 flex flex-col items-center">
                        {/* Avatar del alumno (sobresale de la cabecera hacia abajo con -mt-16) */}
                        <div className="relative -mt-16 w-32 h-32 rounded-full border-4 border-[#0a0a14] bg-indigo-900 overflow-hidden mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <img src={`/assets/buho/${student.avatar}.png`} alt={student.username} className="w-full h-full object-cover" />
                        </div>

                        {/* Nombre y nivel del alumno */}
                        <h2 className="text-3xl font-black text-white mb-1">{student.username}</h2>
                        <div className="flex items-center gap-2 text-teal-400 text-sm font-bold tracking-widest uppercase mb-8">
                            <Sparkles className="w-3 h-3" /> Nivel {student.level}
                        </div>

                        {/* Grid de estadísticas RPG: XP y Vidas */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {/* Tarjeta de XP */}
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/10 blur-xl rounded-full"></div>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Experiencia Acumulada</span>
                                <span className="text-yellow-400 text-3xl font-black">{student.xp} XP</span>
                            </div>

                            {/* Tarjeta de Vidas (Planetas) */}
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-pink-500/10 blur-xl rounded-full"></div>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Soporte Vital</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-pink-500 text-3xl font-black">{student.lives} / 3</span>
                                    {/* Icono de batería que cambia según las vidas restantes */}
                                    {student.lives === 3 ? <BatteryFull className="w-6 h-6 text-pink-500" /> :
                                     student.lives > 0 ? <BatteryMedium className="w-6 h-6 text-amber-500" /> :
                                     <Battery className="w-6 h-6 text-red-500" />}
                                </div>
                            </div>
                        </div>

                        {/* Sección de Videollamada Directa */}
                        <div className="w-full mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Video className="w-4 h-4 text-red-500" /> Iniciar Transmisión Directa
                            </h4>
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="text"
                                    placeholder="Nombre de la sesión (ej: Repaso de dudas)"
                                    className="input input-sm bg-black/40 border-white/10 text-white rounded-lg focus:border-indigo-500"
                                    value={nombreLlamada}
                                    onChange={(e) => setNombreLlamada(e.target.value)}
                                />
                                <button 
                                    onClick={manejarLlamadaDirecta}
                                    disabled={llamando || !nombreLlamada.trim()}
                                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none w-full shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                >
                                    {llamando ? 'Conectando...' : 'Llamar al Alumno'}
                                </button>
                            </div>
                        </div>

                        {/* Diagnóstico automático: texto dinámico según el estado del alumno */}
                        <div className="w-full mt-6 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
                            <Cpu className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-indigo-300 font-bold mb-1">Diagnóstico Rápido</h4>
                                <p className="text-slate-400 text-sm">
                                    Este es un estudiante en formación. {student.lives < 3 ? 'Recientemente ha fallado misiones y ha perdido recursos vitales.' : 'Tiene un rendimiento impecable sin errores críticos recientes.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StudentCardModal;
