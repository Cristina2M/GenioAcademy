import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const JitsiMeetWrapper = ({ meetingLink, isTeacher, onClose }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!meetingLink || !containerRef.current) return;

        // Extraer el roomName de https://meet.jit.si/NombreDeSala
        const roomName = meetingLink.split('/').pop();
        const domain = 'meet.jit.si';

        // Cargar script dinámicamente si no está en el index.html
        if (!window.JitsiMeetExternalAPI) {
            const script = document.createElement('script');
            script.src = `https://${domain}/external_api.js`;
            script.async = true;
            script.onload = () => initJitsi(domain, roomName);
            document.body.appendChild(script);
        } else {
            initJitsi(domain, roomName);
        }

        let api = null;

        function initJitsi(domain, roomName) {
            const options = {
                roomName: roomName,
                parentNode: containerRef.current,
                width: '100%',
                height: '100%',
                configOverwrite: { 
                    prejoinPageEnabled: false,
                    startWithAudioMuted: false,
                    startWithVideoMuted: false
                },
                interfaceConfigOverwrite: {
                    // Ocultar opciones para que sea muy limpio
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'settings'
                    ],
                }
            };
            
            api = new window.JitsiMeetExternalAPI(domain, options);
            
            // Si es el alumno, podemos ocultar su acceso a invitar a otros
            if (!isTeacher) {
                api.executeCommand('subject', 'Tutoría Genio Academy');
            }
        }

        return () => {
            if (api) {
                api.dispose();
            }
        };
    }, [meetingLink, isTeacher]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="flex justify-between items-center bg-[#0a0a14] p-4 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <span className="font-bold tracking-widest text-sm uppercase">Transmisión en Vivo Segura</span>
                </div>
                <button 
                    onClick={onClose}
                    className="btn btn-sm btn-error shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                    <X className="w-4 h-4" /> Finalizar y Eyectarse
                </button>
            </div>
            
            {/* Contenedor del Iframe de Jitsi */}
            <div ref={containerRef} className="w-full h-full flex-grow bg-slate-900 flex items-center justify-center">
                <span className="loading loading-ring loading-lg text-indigo-500"></span>
            </div>
        </div>
    );
};

export default JitsiMeetWrapper;
