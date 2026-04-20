// ============================================================
// ARCHIVO: LessonQuiz.jsx
// FUNCIÓN: Componente del "Simulador" o quiz de una lección concreta.
//
// Este componente gestiona el mini-test de opción múltiple que el alumno
// debe superar para que la lección quede marcada como "completada" (verde)
// en el panel de "Ruta de Vuelo".
//
// Máquina de estados interna con 4 fases:
//   - 'INICIO':   Pantalla inicial con el botón de arrancar el simulador.
//   - 'JUGANDO':  El alumno responde preguntas una por una.
//   - 'FALLADO':  Si falla una, vuelve a empezar el test completo.
//   - 'SUPERADO': Ha respondido todas correctamente. Lección completada.
//
// Props que recibe:
//   - lesson:    El objeto de la lección con sus ejercicios (preguntas y opciones)
//   - onPassed:  Función del componente padre para notificarle que se superó la lección
// ============================================================

import { useState, useEffect } from 'react';
import { ShieldAlert, FileWarning, HelpCircle, RefreshCw, Trophy, Target } from 'lucide-react';
import axiosInstance from '../api/axios';

export default function LessonQuiz({ lesson, onPassed }) {

    // Estado de la máquina: controla qué "pantalla" mostrar en cada momento
    const [estado, setEstado] = useState('INICIO'); // 'INICIO' | 'JUGANDO' | 'FALLADO' | 'SUPERADO'

    // El "pool" es la lista de preguntas seleccionadas y mezcladas para esta ronda
    const [preguntasRonda, setPreguntasRonda] = useState([]);

    // Índice de la pregunta actual (empieza por la 0)
    const [indicePreguntaActual, setIndicePreguntaActual] = useState(0);

    // Este efecto se ejecuta cada vez que el alumno cambia de lección
    // (cuando cambia lesson.id). Sirve para "resetear" el simulador al estado inicial.
    useEffect(() => {
        setEstado('INICIO');
        setPreguntasRonda([]);
        setIndicePreguntaActual(0);
    }, [lesson?.id]); // El ? es "optional chaining": evita errores si lesson es null

    // Función que se ejecuta cuando el alumno pulsa "Iniciar Simulación"
    const arrancarSimulador = () => {
        // Si la lección no tiene ejercicios (el profe aún no los ha creado),
        // la marcamos como superada para no bloquear al alumno
        if (!lesson?.exercises || lesson.exercises.length === 0) {
            setEstado('SUPERADO');
            if (onPassed) onPassed(lesson.id); // Notificamos al padre que la lección está superada
            return;
        }

        // Mezclamos todas las preguntas disponibles en orden aleatorio
        // (El truco de 0.5 - Math.random() es una forma rápida de mezclar arrays)
        const preguntasMezcladas = [...lesson.exercises].sort(() => 0.5 - Math.random());

        // Cogemos un máximo de 3 preguntas para no hacer el test demasiado largo.
        // Si hay menos de 3 disponibles, cogemos todas las que haya.
        const preguntasSeleccionadas = preguntasMezcladas.slice(0, Math.min(3, preguntasMezcladas.length));

        // Guardamos las preguntas seleccionadas y arrancamos el simulador
        setPreguntasRonda(preguntasSeleccionadas);
        setIndicePreguntaActual(0);
        setEstado('JUGANDO');
    };

    // Función que se ejecuta cuando el alumno hace clic en una de las opciones de respuesta
    const manejarRespuesta = (opcionSeleccionada) => {
        // Obtenemos la pregunta actual del array de preguntas de esta ronda
        const preguntaActual = preguntasRonda[indicePreguntaActual];

        if (opcionSeleccionada === preguntaActual.correct_answer) {
            // ✅ Respuesta correcta
            if (indicePreguntaActual + 1 >= preguntasRonda.length) {
                // Era la última pregunta → ¡El alumno ha superado el simulador!
                setEstado('SUPERADO');
                if (onPassed) onPassed(lesson.id); // Notificamos al padre
            } else {
                // Aún quedan más preguntas → avanzamos a la siguiente
                setIndicePreguntaActual(indicePreguntaActual + 1);
            }
        } else {
            // ❌ Respuesta incorrecta → el alumno vuelve a empezar desde el principio
            // Restamos un planeta mediante una llamada al backend
            axiosInstance.post('users/lives/decrease/').catch(err => {
                console.error("Error al restar planeta:", err);
            });
            
            setEstado('FALLADO');
        }
    };

    // Si no hay lección (por algún error), no renderizamos nada
    if (!lesson) return null;

    // ─── PANTALLA: INICIO ───────────────────────────────────────────────────
    if (estado === 'INICIO') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide mb-2">Simulador de Combate Lógico</h3>
                <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
                    Para dar la lección por asimilada debes superar <strong>{lesson.exercises ? Math.min(3, lesson.exercises.length) : 'las pruebas'}</strong> de nuestras pruebas extraídas de la base de datos central sin cometer <strong className="text-pink-400">ni un solo error</strong>.
                </p>
                <button
                    className="btn btn-outline border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.2)] px-8 font-bold"
                    onClick={arrancarSimulador}
                >
                    {/* Si no hay ejercicios, el texto del botón cambia */}
                    {lesson.exercises?.length === 0 ? 'Protocolo de Emergencia (Sin Pruebas)' : 'Iniciar Simulación Dinámica'}
                </button>
            </div>
        );
    }

    // ─── PANTALLA: FALLADO ──────────────────────────────────────────────────
    if (estado === 'FALLADO') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-red-950/30 rounded-2xl border border-red-500/20">
                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Sistemas Comprometidos</h3>
                <p className="text-slate-400 max-w-sm mb-6">
                    Has aportado un dato erróneo. No sabemos si tu nave aguantará. Es imprescindible releer la teoría y volver a intentarlo.
                </p>
                {/* El botón "Reintentar" vuelve a llamar a arrancarSimulador que mezcla las preguntas de nuevo */}
                <button className="btn bg-slate-800 hover:bg-slate-700 text-white border-none gap-2" onClick={arrancarSimulador}>
                    <RefreshCw className="w-4 h-4"/> Sincronizar Nuevo Intento
                </button>
            </div>
        );
    }

    // ─── PANTALLA: SUPERADO ─────────────────────────────────────────────────
    if (estado === 'SUPERADO') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-green-950/20 rounded-2xl border border-green-500/20 relative overflow-hidden">
                {/* Fondo brillante verde decorativo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-500/10 blur-[50px] pointer-events-none"></div>
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 relative z-10">
                    <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2 relative z-10">¡Sector Controlado!</h3>
                <p className="text-green-200/60 max-w-sm relative z-10">
                    Enhorabuena, comandante. Has asimilado la teoría a la perfección. La ruta de vuelo de esta lección se ha actualizado a VERDE.
                </p>
            </div>
        );
    }

    // ─── PANTALLA: JUGANDO ──────────────────────────────────────────────────
    // Obtenemos la pregunta que toca mostrar en este momento
    const preguntaActual = preguntasRonda[indicePreguntaActual];

    return (
        <div className="flex flex-col bg-slate-900/40 rounded-2xl border border-cyan-500/20 p-6 shadow-[0_0_30px_rgba(34,211,238,0.05)]">

            {/* Cabecera con el indicador de progreso (puntos azules) */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                    <FileWarning className="w-5 h-5 text-amber-500" />
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">
                        Simulación {indicePreguntaActual + 1} de {preguntasRonda.length}
                    </span>
                </div>
                {/* Barras de progreso visuales: azul = completada, pulse = actual, gris = pendiente */}
                <div className="flex gap-1">
                    {preguntasRonda.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 w-8 rounded-full transition-colors duration-500 ${
                                idx < indicePreguntaActual
                                    ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'  // Completada
                                    : idx === indicePreguntaActual
                                        ? 'bg-cyan-400 animate-pulse'  // Pregunta actual (pulsando)
                                        : 'bg-slate-800'               // Pendiente
                            }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Texto de la pregunta actual */}
            <div className="mb-10 px-4 flex gap-4">
                <div className="w-12 h-12 rounded-full border border-pink-500/30 flex items-center justify-center bg-slate-900/50 shrink-0">
                    <HelpCircle className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white leading-snug">{preguntaActual.question}</h4>
            </div>

            {/* Opciones de respuesta en forma de tarjetas clicables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preguntaActual.options.map((opcion, idx) => (
                    <button
                        key={idx}
                        onClick={() => manejarRespuesta(opcion)}  // Al clicar, comprobamos si es correcta
                        className="p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-cyan-500/50 hover:-translate-y-1 transition-all text-left group shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            {/* Letra identificativa de la opción (A, B, C...) */}
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0 transition-colors border border-white/5">
                                {String.fromCharCode(65 + idx)}  {/* 65 = código ASCII de 'A' */}
                            </div>
                            <span className="text-slate-200 font-medium break-words w-full">{opcion}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
