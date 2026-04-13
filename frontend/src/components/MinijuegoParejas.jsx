// ============================================================
// COMPONENTE: MinijuegoParejas.jsx
// Minijuego de memoria tipo "parejas" embebido como modal superpuesto.
//
// Props:
//   onClose()        → Cierra el minijuego sin resultado
//   onFinish(won)    → Llama al backend y notifica el resultado al padre
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { avatarDatabase } from '../utils/avatarUtils';
import { X, RefreshCw, Trophy, AlertTriangle, ShieldCheck } from 'lucide-react';

const MAX_ATTEMPTS = 6;

// Genera 10 cartas (5 parejas de búhos al azar) barajadas
function generateBoard() {
  const shuffled = [...avatarDatabase].sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled
    .flatMap(avatar => [
      { id: `${avatar.id}-a`, avatarId: avatar.id, src: avatar.src, name: avatar.name, matched: false, flipped: false },
      { id: `${avatar.id}-b`, avatarId: avatar.id, src: avatar.src, name: avatar.name, matched: false, flipped: false },
    ])
    .sort(() => Math.random() - 0.5);
}

export default function MinijuegoParejas({ onClose, onFinish }) {
  const [board, setBoard] = useState(generateBoard);
  const [selected, setSelected] = useState([]);
  const [checking, setChecking] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);         // Pares volteados hasta ahora
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'

  const attemptsLeft = MAX_ATTEMPTS - attempts;

  // Victoria: todas las parejas encontradas
  useEffect(() => {
    if (matchedCount === 5 && gameState === 'playing') {
      setGameState('won');
    }
  }, [matchedCount, gameState]);

  // Derrota: se acabaron los intentos y no ha ganado
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS && matchedCount < 5 && gameState === 'playing') {
      // Revelar todas las cartas restantes durante 1.2s antes de bloquear
      setBoard(prev => prev.map(c => ({ ...c, flipped: true })));
      setTimeout(() => setGameState('lost'), 1200);
    }
  }, [attempts, matchedCount, gameState]);

  const handleCardClick = (card) => {
    if (checking || card.flipped || card.matched || selected.length >= 2 || gameState !== 'playing') return;

    const newSelected = [...selected, card];
    setBoard(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setChecking(true);
      const [first, second] = newSelected;

      if (first.avatarId === second.avatarId) {
        setTimeout(() => {
          setBoard(prev => prev.map(c => c.avatarId === first.avatarId ? { ...c, matched: true } : c));
          setMatchedCount(m => m + 1);
          setSelected([]);
          setChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setAttempts(a => a + 1);
          setBoard(prev => prev.map(c =>
            c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setChecking(false);
        }, 900);
      }
    }
  };

  const restart = () => {
    setBoard(generateBoard());
    setSelected([]);
    setMatchedCount(0);
    setAttempts(0);
    setChecking(false);
    setGameState('playing');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-[0_0_60px_rgba(245,158,11,0.15)] relative">

        {/* ── CABECERA ── */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-black text-amber-400">🎴 Parejas de Astro</h2>
            <p className="text-xs text-slate-400 mt-0.5">Empareja los búhos iguales</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Contador de intentos */}
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Intentos</p>
              <p className={`text-2xl font-black ${attemptsLeft <= 2 ? 'text-rose-400' : 'text-white'}`}>
                {attemptsLeft}
              </p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* ── BARRA DE PROGRESO ── */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400">{matchedCount}/5</span>
            <div className="flex-1 bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(matchedCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── ÁREA DE JUEGO (Tablero o Resultado) ── */}
        <div className="p-5 relative min-h-[340px] flex flex-col justify-center">
          {gameState === 'playing' ? (
            <div className="grid grid-cols-5 gap-2.5 animate-in fade-in duration-500">
              {board.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={card.matched || card.flipped || checking || gameState !== 'playing'}
                  className={`
                    aspect-square rounded-xl border-2 transition-all duration-300
                    ${card.matched
                      ? 'border-emerald-500/70 bg-emerald-900/30 shadow-[0_0_10px_rgba(52,211,153,0.25)] scale-95'
                      : card.flipped
                      ? 'border-amber-400/70 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/80 hover:border-amber-400/50 hover:bg-slate-700 cursor-pointer active:scale-95'
                    }
                  `}
                >
                  {card.flipped || card.matched ? (
                    <img
                      src={card.src}
                      alt={card.name}
                      className={`w-full h-full object-contain p-1.5 transition-opacity duration-300 ${card.matched ? 'opacity-70' : 'opacity-100'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl select-none">🪐</div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 max-w-xl mx-auto animate-in zoom-in duration-500">
              {gameState === 'won' ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Trophy className="w-20 h-20 text-amber-400" />
                </div>
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">¡MISIÓN CUMPLIDA!</h3>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 mb-8 w-full">
                    <p className="text-emerald-400 font-bold mb-1">+1 Planeta recuperado 🪐</p>
                    <p className="text-[10px] text-emerald-500/80 uppercase font-black">Has emparejado a todos los Astro-Búhos</p>
                  </div>
                  <button
                      onClick={() => onFinish(true)}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-all uppercase tracking-widest text-sm"
                  >
                      RECUPERAR PLANETA 🪐
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 text-center">
                      <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Sistema Bloqueado</h3>
                  
                  <div className="w-full p-3 bg-rose-500/10 border-y border-rose-500/20 mb-8">
                    <p className="text-rose-400 font-bold text-xs uppercase tracking-widest">No has podido recuperar el planeta esta vez.</p>
                  </div>

                  <button
                      onClick={() => onFinish(false)}
                      className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-sm border border-slate-700"
                  >
                      VOLVER AL CENTRO
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── PIE DECORATIVO ── */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      </div>
    </div>,
    document.body
  );
}
