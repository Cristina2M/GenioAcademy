// ============================================================
// ARCHIVO: ActiveCallBanner.jsx
// FUNCIÓN: Banner de notificación de llamada activa para el alumno.
//
// Este componente se muestra en la parte superior de TODAS las páginas
// (está en App.jsx) y realiza "polling" (comprobaciones periódicas) al
// servidor cada 30 segundos para verificar si el profesor ha iniciado
// una videollamada de Jitsi para el alumno.
//
// Si detecta una llamada activa, muestra un banner animado con un botón
// para unirse a la sesión. Si el alumno pulsa "Conectarse Ahora", abre
// la videollamada de Jitsi directamente en la pantalla.
// ============================================================

import React, { useEffect, useState, useContext } from 'react';
import { Video } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import JitsiMeetWrapper from './JitsiMeetWrapper';

const ActiveCallBanner = () => {
    // Obtenemos los datos del usuario conectado desde el contexto global
    const { user } = useContext(AuthContext);

    // Estado: guarda los datos de la llamada activa si existe (null = no hay llamada)
    const [llamadaActiva, setLlamadaActiva] = useState(null);

    // Estado: controla si el alumno ya se ha unido a la llamada (para mostrar Jitsi)
    const [seHaUnido, setSeHaUnido] = useState(false);

    // Este efecto se ejecuta cuando cambia el usuario (al loguearse o desloguearse)
    useEffect(() => {
        // Si no hay usuario logueado, o si es un profesor, no hay que vigilar nada
        if (!user || user.is_teacher) return;

        // Función que hace la comprobación real al servidor
        const comprobarLlamada = async () => {
            try {
                // Preguntamos al backend si hay alguna llamada activa para este alumno
                const respuesta = await axiosInstance.get('teachers/consultations/active_calls/');

                if (respuesta.data && respuesta.data.id) {
                    // Hay una llamada activa: guardamos sus datos para mostrar el banner
                    setLlamadaActiva(respuesta.data);
                } else {
                    // No hay llamada activa: limpiamos el estado del banner
                    setLlamadaActiva(null);
                    setSeHaUnido(false); // Si la llamada terminó, reseteamos el estado de unión
                }
            } catch (error) {
                console.error("Error al comprobar llamadas activas:", error);
            }
        };

        // Hacemos la primera comprobación inmediatamente al cargar
        comprobarLlamada();

        // Configuramos el "polling": repetimos la comprobación cada 30 segundos
        // Esto permite que el banner aparezca aunque el alumno esté en otra página
        const intervalo = setInterval(comprobarLlamada, 30000);

        // Limpieza: cuando el componente deja de renderizarse, cancelamos el intervalo
        // para no dejar "timers fantasma" corriendo en memoria
        return () => clearInterval(intervalo);
    }, [user]); // Se re-ejecuta si el objeto 'user' cambia (login/logout)

    // Si no hay llamada activa, no renderizamos nada (el componente es invisible)
    if (!llamadaActiva) return null;

    // Si el alumno ya pulsó "Conectarse", mostramos directamente la videollamada de Jitsi
    if (seHaUnido) {
        return (
            <JitsiMeetWrapper
                meetingLink={llamadaActiva.meeting_link}
                isTeacher={false}  // El alumno solo puede entrar, no tiene controles de moderador
                onClose={() => setSeHaUnido(false)}  // Al cerrar, volvemos al banner
            />
        );
    }

    // Renderizamos el banner animado de notificación
    return (
        <AnimatePresence>
            {/* motion.div aplica la animación de aparición/desaparición del banner */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}  // Empieza oculto y arriba
                animate={{ y: 0, opacity: 1 }}    // Se desliza hacia su posición final
                exit={{ y: -50, opacity: 0 }}     // Al desaparecer, sube y se desvanece
                className="fixed top-[80px] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-400 p-4 rounded-2xl shadow-[0_10px_40px_rgba(99,102,241,0.5)] flex flex-col md:flex-row items-center gap-4 justify-between"
            >
                {/* Texto informativo del banner */}
                <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                        {/* Icono de vídeo con animación de pulso para llamar la atención */}
                        <Video className="w-5 h-5 text-red-500 animate-pulse" />
                        ¡Llamada de Tutoría Activa!
                    </h4>
                    <p className="text-indigo-200 text-sm">
                        El profesor <span className="font-bold text-teal-400">{llamadaActiva.professor_name}</span> inició la transmisión que solicitaste.
                    </p>
                </div>

                {/* Botón para unirse a la videollamada */}
                <button
                    onClick={() => setSeHaUnido(true)}
                    className="btn bg-white text-indigo-900 hover:bg-indigo-100 border-0 shadow-xl"
                >
                    Conectarse Ahora
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default ActiveCallBanner;
