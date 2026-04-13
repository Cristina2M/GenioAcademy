// ============================================================
// COMPONENTE: MinijuegoVerdaderoFalso.jsx
// Minijuego de evaluar afirmaciones científicas.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, AlertTriangle, CheckCircle2, HelpCircle, Zap } from 'lucide-react';

const WORDS_TO_WIN = 5;
const MAX_MISTAKES = 3;
const GAME_TIME = 90; // 1.5 min

const FACT_POOL = [
    { statement: 'El Sol es una estrella de tipo enana amarilla.', answer: true },
    { statement: 'Los humanos tenemos exactamente 4 pulmones.', answer: false },
    { statement: 'La Tierra es el tercer planeta del sistema solar.', answer: true },
    { statement: 'Marte tiene dos lunas llamadas Fobos y Deimos.', answer: true },
    { statement: 'El sonido viaja más rápido que la luz.', answer: false },
    { statement: 'El diamante es el material natural más duro que existe.', answer: true },
    { statement: 'Los delfines son un tipo de pez.', answer: false },
    { statement: 'La gran muralla china es visible desde la Luna.', answer: false },
    { statement: 'Venus es el planeta más caliente de nuestro sistema.', answer: true },
    { statement: 'El cuerpo humano adulto tiene 206 huesos.', answer: true },
    { statement: 'Isaac Newton fue quien descubrió la penicilina.', answer: false },
    { statement: 'La Antártida es el desierto más grande del mundo.', answer: true },
    { statement: 'El agua hierve a 90 grados a nivel del mar.', answer: false },
    { statement: 'Un año bisiesto tiene 366 días.', answer: true },
    { statement: 'Los murciélagos son mamíferos.', answer: true },
    { statement: 'El Amazonas es el río más largo del mundo.', answer: true },
    { statement: 'El hierro es un metal precioso.', answer: false },
    { statement: 'La luz tarda unos 8 minutos en llegar del Sol a la Tierra.', answer: true }
];

