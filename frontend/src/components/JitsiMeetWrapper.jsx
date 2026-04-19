// ============================================================
// ARCHIVO: JitsiMeetWrapper.jsx
// FUNCIÓN: Envuelve la videollamada de Jitsi Meet en nuestra UI.
//
// Este componente incrusta la sala de videollamada de Jitsi Meet
// dentro de nuestra aplicación. Funciona así:
//
//   1. Carga dinámicamente el script externo de Jitsi si no está ya en memoria.
//   2. Crea la sala de videollamada en el contenedor HTML referenciado.
//   3. Cuando el componente se desmonta (el alumno/profe cierra la llamada),
//      limpia la instancia de Jitsi para liberar recursos y evitar fugas de memoria.
//
// Props que recibe:
//   - meetingLink: La URL completa de Jitsi (ej: "https://meet.jit.si/GenioAcademy_123_abc")
//   - isTeacher:   true si es el profesor, false si es el alumno
//   - onClose:     Función para cerrar esta pantalla y volver a la anterior
// ============================================================

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const JitsiMeetWrapper = ({ meetingLink, isTeacher, onClose }) => {
    // useRef nos da una referencia directa al elemento HTML donde Jitsi se incrustará
    // (equivalente a document.getElementById pero de la manera de React)
    const refContenedor = useRef(null);

    // Este efecto se ejecuta cuando el componente se monta o cuando cambia el enlace de la reunión
    useEffect(() => {
        // Si no tenemos enlace o el contenedor HTML no existe, no podemos hacer nada
        if (!meetingLink || !refContenedor.current) return;

        // Extraemos el nombre de la sala del enlace completo
        // Ejemplo: "https://meet.jit.si/GenioAcademy_5_a3f2" → "GenioAcademy_5_a3f2"
        const nombreSala = meetingLink.split('/').pop();
        const dominioJitsi = 'meet.jit.si'; // El servidor público de Jitsi Meet

        // Variable que guardará la instancia de la API de Jitsi para poder destruirla al salir
        let apiJitsi = null;

        // Función que realmente inicializa la sala de Jitsi en el contenedor
        function iniciarJitsi(dominio, sala) {
            const configuracion = {
                roomName: sala,                      // Nombre único de la sala
                parentNode: refContenedor.current,   // El div donde se incrustará el iframe
                width: '100%',
                height: '100%',
                configOverwrite: {
                    // Desactivamos la pantalla de "sala de espera" para entrar directo
                    prejoinPageEnabled: false,
                    startWithAudioMuted: false,   // El micro arranca activado
                    startWithVideoMuted: false    // La cámara arranca activada
                },
                interfaceConfigOverwrite: {
                    // Solo mostramos los botones esenciales en la barra de herramientas
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'settings'
                    ],
                }
            };

            // Instanciamos la API de Jitsi con nuestra configuración
            apiJitsi = new window.JitsiMeetExternalAPI(dominio, configuracion);

            // Si es el alumno (no el profe), personalizamos el título de la sala
            if (!isTeacher) {
                apiJitsi.executeCommand('subject', 'Tutoría Genio Academy');
            }
        }

        // Comprobamos si el script de Jitsi ya ha sido cargado anteriormente en esta sesión
        if (!window.JitsiMeetExternalAPI) {
            // Si NO está cargado: creamos el script de forma dinámica y lo añadimos al DOM
            const scriptJitsi = document.createElement('script');
            scriptJitsi.src = `https://${dominioJitsi}/external_api.js`; // URL del script de Jitsi
            scriptJitsi.async = true; // Lo cargamos en paralelo sin bloquear la página
            scriptJitsi.onload = () => iniciarJitsi(dominioJitsi, nombreSala); // Al terminar de cargar, iniciamos Jitsi
            document.body.appendChild(scriptJitsi);
        } else {
            // Si ya está cargado: iniciamos Jitsi directamente sin volver a descargar el script
            iniciarJitsi(dominioJitsi, nombreSala);
        }

        // Función de limpieza: se ejecuta automáticamente cuando el componente desaparece
        // (cuando el usuario cierra la llamada). Esto es importante para liberar la memoria.
        return () => {
            if (apiJitsi) {
                apiJitsi.dispose(); // Destruye la instancia y cierra las conexiones de red
            }
        };
    }, [meetingLink, isTeacher]); // Se re-ejecuta si cambia el enlace o el tipo de usuario

    return (
        // Pantalla completa que cubre toda la aplicación durante la videollamada
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">

            {/* Barra superior con indicador de grabación y botón de salida */}
            <div className="flex justify-between items-center bg-[#0a0a14] p-4 text-white">
                <div className="flex items-center gap-4">
                    {/* Punto rojo pulsante para indicar que la transmisión está en vivo */}
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <span className="font-bold tracking-widest text-sm uppercase">Transmisión en Vivo Segura</span>
                </div>

                {/* Botón para cerrar la llamada y volver a la pantalla anterior */}
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-error shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                    <X className="w-4 h-4" /> Finalizar y Eyectarse
                </button>
            </div>

            {/* Contenedor donde Jitsi incrustará el iframe de la videollamada.
                Mostramos un spinner mientras la sala de Jitsi termina de cargar. */}
            <div ref={refContenedor} className="w-full h-full flex-grow bg-slate-900 flex items-center justify-center">
                <span className="loading loading-ring loading-lg text-indigo-500"></span>
            </div>
        </div>
    );
};

export default JitsiMeetWrapper;
