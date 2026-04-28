// ============================================================
// ARCHIVO: StudentCardModal.jsx
// FUNCIÓN: Modal con la "ficha" completa de un alumno, visible solo para profesores.
//
// Muestra:
//   - Avatar, nombre y nivel RPG del alumno
//   - XP total, vidas restantes y racha de días
//   - Cursos completados en las materias del profesor
//   - Número de consultas previas con este profesor
//   - Acceso rápido para iniciar videollamada directa
// ============================================================

import React, { useState } from 'react';
import {
  X, Sparkles, BatteryFull, BatteryMedium, Battery,
  Cpu, Video, Flame, CheckCircle2, MessageCircle, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axios';

const StudentCardModal = ({ student, onClose, onIniciarLlamada }) => {
    const [nombreLlamada, setNombreLlamada] = useState('');
    const [llamando, setLlamando] = useState(false);

    if (!student) return null;

    const manejarLlamadaDirecta = async () => {
        if (!nombreLlamada.trim()) return;
        setLlamando(true);
        try {
            const respuesta = await axiosInstance.post('teachers/consultations/', {
                student: student.id,
                message: `Llamada Directa: ${nombreLlamada}`
            });
            await onIniciarLlamada(respuesta.data.id);
            onClose();
        } catch (error) {
            console.error("Error al iniciar llamada directa:", error);
            alert("No se pudo iniciar la conexión galáctica.");
        } finally {
            setLlamando(false);
        }
    };

    // Cálculo de progreso XP dentro del nivel actual
    const xpBase = (student.level - 1) * 500;
    const xpSiguiente = student.level * 500;
    const xpEnNivel = Math.max(0, student.xp - xpBase);
    const xpRequerido = xpSiguiente - xpBase;
    const porcentaje = Math.min(100, Math.round((xpEnNivel / xpRequerido) * 100));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Cabecera decorativa */}
                    <div className="relative h-32 bg-gradient-to-tr from-indigo-900 to-purple-900 overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/50 blur-[50px] rounded-full" />
                    </div>

                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-md transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="px-8 pb-8 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative -mt-16 w-32 h-32 rounded-full border-4 border-[#0a0a14] bg-indigo-900 overflow-hidden mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <img src={`/assets/buho/${student.avatar}.png`} alt={student.username} className="w-full h-full object-cover" />
                        </div>

                        {/* Nombre y nivel */}
                        <h2 className="text-3xl font-black text-white mb-1">{student.username}</h2>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1.5 text-teal-400 text-sm font-bold tracking-widest uppercase">
                                <Sparkles className="w-3 h-3" /> Nivel {student.level}
                            </div>
                            {/* Racha de días */}
                            {(student.streak || 0) > 0 && (
                                <div className="flex items-center gap-1 bg-orange-500/10 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-500/20">
                                    <Flame className="w-3 h-3" /> {student.streak} días de racha
                                </div>
                            )}
                        </div>

                        {/* Barra de progreso XP */}
                        <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-white/5 mb-4">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400 uppercase tracking-wider">Progreso XP</span>
                                <span className="text-yellow-400">{student.xp} XP totales</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
                                    style={{ width: `${porcentaje}%` }}
                                />
                            </div>
                            <p className="text-right text-xs text-slate-500 mt-1">
                                {xpEnNivel} / {xpRequerido} XP para el nivel {student.level + 1}
                            </p>
                        </div>

                        {/* Grid de estadísticas */}
                        <div className="grid grid-cols-3 gap-3 w-full mb-4">
                            {/* Vidas */}
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Vidas</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-pink-500 text-xl font-black">{student.lives}/3</span>
                                    {student.lives === 3 ? <BatteryFull className="w-4 h-4 text-pink-500" /> :
                                     student.lives > 0  ? <BatteryMedium className="w-4 h-4 text-amber-500" /> :
                                     <Battery className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>

                            {/* Cursos completados */}
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Completados</span>
                                <div className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span className="text-amber-400 text-xl font-black">{(student.cursos_completados || []).length}</span>
                                </div>
                            </div>

                            {/* Consultas */}
                            <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Consultas</span>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4 text-indigo-400" />
                                    <span className="text-indigo-400 text-xl font-black">{student.num_consultas || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lista de cursos completados */}
                        {student.cursos_completados && student.cursos_completados.length > 0 && (
                            <div className="w-full mb-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Cursos Superados en tus Materias
                                </h4>
                                <ul className="space-y-1.5">
                                    {student.cursos_completados.map((titulo, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                                            {titulo}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Videollamada directa */}
                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
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

                        {/* Diagnóstico automático */}
                        <div className="w-full mt-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
                            <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-indigo-300 font-bold mb-1 text-sm">Diagnóstico Rápido</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    {student.lives < 3 && 'Ha perdido vidas recientemente — puede necesitar refuerzo. '}
                                    {(student.streak || 0) >= 5 && 'Lleva una racha consistente de más de 5 días. '}
                                    {(student.cursos_completados || []).length === 0
                                        ? 'Todavía no ha completado ningún curso tuyo — quizás necesita orientación inicial.'
                                        : `Ha completado ${student.cursos_completados.length} curso${student.cursos_completados.length > 1 ? 's' : ''} de tus materias satisfactoriamente.`
                                    }
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
