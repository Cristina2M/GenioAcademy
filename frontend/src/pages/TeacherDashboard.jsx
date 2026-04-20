// ============================================================
// ARCHIVO: TeacherDashboard.jsx
// FUNCIÓN: Panel de Control del Docente (/teacher-dashboard).
//
// Esta página es exclusiva para los profesores (is_teacher=true en el JWT).
// Si un alumno normal intenta acceder, se le redirige al dashboard de alumnos.
//
// Tiene DOS pestañas:
//   1. "Consultas" (Bandeja de entrada): El profesor ve todas las tutorías
//      que le han enviado los alumnos y puede iniciar videollamadas.
//   2. "Mis Alumnos": Tabla con todos los alumnos que han completado
//      algún curso en las materias del profesor. Puede ver su ficha.
//
// Componentes hijos (separados al final del archivo para legibilidad):
//   - ConsultationsTab: Lógica y UI de la bandeja de consultas.
//   - StudentsTab: Lógica y UI de la tabla de alumnos.
// ============================================================

import React, { useState, useEffect, useContext } from 'react';
import { Mail, Users, CheckCircle, Clock, Search, Video, Inbox } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentCardModal from '../components/StudentCardModal';
import JitsiMeetWrapper from '../components/JitsiMeetWrapper';

// ─── COMPONENTE PRINCIPAL: Panel del Profesor ───────────────────────────────
const TeacherDashboard = () => {
    // Obtenemos los datos del usuario logueado desde el contexto global
    const { user } = useContext(AuthContext);

    // Estado: controla qué pestaña está activa ('inbox' = Consultas o 'students' = Mis Alumnos)
    const [pestanaActiva, setPestanaActiva] = useState('inbox');

    // Estado: lista de consultas/tutorías recibidas por el profesor
    const [consultas, setConsultas] = useState([]);

    // Estado: lista de alumnos que han completado cursos de las materias del profesor
    const [alumnos, setAlumnos] = useState([]);

    // Estado de carga: true mientras esperamos la respuesta del servidor
    const [cargando, setCargando] = useState(true);

    // Estado: el alumno seleccionado para ver su ficha (null = nadie seleccionado)
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    // Estado: la consulta con videollamada activa (null = no hay llamada en curso)
    // Si el profesor tiene una llamada ya activa y recarga la página, la restauramos aquí.
    const [llamadaActiva, setLlamadaActiva] = useState(null);

    // Cargamos los datos del servidor cuando el componente se monta
    // Solo si hay un usuario logueado y es profesor
    useEffect(() => {
        if (!user || !user.is_teacher) return;
        cargarDatos();
    }, [user]);

    // Función que carga tanto las consultas como la lista de alumnos en paralelo
    const cargarDatos = async () => {
        try {
            // Promise.all permite hacer las dos peticiones al mismo tiempo (más rápido que secuencial)
            const [respuestaConsultas, respuestaAlumnos] = await Promise.all([
                axiosInstance.get('teachers/consultations/'),        // Mis consultas
                axiosInstance.get('teachers/consultations/my_students/') // Mis alumnos
            ]);

            setConsultas(respuestaConsultas.data);
            setAlumnos(respuestaAlumnos.data);

            // Comprobamos si el profesor tiene alguna videollamada ya en curso (por si recargó la página)
            const llamadaEnCurso = respuestaConsultas.data.find(
                c => c.is_live_call && c.status === 'IN_CALL'
            );
            if (llamadaEnCurso) {
                setLlamadaActiva(llamadaEnCurso); // Restauramos la llamada activa en el estado
            }

        } catch (error) {
            console.error("Error al cargar los datos del panel docente:", error);
        } finally {
            setCargando(false); // Ocultamos el spinner tanto si hubo error como si no
        }
    };

    // Función que se llama cuando el profesor pulsa "Iniciar Videollamada" en una consulta
    const iniciarLlamada = async (idConsulta) => {
        try {
            // Enviamos la petición al backend para que genere la sala de Jitsi
            const respuesta = await axiosInstance.post(`teachers/consultations/${idConsulta}/start_call/`);
            // Guardamos los datos de la llamada activa (incluido el enlace de Jitsi)
            setLlamadaActiva(respuesta.data);
            // Recargamos los datos para refrescar el estado de la consulta en la lista
            cargarDatos();
        } catch (error) {
            console.error("Error al iniciar la videollamada:", error);
        }
    };

    // Función que se llama cuando el profesor cierra/finaliza la videollamada
    const finalizarLlamada = async () => {
        if (!llamadaActiva) return; // Si no hay llamada activa, no hacemos nada
        try {
            // Notificamos al backend que la llamada ha terminado
            await axiosInstance.post(`teachers/consultations/${llamadaActiva.id}/end_call/`, {
                response: 'Tutoría por videollamada realizada con éxito.'
            });
            setLlamadaActiva(null);  // Limpiamos la llamada activa del estado
            cargarDatos();           // Refrescamos la lista de consultas
        } catch (error) {
            console.error("Error al finalizar la videollamada:", error);
            // Por seguridad, forzamos el cierre aunque falle el servidor
            setLlamadaActiva(null);
        }
    };

    // Protección de ruta: si no hay usuario, redirigimos al login
    if (!user) return <Navigate to="/login" />;

    // Protección de ruta: si el usuario logueado no es profesor, redirigimos a su dashboard
    if (!user.is_teacher) return <Navigate to="/dashboard" />;

    return (
        <div className="min-h-screen pt-28 pb-32 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Cabecera: Título + Pestañas de navegación */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Panel Docente</h1>
                        <p className="text-slate-400">Bienvenido/a, Maestro/a {user.username}</p>
                    </div>

                    {/* Selector de pestañas */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                        {/* Pestaña: Consultas */}
                        <button
                            onClick={() => setPestanaActiva('inbox')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${pestanaActiva === 'inbox' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Inbox className="w-4 h-4" /> Consultas
                        </button>
                        {/* Pestaña: Mis Alumnos */}
                        <button
                            onClick={() => setPestanaActiva('students')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${pestanaActiva === 'students' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Users className="w-4 h-4" /> Mis Alumnos
                        </button>
                    </div>
                </div>

                {/* Contenido: Spinner mientras carga / Contenido de la pestaña activa */}
                {cargando ? (
                    <div className="flex justify-center items-center py-32">
                        <span className="loading loading-ring loading-lg text-indigo-500"></span>
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
                        {/* Mostramos el componente de la pestaña activa */}
                        {pestanaActiva === 'inbox' ? (
                            <ConsultationsTab
                                consultas={consultas}
                                onIniciarLlamada={iniciarLlamada}
                                onCargarDatos={cargarDatos}
                            />
                        ) : (
                            <StudentsTab alumnos={alumnos} onSeleccionarAlumno={setAlumnoSeleccionado} />
                        )}
                    </div>
                )}
            </div>

            {/* Modal de ficha del alumno (aparece al hacer clic en "Ver Ficha") */}
            <StudentCardModal
                student={alumnoSeleccionado}
                onClose={() => setAlumnoSeleccionado(null)}
                onIniciarLlamada={iniciarLlamada}
            />

            {/* Si hay una videollamada activa, mostramos la pantalla de Jitsi por encima de todo */}
            {llamadaActiva && (
                <JitsiMeetWrapper
                    meetingLink={llamadaActiva.meeting_link}
                    isTeacher={true}        // El profesor tiene controles adicionales
                    onClose={finalizarLlamada} // Al cerrar, finalizamos la llamada en el backend
                />
            )}
        </div>
    );
};


// ─── COMPONENTE INTERNO: Pestaña de Consultas ───────────────────────────────
const ConsultationsTab = ({ consultas, onIniciarLlamada, onCargarDatos }) => {
    // Estado local para manejar el texto de respuesta de cada ticket individualmente
    const [respuestasLocales, setRespuestasLocales] = useState({}); // { consultaId: 'texto' }
    const [resolviendoId, setResolviendoId] = useState(null);

    const manejarCambioTexto = (id, texto) => {
        setRespuestasLocales(prev => ({ ...prev, [id]: texto }));
    };

    const manejarResolucionTexto = async (id) => {
        const texto = respuestasLocales[id];
        if (!texto || !texto.trim()) return;

        setResolviendoId(id);
        try {
            await axiosInstance.post(`teachers/consultations/${id}/resolve/`, {
                response: texto
            });
            // Refrescamos los datos globales del dashboard
            onCargarDatos();
            // Limpiamos el campo de texto de este ticket
            manejarCambioTexto(id, '');
        } catch (error) {
            console.error("Error al resolver consulta por texto:", error);
            alert("Error al enviar la transmisión de respuesta.");
        } finally {
            setResolviendoId(null);
        }
    };

    if (consultas.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <CheckCircle className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bandeja Vacía</h3>
                <p className="text-slate-400 max-w-sm mx-auto">No hay consultas estelares pendientes en tu sector.</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-white/5">
            {consultas.map(consulta => (
                <div key={consulta.id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors relative">
                    {consulta.is_live_call && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_red]"></div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna 1: Información del alumno y el problema */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                                    {consulta.course_title || 'Consulta Directa'}
                                </span>
                                {consulta.status === 'PENDING' ? (
                                    <span className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-widest"><Clock className="w-3 h-3"/> Pendiente</span>
                                ) : consulta.status === 'IN_CALL' ? (
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse"><Video className="w-3 h-3"/> En Llamada</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-teal-400 text-xs font-bold uppercase tracking-widest"><CheckCircle className="w-3 h-3"/> Resuelta</span>
                                )}
                            </div>
                            <h4 className="text-white font-bold text-lg">De: <span className="text-teal-400">{consulta.student_name}</span></h4>
                            <p className="text-slate-300 mt-3 p-4 bg-black/30 rounded-xl font-medium leading-relaxed italic border border-white/5">
                                "{consulta.message}"
                            </p>
                            {consulta.response && (
                                <div className="mt-4 p-4 border border-teal-500/20 bg-teal-500/5 rounded-xl">
                                    <span className="block text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">Respuesta Emitida</span>
                                    <p className="text-white text-sm">{consulta.response}</p>
                                </div>
                            )}
                        </div>

                        {/* Columna 2: Acciones del Profesor */}
                        <div className="flex flex-col gap-4 border-l border-white/10 lg:pl-8">
                            {consulta.status === 'PENDING' && (
                                <>
                                    {/* Sub-sección: Videollamada */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Respuesta en Vivo</label>
                                        <button
                                            onClick={() => onIniciarLlamada(consulta.id)}
                                            className="btn btn-sm bg-red-600 hover:bg-red-500 text-white border-0 gap-2"
                                        >
                                            <Video className="w-4 h-4" /> Iniciar Llamada
                                        </button>
                                    </div>

                                    <div className="h-px bg-white/10 my-1"></div>

                                    {/* Sub-sección: Respuesta de Texto */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Responder por Texto</label>
                                        <textarea 
                                            placeholder="Escribe la solución o agenda una cita..."
                                            className="textarea textarea-sm bg-black/40 border-white/10 text-white min-h-[80px] focus:border-teal-500"
                                            value={respuestasLocales[consulta.id] || ''}
                                            onChange={(e) => manejarCambioTexto(consulta.id, e.target.value)}
                                        ></textarea>
                                        <button
                                            onClick={() => manejarResolucionTexto(consulta.id)}
                                            disabled={resolviendoId === consulta.id || !(respuestasLocales[consulta.id] || '').trim()}
                                            className="btn btn-sm bg-teal-600 hover:bg-teal-500 text-white border-0 shadow-lg shadow-teal-600/20"
                                        >
                                            {resolviendoId === consulta.id ? <span className="loading loading-spinner loading-xs"></span> : 'Resolver Ticket'}
                                        </button>
                                    </div>
                                </>
                            )}
                            <p className="text-[9px] text-slate-600 uppercase tracking-tighter text-right mt-auto">
                                Sincronizado: {new Date(consulta.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// ─── COMPONENTE INTERNO: Pestaña de Alumnos ─────────────────────────────────
// Muestra la tabla de alumnos que han completado cursos de las materias del profesor.
// Props:
//   - alumnos: Array de objetos alumno (id, username, level, xp, lives, avatar)
//   - onSeleccionarAlumno: Función para abrir la ficha del alumno seleccionado
const StudentsTab = ({ alumnos, onSeleccionarAlumno }) => {
    // Si no hay alumnos todavía, mostramos un mensaje vacío
    if (alumnos.length === 0) {
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
        // Tabla responsive con scroll horizontal en pantallas pequeñas
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
                    {alumnos.map(alumno => (
                        <tr key={alumno.id} className="hover:bg-white/[0.02]">
                            {/* Avatar + Nombre del alumno */}
                            <td className="py-6 px-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30">
                                    <img src={`/assets/buho/${alumno.avatar}.png`} alt="Avatar del alumno" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-white">{alumno.username}</span>
                            </td>
                            {/* Nivel RPG del alumno */}
                            <td className="py-6">
                                <span className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm font-bold">Lvl. {alumno.level}</span>
                            </td>
                            {/* Vidas (Planetas) del alumno */}
                            <td className="py-6">
                                <span className="text-pink-400 font-bold">{alumno.lives} ❤️</span>
                            </td>
                            {/* Botón para abrir la ficha del alumno */}
                            <td className="py-6 px-8 text-right">
                                <button
                                    onClick={() => onSeleccionarAlumno(alumno)}
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