export default function MinijuegoVerdaderoFalso({ onClose, onFinish }) {
  const [selectedFacts, setSelectedFacts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  
  // Feedback visual
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'wrong', answer: boolean }

  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);

  // Inicializar juego
  useEffect(() => {
    const shuffled = [...FACT_POOL].sort(() => 0.5 - Math.random());
    setSelectedFacts(shuffled.slice(0, 10)); // Elegimos 10 aunque solo necesiten 5 para ganar
  }, []);

  // Timer Estable
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('lost');
          onFinishRef.current(false, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (userAnswer) => {
    if (gameState !== 'playing' || feedback) return;

    const currentFact = selectedFacts[currentIndex];
    const isCorrect = currentFact.answer === userAnswer;

    if (isCorrect) {
      setFeedback({ type: 'correct', answer: userAnswer });
      setCorrectCount(prev => prev + 1);
      
      setTimeout(() => {
        setFeedback(null);
        if (correctCount + 1 >= WORDS_TO_WIN) {
          setGameState('won');
          onFinishRef.current(true, false);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 500); // 0.5 segundos de flash

    } else {
      setFeedback({ type: 'wrong', answer: userAnswer });
      setMistakes(prev => {
          const next = prev + 1;
          if (next >= MAX_MISTAKES) {
              setTimeout(() => {
                setGameState('lost');
                onFinishRef.current(false, false);
              }, 500);
          }
          return next;
      });

      setTimeout(() => {
        setFeedback(null);
        if (mistakes + 1 < MAX_MISTAKES) {
          setCurrentIndex(prev => prev + 1);
        }
      }, 500);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedFacts.length === 0) return null;

  const currentStatement = selectedFacts[currentIndex]?.statement || '';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/98 backdrop-blur-md p-2 md:p-4">
      <div className="bg-slate-900 border-2 border-slate-700/50 rounded-3xl w-full max-w-4xl shadow-[0_0_80px_rgba(20,184,166,0.2)] relative overflow-hidden flex flex-col p-6 md:p-10 min-h-[500px]">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-teal-400 mb-1">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Verdadero o Falso</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white font-outfit uppercase">Preguntas acertadas {correctCount} de {WORDS_TO_WIN}</h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Escudos de Datos</span>
                    <div className="flex gap-1.5">
                        {[...Array(MAX_MISTAKES)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-8 h-2 rounded-full transition-all duration-500 ${i < (MAX_MISTAKES - mistakes) ? 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-slate-800'}`} 
                            />
                        ))}
                    </div>
                </div>
                <div className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-2 ${timeLeft < 20 ? 'bg-rose-900/30 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-teal-400'}`}>
                    <span className="text-xl font-mono font-black">{formatTime(timeLeft)}</span>
                </div>
            </div>
        </div>

        {/* ── CUERPO DEL JUEGO ── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 py-4">
            
            {/* Afirmación */}
            <div className="relative w-full max-w-3xl text-center">
                <HelpCircle className="w-16 h-16 text-slate-800 absolute -top-10 left-1/2 -translate-x-1/2 opacity-30" />
                <p className="text-2xl md:text-4xl font-black text-white leading-tight md:leading-snug animate-in fade-in zoom-in duration-300">
                    "{currentStatement}"
                </p>
            </div>

            {/* Botones de Opción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                <button
                    disabled={gameState !== 'playing' || feedback}
                    onClick={() => handleAnswer(true)}
                    className={`
                        group relative py-6 md:py-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                        ${feedback?.type === 'correct' && feedback.answer === true ? 'bg-emerald-500 border-emerald-400 scale-105 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 
                          feedback?.type === 'wrong' && feedback.answer === true ? 'bg-rose-500 border-rose-400 animate-shake' :
                          'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'}
                    `}
                >
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${feedback?.answer === true ? 'text-white' : 'text-emerald-500'}`}>Verdadero</span>
                </button>

                <button
                    disabled={gameState !== 'playing' || feedback}
                    onClick={() => handleAnswer(false)}
                    className={`
                        group relative py-6 md:py-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                        ${feedback?.type === 'correct' && feedback.answer === false ? 'bg-emerald-500 border-emerald-400 scale-105 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 
                          feedback?.type === 'wrong' && feedback.answer === false ? 'bg-rose-500 border-rose-400 animate-shake' :
                          'bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800'}
                    `}
                >
                    <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${feedback?.answer === false ? 'text-white' : 'text-rose-500'}`}>Falso</span>
                </button>
            </div>
            
        </div>

        {/* ── FOOTER / ESTADOS ── */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
             {gameState === 'playing' ? (
                <button 
                    onClick={() => onClose()}
                    className="flex items-center gap-2 text-slate-500 hover:text-rose-400 font-bold uppercase text-xs transition-colors"
                >
                    <X className="w-4 h-4" /> ABANDONAR MISIÓN
                </button>
             ) : gameState === 'won' ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <Trophy className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                    <h4 className="text-xl font-black text-white mb-4 tracking-tighter uppercase">¡MISIÓN CUMPLIDA!</h4>
                    <button
                        onClick={() => onFinishRef.current(true, true)}
                        className="py-4 px-12 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest"
                    >
                        RECUPERAR PLANETA 🪐
                    </button>
                </div>
             ) : (
                <div className="text-center animate-in zoom-in duration-500">
                    <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <h4 className="text-xl font-black text-white mb-4 tracking-tighter uppercase">ERROR DE EVALUACIÓN</h4>
                    <button
                        onClick={() => onFinishRef.current(false, true)}
                        className="py-4 px-12 bg-slate-700 text-white font-black rounded-2xl hover:bg-slate-600 transition-all uppercase tracking-widest"
                    >
                        VOLVER AL CENTRO
                    </button>
                </div>
             )}
        </div>

      </div>
    </div>,
    document.body
  );
}
