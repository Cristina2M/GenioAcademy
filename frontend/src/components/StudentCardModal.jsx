import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertTriangle, Battery, BatteryFull, BatteryMedium, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentCardModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <div className="absolute inset-0" onClick={onClose}></div>
                
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                >
                    {/* Header con brillo cósmico */}
                    <div className="relative h-32 bg-gradient-to-tr from-indigo-900 to-purple-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/50 blur-[50px] rounded-full"></div>
                    </div>

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

                        <h2 className="text-3xl font-black text-white mb-1">{student.username}</h2>
                        <div className="flex items-center gap-2 text-teal-400 text-sm font-bold tracking-widest uppercase mb-8">
                            <Sparkles className="w-3 h-3" /> Nivel {student.level}
                        </div>

                        {/* Estadísticas RPG */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-yellow-500/10 blur-xl rounded-full"></div>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Experiencia Acumulada</span>
                                <span className="text-yellow-400 text-3xl font-black">{student.xp} XP</span>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-pink-500/10 blur-xl rounded-full"></div>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Soporte Vital</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-pink-500 text-3xl font-black">{student.lives} / 3</span>
                                    {student.lives === 3 ? <BatteryFull className="w-6 h-6 text-pink-500" /> : 
                                     student.lives > 0 ? <BatteryMedium className="w-6 h-6 text-amber-500" /> : 
                                     <Battery className="w-6 h-6 text-red-500" />}
                                </div>
                            </div>
                        </div>

                        {/* Estado / Notas del Profesor */}
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
