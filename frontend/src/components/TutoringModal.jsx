import React, { useState, useEffect } from 'react';
import { X, Send, Video, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const TutoringModal = ({ courseId, courseTitle, onClose }) => {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfId, setSelectedProfId] = useState(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                // Obtenemos los profesores especialistas en la materia de este curso
                const res = await axiosInstance.get(`teachers/professors/?course_id=${courseId}`);
                setProfessors(res.data);
            } catch (error) {
                console.error("Error trayendo profesores:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessors();
    }, [courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProfId || !message.trim()) return;

        setSending(true);
        try {
            await axiosInstance.post('teachers/consultations/', {
                professor: selectedProfId,
                course: courseId,
                message: message
            });
            setSuccess(true);
            setTimeout(onClose, 3000);
        } catch (error) {
            console.error("Error enviando ticket", error);
            alert("No se pudo enviar la consulta. Estación espacial interferida.");
        } finally {
            setSending(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                <div className="absolute inset-0" onClick={onClose}></div>
                
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Video className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Solicitar Tutoría</h3>
                                <p className="text-xs text-indigo-200 uppercase tracking-widest">{courseTitle}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="relative z-10 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <span className="loading loading-ring loading-lg text-indigo-500"></span>
                        </div>
                    ) : success ? (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Señal Transmitida</h3>
                            <p className="text-slate-400">Tu profesor ha recibido la consulta y te abrirá una sala de transmisión en breve.</p>
                        </div>
                    ) : professors.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-400">No hay especialistas disponibles para esta materia en este momento.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <label className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-widest">
                                    Seleccionar Docente
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    {professors.map(p => (
                                        <div 
                                            key={p.id}
                                            onClick={() => setSelectedProfId(p.id)}
                                            className={`cursor-pointer border p-3 rounded-xl flex flex-col gap-1 transition-all ${
                                                selectedProfId === p.id 
                                                    ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                                                    : 'bg-black/30 border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-white font-bold text-sm block truncate pr-2">{p.full_name}</span>
                                            <span className="text-indigo-400 text-xs block truncate pr-2">{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Describir Problema
                                </label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px] resize-none"
                                    placeholder="Profesor, me he atascado en este concepto y no consigo avanzar..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={1000}
                                    required
                                ></textarea>
                                <div className="text-right mt-1 text-xs text-slate-500">{message.length}/1000</div>
                            </div>

                            <button 
                                type="submit"
                                disabled={sending || !selectedProfId || !message.trim()}
                                className="btn w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold border-none shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:shadow-none"
                            >
                                {sending ? <span className="loading loading-spinner"></span> : 'Enviar Petición Oficial'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TutoringModal;
