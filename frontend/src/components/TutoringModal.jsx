// ============================================================
// ARCHIVO: TutoringModal.jsx
// FUNCIÓN: Ventana emergente (modal) para solicitar una tutoría.
//
// Este componente se abre cuando un alumno de Nivel 3 está dentro
// del reproductor de un curso y pulsa el botón de "Solicitar Tutoría".
//
// El flujo es:
//   1. Carga los profesores disponibles de la materia de ese curso.
//   2. El alumno selecciona el profesor que prefiere.
//   3. El alumno escribe su consulta en un campo de texto.
//   4. Al enviar, se crea una "Consulta" en el backend.
//   5. El profesor verá la consulta en su panel y podrá iniciar la videollamada.
//
// Props que recibe:
//   - courseId: ID del curso desde el que se abre (para filtrar profesores por materia)
//   - courseTitle: Nombre del curso (para mostrarlo en el encabezado)
//   - onClose: Función que cierra el modal (viene del componente padre)
// ============================================================

import React, { useState, useEffect } from 'react';
import { X, Send, Video, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

// El componente recibe tres datos del padre: el ID del curso, su título y cómo cerrarse
const TutoringModal = ({ courseId, courseTitle, onClose }) => {

    // Lista de profesores disponibles para este curso (se carga del servidor)
    const [profesores, setProfesores] = useState([]);

    // Estado de carga: true mientras esperamos que el servidor responda
    const [cargando, setCargando] = useState(true);

    // ID del profesor que el alumno ha seleccionado (null = ninguno seleccionado)
    const [idProfesorSeleccionado, setIdProfesorSeleccionado] = useState(null);

    // Texto que el alumno escribe para describir su duda
    const [mensajeDuda, setMensajeDuda] = useState('');

    // Estado de envío: true mientras se está mandando la consulta al servidor
    const [enviando, setEnviando] = useState(false);

    // Estado de éxito: true cuando la consulta se ha enviado correctamente
    const [enviado, setEnviado] = useState(false);

    // Este efecto se ejecuta al abrir el modal (cuando courseId está disponible)
    useEffect(() => {
        const cargarProfesores = async () => {
            try {
                // Pedimos al backend los profesores que den clase en la materia de este curso
                // El parámetro ?course_id filtra por la categoría (materia) del curso
                const respuesta = await axiosInstance.get(`teachers/professors/?course_id=${courseId}`);
                setProfesores(respuesta.data);
            } catch (error) {
                console.error("Error al cargar los profesores disponibles:", error);
            } finally {
                // Tanto si hubo error como si no, dejamos de mostrar el spinner
                setCargando(false);
            }
        };
        cargarProfesores();
    }, [courseId]); // Se ejecuta si cambia el ID del curso

    // Función que se ejecuta cuando el alumno pulsa "Enviar"
    const manejarEnvio = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página (comportamiento HTML por defecto)

        // Comprobación mínima: debe haber profesor seleccionado y mensaje escrito
        if (!idProfesorSeleccionado || !mensajeDuda.trim()) return;

        setEnviando(true);
        try {
            // Enviamos la consulta al backend
            await axiosInstance.post('teachers/consultations/', {
                professor: idProfesorSeleccionado,  // ID del profesor elegido
                course: courseId,                   // ID del curso desde el que se solicita
                message: mensajeDuda                // Texto de la duda del alumno
            });

            // ¡Enviado con éxito! Mostramos la pantalla de confirmación
            setEnviado(true);

            // Cerramos el modal automáticamente después de 3 segundos
            setTimeout(onClose, 3000);
        } catch (error) {
            console.error("Error al enviar la consulta:", error);
            alert("No se pudo enviar la consulta. Estación espacial interferida.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <AnimatePresence>
            {/* Fondo oscuro semi-transparente que cubre toda la pantalla */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                {/* Clic en el fondo cierra el modal */}
                <div className="absolute inset-0" onClick={onClose}></div>

                {/* Tarjeta principal del modal */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Encabezado del modal con título y botón de cerrar */}
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Video className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Solicitar Tutoría</h3>
                                {/* Mostramos el nombre del curso */}
                                <p className="text-xs text-indigo-200 uppercase tracking-widest">{courseTitle}</p>
                            </div>
                        </div>
                        {/* Botón para cerrar el modal manualmente */}
                        <button onClick={onClose} className="relative z-10 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Contenido condicional: spinner / éxito / sin profes / formulario */}
                    {cargando ? (
                        // Mientras cargamos los profesores, mostramos un spinner
                        <div className="p-12 flex justify-center">
                            <span className="loading loading-ring loading-lg text-indigo-500"></span>
                        </div>
                    ) : enviado ? (
                        // Si la consulta se envió con éxito, mostramos confirmación
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Señal Transmitida</h3>
                            <p className="text-slate-400">Tu profesor ha recibido la consulta y te abrirá una sala de transmisión en breve.</p>
                        </div>
                    ) : profesores.length === 0 ? (
                        // No hay profesores disponibles para esta materia
                        <div className="p-12 text-center">
                            <p className="text-slate-400">No hay especialistas disponibles para esta materia en este momento.</p>
                        </div>
                    ) : (
                        // Formulario de solicitud: selección de profesor + mensaje
                        <form onSubmit={manejarEnvio} className="p-6">

                            {/* Sección 1: Lista de profesores para seleccionar */}
                            <div className="mb-6">
                                <label className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-widest">
                                    Seleccionar Docente
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    {profesores.map(profesor => (
                                        // Cada profesor es una tarjeta clicable
                                        <div
                                            key={profesor.id}
                                            onClick={() => setIdProfesorSeleccionado(profesor.id)}
                                            className={`cursor-pointer border p-3 rounded-xl flex flex-col gap-1 transition-all ${
                                                idProfesorSeleccionado === profesor.id
                                                    ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                    : 'bg-black/30 border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-white font-bold text-sm block truncate pr-2">{profesor.full_name}</span>
                                            <span className="text-indigo-400 text-xs block truncate pr-2">{profesor.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sección 2: Campo de texto para describir la duda */}
                            <div className="mb-8">
                                <label className="block text-slate-300 font-bold mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Describir Problema
                                </label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px] resize-none"
                                    placeholder="Profesor, me he atascado en este concepto y no consigo avanzar..."
                                    value={mensajeDuda}
                                    onChange={(e) => setMensajeDuda(e.target.value)}
                                    maxLength={1000}
                                    required
                                ></textarea>
                                {/* Contador de caracteres */}
                                <div className="text-right mt-1 text-xs text-slate-500">{mensajeDuda.length}/1000</div>
                            </div>

                            {/* Botón de envío: desactivado si falta algún campo */}
                            <button
                                type="submit"
                                disabled={enviando || !idProfesorSeleccionado || !mensajeDuda.trim()}
                                className="btn w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold border-none shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:shadow-none"
                            >
                                {enviando ? <span className="loading loading-spinner"></span> : 'Enviar Petición Oficial'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TutoringModal;
