import React, { useEffect, useState, useContext } from 'react';
import { Video } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import JitsiMeetWrapper from './JitsiMeetWrapper';

const ActiveCallBanner = () => {
    const { user } = useContext(AuthContext);
    const [activeCall, setActiveCall] = useState(null);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        // No verificamos si no está logeado o si es profesor
        if (!user || user.is_teacher) return;

        const checkCall = async () => {
            try {
                const response = await axiosInstance.get('teachers/consultations/active_calls/');
                if (response.data && response.data.id) {
                    setActiveCall(response.data);
                } else {
                    setActiveCall(null);
                    setIsJoined(false);
                }
            } catch (error) {
                console.error("Error comprobando llamadas activas", error);
            }
        };

        checkCall();
        // Polling cada 30 segundos por si el profesor la inicia mientras el alumno navega
        const interval = setInterval(checkCall, 30000);
        return () => clearInterval(interval);
    }, [user]);

    if (!activeCall) return null;

    if (isJoined) {
        return (
            <JitsiMeetWrapper 
                meetingLink={activeCall.meeting_link}
                isTeacher={false}
                onClose={() => setIsJoined(false)}
            />
        );
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="fixed top-[80px] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-400 p-4 rounded-2xl shadow-[0_10px_40px_rgba(99,102,241,0.5)] flex flex-col md:flex-row items-center gap-4 justify-between"
            >
                <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                        <Video className="w-5 h-5 text-red-500 animate-pulse" /> 
                        ¡Llamada de Tutoría Activa!
                    </h4>
                    <p className="text-indigo-200 text-sm">El profesor <span className="font-bold text-teal-400">{activeCall.professor_name}</span> inició la transmisión que solicitaste.</p>
                </div>
                
                <button 
                    onClick={() => setIsJoined(true)}
                    className="btn bg-white text-indigo-900 hover:bg-indigo-100 border-0 shadow-xl"
                >
                    Conectarse Ahora
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default ActiveCallBanner;
