// ============================================================
// COMPONENTE: MinijuegoCalculo.jsx
// Minijuego de aritmética rápida embebido como modal superpuesto.
//
// Props:
//   onClose()        → Cierra el minijuego sin resultado
//   onFinish(won)    → Llama al backend y notifica el resultado al padre
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';

const MAX_MISTAKES = 3;
const GOAL_CORRECT = 10;

// Genera una operación aleatoria
function generateOperation() {
  const types = ['add', 'sub', 'mul', 'div'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let num1, num2, symbol, result;

  switch (type) {
    case 'add':
      num1 = Math.floor(Math.random() * 41) + 5; // 5-45
      num2 = Math.floor(Math.random() * 41) + 5; // 5-45
      symbol = '+';
      result = num1 + num2;
      break;
    case 'sub':
      num1 = Math.floor(Math.random() * 51) + 20; // 20-70
      num2 = Math.floor(Math.random() * (num1 - 5)) + 5; // Asegura resultado positivo > 5
      symbol = '-';
      result = num1 - num2;
      break;
    case 'mul':
      num1 = Math.floor(Math.random() * 9) + 2; // 2-10
      num2 = Math.floor(Math.random() * 9) + 2; // 2-10
      symbol = '×';
      result = num1 * num2;
      break;
    case 'div':
      const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
      const quotient = Math.floor(Math.random() * 9) + 2; // 2-10
      num1 = divisor * quotient;
      num2 = divisor;
      symbol = '÷';
      result = quotient;
      break;
    default:
      break;
  }

  return { num1, num2, symbol, result };
}

export default function MinijuegoCalculo({ onClose, onFinish }) {
  const [currentOp, setCurrentOp] = useState(generateOperation);
  const [userInput, setUserInput] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'

  // Ref para estabilizar el timer
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [timeLeft, setTimeLeft] = useState(150); // 2 minutos y medio en segundos
  const inputRef = useRef(null);

  // Contador de tiempo
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

  // Formatea el tiempo MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentOp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameState !== 'playing' || feedback) return;

    const answer = parseInt(userInput);
    
    if (answer === currentOp.result) {
      setFeedback('correct');
      setTimeout(() => {
        const nextCount = correctCount + 1;
        setCorrectCount(nextCount);
        setFeedback(null);
        setUserInput('');
        if (nextCount >= GOAL_CORRECT) {
          setGameState('won');
          onFinish(true, false); // <--- Suma vida en el acto, pero deja ver la victoria
        } else {
          setCurrentOp(generateOperation());
        }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);
        setFeedback(null);
        setUserInput('');
        if (nextMistakes >= MAX_MISTAKES) {
          setGameState('lost');
          onFinish(false, false); // <--- Bloquea en el acto, pero NO cierra el modal encore
        } else {
          setCurrentOp(generateOperation());
        }
      }, 800);
    }
  };

  const mistakesLeft = MAX_MISTAKES - mistakes;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-[0_0_60px_rgba(245,158,11,0.15)] relative overflow-hidden">
        
        {/* ── CABECERA ── */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-amber-400 font-outfit uppercase tracking-wider">⏱️ Cálculo Mental</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-outfit">Resuelve 10 operaciones sin fallar 3 veces</p>
            </div>
            {/* Reloj de cuenta atrás */}
            <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 ${timeLeft < 30 ? 'bg-rose-900/30 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-400'}`}>
              <div className="text-lg font-mono font-black">{formatTime(timeLeft)}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* ── BARRA DE PROGRESO Y VIDAS ── */}
        <div className="px-6 pt-6 flex justify-between items-end gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progreso: {correctCount}/10</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                style={{ width: `${(correctCount / GOAL_CORRECT) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Escudos agotados</p>
            <div className="flex gap-1 justify-end">
              {[...Array(MAX_MISTAKES)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-300 ${i < mistakes ? 'bg-rose-900/40 border-rose-500/50 text-rose-500 scale-90 opacity-50' : 'bg-slate-800 border-slate-600 text-amber-500'}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ÁREA DE JUEGO ── */}
        <div className="p-10 text-center relative min-h-[250px] flex flex-col justify-center">
          {gameState === 'playing' ? (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-center gap-6 font-mono whitespace-nowrap overflow-x-auto py-2">
                <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] leading-none">
                  {currentOp.num1} {currentOp.symbol} {currentOp.num2}
                </div>
                <div className="text-5xl font-black text-slate-500">=</div>
                <input
                  ref={inputRef}
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={`
                    w-32 bg-slate-800 border-4 rounded-2xl text-5xl font-black text-center py-2 focus:outline-none transition-all
                    appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                    ${feedback === 'correct' ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400' : 
                      feedback === 'wrong' ? 'border-rose-500 bg-rose-950/30 text-rose-400' : 
                      'border-slate-700 focus:border-amber-400 text-white shadow-[0_0_20px_rgba(30,41,59,0.5)]'}
                  `}
                  autoFocus
                />
              </div>
              <p className="text-slate-500 italic text-sm animate-pulse">Escribe el resultado y pulsa Enter</p>
              
              {/* Feedback visual flotante */}
              {feedback === 'correct' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-emerald-500 opacity-20 pointer-events-none animate-ping">
                  <CheckCircle2 className="w-40 h-40" />
                </div>
              )}
            </form>
          ) : (
            <div className="animate-in zoom-in duration-300">
              {gameState === 'won' ? (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    <Trophy className="w-20 h-20 text-amber-400 mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                    <div className="absolute -top-4 -right-4 text-4xl">✨</div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-1">¡Misión Cumplida!</h3>
                  </div>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 max-w-xs mx-auto">
                    <p className="text-emerald-400 font-bold mb-1">+1 Planeta recuperado 🪐</p>
                    <p className="text-[10px] text-emerald-500/80 uppercase font-black">Te han sobrado {mistakesLeft} escudos</p>
                  </div>
                  <button
                    onClick={() => onFinish(true, true)}
                    className="btn btn-md w-full max-w-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-none text-white font-black rounded-xl shadow-lg"
                  >
                    CONFIRMAR VICTORIA
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-1">Sistema Bloqueado</h3>
                    <p className="text-slate-400 text-sm">
                      {timeLeft <= 0 ? 'Se ha agotado el tiempo de respuesta del sistema.' : `Has agotado los ${MAX_MISTAKES} escudos de protección.`}
                    </p>
                  </div>
                  <p className="text-rose-400 font-bold text-sm bg-rose-500/10 py-2 border-y border-rose-500/20">
                    No has podido recuperar el planeta esta vez.
                  </p>
                  <button
                    onClick={() => onFinish(false, true)}
                    className="btn btn-md w-full max-w-xs bg-slate-700 hover:bg-slate-600 border-none text-white font-black rounded-xl"
                  >
                    ENTENDIDO
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── DECORACIÓN ── */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      </div>
    </div>,
    document.body
  );
}

