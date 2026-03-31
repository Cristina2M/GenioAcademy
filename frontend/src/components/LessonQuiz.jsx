import { useState, useEffect } from 'react';
import { ShieldAlert, FileWarning, HelpCircle, RefreshCw, Trophy, Target } from 'lucide-react';

export default function LessonQuiz({ lesson, onPassed }) {
  const [status, setStatus] = useState('START'); // START, PLAYING, FAILED, PASSED
  const [pool, setPool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cada vez que cambiamos de lección, reiniciamos el test de esa lección
  useEffect(() => {
    setStatus('START');
    setPool([]);
    setCurrentIndex(0);
  }, [lesson?.id]);

  const startQuiz = () => {
    if (!lesson?.exercises || lesson.exercises.length === 0) {
      // Si el profesor aún no ha escrito ejercicios en base de datos para esta lección,
      // la pasamos automáticamente para no bloquear al usuario.
      setStatus('PASSED');
      if (onPassed) onPassed(lesson.id);
      return;
    }

    // Mezclamos todos los ejercicios disponibles usando el truco de Math.random()
    const shuffledExercises = [...lesson.exercises].sort(() => 0.5 - Math.random());
    
    // Si hay más de 3 preguntas, pillamos solo 3 aleatorias para que cada intento sea único
    // Si hay menos de 3, las cogemos todas.
    const selectedPool = shuffledExercises.slice(0, Math.min(3, shuffledExercises.length));
    
    setPool(selectedPool);
    setCurrentIndex(0);
    setStatus('PLAYING');
  };

  const handleAnswerSelect = (selectedOption) => {
    const currentQ = pool[currentIndex];
    
    if (selectedOption === currentQ.correct_answer) {
      // Ha acertado
      if (currentIndex + 1 >= pool.length) {
        // Eran todas las preguntas! Victoria total
        setStatus('PASSED');
        if (onPassed) onPassed(lesson.id);
      } else {
        // Pasamos a la siguiente flashcard
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // Ha fallado UNA pregunta en Modo Flashcard Permanente -> Suspenso completo
      setStatus('FAILED');
    }
  };

  if (!lesson) return null;

  if (status === 'START') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 rounded-2xl border border-white/5">
        <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide mb-2">Simulador de Combate Lógico</h3>
        <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
          Para dar la lección por asimilada debes superar <strong>{lesson.exercises ? Math.min(3, lesson.exercises.length) : 'las pruebas'}</strong> de nuestras pruebas extraídas de la base de datos central sin cometer <strong className="text-pink-400">ni un solo error</strong>.
        </p>
        <button className="btn btn-outline border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.2)] px-8 font-bold" onClick={startQuiz}>
           {lesson.exercises?.length === 0 ? 'Protocolo de Emergencia (Sin Pruebas)' : 'Iniciar Simulación Dinámica'}
        </button>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-950/30 rounded-2xl border border-red-500/20">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Sistemas Comprometidos</h3>
        <p className="text-slate-400 max-w-sm mb-6">
          Has aportado un dato erróneo. No sabemos si tu nave aguantará. Es imprescindible releer la teoría y volver a intentarlo.
        </p>
        <button className="btn bg-slate-800 hover:bg-slate-700 text-white border-none gap-2" onClick={startQuiz}>
          <RefreshCw className="w-4 h-4"/> Sincronizar Nuevo Intento
        </button>
      </div>
    );
  }

  if (status === 'PASSED') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-green-950/20 rounded-2xl border border-green-500/20 relative overflow-hidden">
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

  // STATUS === PLAYING
  const currentQ = pool[currentIndex];

  return (
    <div className="flex flex-col bg-slate-900/40 rounded-2xl border border-cyan-500/20 p-6 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
      
      {/* Controles y progreso */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
           <FileWarning className="w-5 h-5 text-amber-500" />
           <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Simulación {currentIndex+1} de {pool.length}</span>
        </div>
        <div className="flex gap-1">
          {pool.map((_, idx) => (
             <div key={idx} className={`h-2 w-8 rounded-full transition-colors duration-500 ${idx < currentIndex ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : idx === currentIndex ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'}`}></div>
          ))}
        </div>
      </div>

      {/* Pregunta */}
      <div className="mb-10 px-4 flex gap-4">
        <div className="w-12 h-12 rounded-full border border-pink-500/30 flex items-center justify-center bg-slate-900/50 shrink-0">
           <HelpCircle className="w-6 h-6 text-pink-400" />
        </div>
        <h4 className="text-xl md:text-2xl font-bold text-white leading-snug">{currentQ.question}</h4>
      </div>

      {/* Tarjetas de Opciones Modulares (Flashcards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQ.options.map((option, idx) => (
          <button 
            key={idx}
            onClick={() => handleAnswerSelect(option)}
            className="p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-cyan-500/50 hover:-translate-y-1 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0 transition-colors border border-white/5">
                 {String.fromCharCode(65 + idx)}
               </div>
               <span className="text-slate-200 font-medium break-words w-full">{option}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
