import React, { useState, useEffect, useContext } from 'react';
import { Mail, Users, CheckCircle, Clock, Search, Video, Inbox } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentCardModal from '../components/StudentCardModal';
import { getStudentAvatar } from '../utils/avatarUtils';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' or 'students'
    const [consultations, setConsultations] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        if (!user || !user.is_teacher) return;
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [consRes, stuRes] = await Promise.all([
                axiosInstance.get('teachers/consultations/'),
                axiosInstance.get('teachers/consultations/my_students/')
            ]);
            setConsultations(consRes.data);
            setStudents(stuRes.data);
        } catch (error) {
            console.error("Error cargando dashboard de profesor:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <Navigate to="/login" />;
    if (!user.is_teacher) return <Navigate to="/dashboard" />;

    return (
        <div className="min-h-screen pt-28 pb-32 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Panel Docente</h1>
                        <p className="text-slate-400">Bienvenido/a, Maestro/a {user.username}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                        <button 
                            onClick={() => setActiveTab('inbox')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'inbox' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Inbox className="w-4 h-4" /> Consultas
                        </button>
                        <button 
                            onClick={() => setActiveTab('students')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'students' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Users className="w-4 h-4" /> Mis Alumnos
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <span className="loading loading-ring loading-lg text-indigo-500"></span>
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
                        {activeTab === 'inbox' ? (
                            <ConsultationsTab consultations={consultations} refresh={fetchData} />
                        ) : (
                            <StudentsTab students={students} onSelectStudent={setSelectedStudent} />
                        )}
                    </div>
                )}
            </div>

            <StudentCardModal 
                student={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
            />
        </div>
    );
};

const ConsultationsTab = ({ consultations, refresh }) => {
    if (consultations.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <CheckCircle className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bandeja Vacía</h3>
                <p className="text-slate-400 max-w-sm mx-auto">No hay consultas estelares pendientes en tu sector. ¡Buen trabajo de enseñanza!</p>
            </div>
        );
    }
    
    return (
        <div className="divide-y divide-white/5">
            {consultations.map(c => (
                <div key={c.id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                                    {c.course_title || 'N/A'}
                                </span>
                                {c.status === 'PENDING' ? (
                                    <span className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-widest"><Clock className="w-3 h-3"/> Pendiente</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-teal-400 text-xs font-bold uppercase tracking-widest"><CheckCircle className="w-3 h-3"/> Resuelta</span>
                                )}
                            </div>
                            <h4 className="text-white font-bold text-lg">Consulta de <span className="text-teal-400">{c.student_name}</span></h4>
                            <p className="text-slate-300 mt-3 p-4 bg-black/30 rounded-xl font-medium leading-relaxed italic">
                                "{c.message}"
                            </p>
                        </div>
                        
                        <div className="min-w-[250px] flex flex-col gap-3 justify-center border-l md:border-t-0 border-white/10 pt-4 md:pt-0 md:pl-8">
                             {/* Para la FASE 17.5 / Tutorías añadiremos el botón de Crear Sala y Enviar Mensaje */}
                             {c.status === 'PENDING' && (
                                <button className="btn w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-400 hover:to-purple-400">
                                    Responder Ticket
                                </button>
                             )}
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center mt-2">
                                RECIBIDA {new Date(c.created_at).toLocaleDateString()}
                             </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const StudentsTab = ({ students, onSelectStudent }) => {
    if (students.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Search className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sin Alumnos</h3>
                <p className="text-slate-400 max-w-sm mx-auto">Todavía no hay alumnos que hayan completado cursos en tus materias.</p>
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                        <th className="bg-transparent tracking-widest py-6 px-8">Explorador</th>
                        <th className="bg-transparent tracking-widest py-6">Nivel</th>
                        <th className="bg-transparent tracking-widest py-6">Vidas</th>
                        <th className="bg-transparent tracking-widest py-6 text-right px-8">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {students.map(s => (
                        <tr key={s.id} className="hover:bg-white/[0.02]">
                            <td className="py-6 px-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30">
                                    {/* getStudentAvatar resuelve el ID del búho del alumno a la ruta real del asset */}
                                    <img src={getStudentAvatar(s.avatar || 'buho1')} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-white">{s.username}</span>
                            </td>
                            <td className="py-6">
                                <span className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm font-bold">Lvl. {s.level}</span>
                            </td>
                            <td className="py-6">
                                <span className="text-pink-400 font-bold">{s.lives} ❤️</span>
                            </td>
                            <td className="py-6 px-8 text-right">
                                <button 
                                    onClick={() => onSelectStudent(s)}
                                    className="btn btn-sm btn-ghost hover:bg-white/10 text-teal-400"
                                >
                                    Ver Ficha
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherDashboard;

