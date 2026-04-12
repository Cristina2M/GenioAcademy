// ============================================================
// COMPONENTE: MinijuegoSopaLetras.jsx
// Minijuego de búsqueda de palabras en cuadrícula 10x10.
// Incluye definiciones educativas para cada palabra.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, AlertTriangle, CheckCircle2, Search, Info } from 'lucide-react';

const GRID_SIZE = 10;
const WORDS_PER_GAME = 6;
const GAME_TIME = 180; // 3 minutos

const WORD_POOL = [
    { word: 'GALAXIA',   def: 'Gran sistema de estrellas y materia interestelar.' },
    { word: 'ATOMO',     def: 'Unidad mínima de la materia.' },
    { word: 'ORBITA',    def: 'Trayectoria de un cuerpo alrededor de otro.' },
    { word: 'CUASAR',    def: 'Núcleo galáctico extremadamente luminoso.' },
    { word: 'NEBULOSA',  def: 'Nube de gas y polvo en el espacio.' },
    { word: 'ASTEROIDE', def: 'Pequeño cuerpo rocoso que orbita el Sol.' },
    { word: 'COMETA',    def: 'Cuerpo de hielo y polvo con cola luminosa.' },
    { word: 'PLANETA',   def: 'Cuerpo celeste que orbita una estrella.' },
    { word: 'ESTRELLA',  def: 'Esfera de gas que emite luz y calor.' },
    { word: 'GRAVEDAD',  def: 'Fuerza que atrae a los cuerpos entre sí.' },
    { word: 'COSMOS',    def: 'El universo ordenado y armonioso.' },
    { word: 'ECLIPSE',   def: 'Ocultación temporal de un astro por otro.' },
    { word: 'PROTON',    def: 'Partícula con carga positiva del núcleo.' },
    { word: 'FISICA',    def: 'Ciencia que estudia la materia y energía.' },
    { word: 'MATERIA',   def: 'Todo lo que ocupa espacio y tiene masa.' },
    { word: 'ENERGIA',   def: 'Capacidad de realizar un trabajo o cambio.' },
    { word: 'PULSAR',    def: 'Estrella de neutrones que emite radiación.' },
    { word: 'VACIO',     def: 'Espacio físico que no contiene materia.' }
];

// ── UTILIDADES DE GENERACIÓN ──

function generateGrid(selectedWordObjs) {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal abajo-derecha
    [-1, 1],  // Diagonal arriba-derecha
  ];

  const placedWords = [];

  for (const obj of selectedWordObjs) {
    let placed = false;
    let attempts = 0;
    const word = obj.word;

    while (!placed && attempts < 100) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlace(grid, word, row, col, dir)) {
        const positions = [];
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          grid[r][c] = word[i];
          positions.push({ r, c });
        }
        placedWords.push({ ...obj, positions });
        placed = true;
      }
      attempts++;
    }
  }

  // Rellenar con letras aleatorias
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placedWords };
}

function canPlace(grid, word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

// ── COMPONENTE PRINCIPAL ──

export default function MinijuegoSopaLetras({ onClose, onFinish }) {
  const [gameData, setGameData] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [selection, setSelection] = useState(null); // { start: {r,c}, end: {r,c} }
  const [wrongSelection, setWrongSelection] = useState(null); // { coords: string[] }
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  // Guardamos onFinish en un ref para que el timer sea imperturbable
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Inicialización
  useEffect(() => {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, WORDS_PER_GAME);
    setGameData(generateGrid(selected));
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

  const handleCellClick = (r, c) => {
    if (gameState !== 'playing' || wrongSelection) return;

    if (!selection) {
      setSelection({ start: { r, c }, end: { r, c } });
    } else {
      const start = selection.start;
      const dr = r - start.r;
      const dc = c - start.c;
      
      const isHorizontal = dr === 0;
      const isVertical = dc === 0;
      const isDiagonal = Math.abs(dr) === Math.abs(dc);

      if (isHorizontal || isVertical || isDiagonal) {
        checkWord(start, { r, c });
      }
      setSelection(null);
    }
  };

  const checkWord = (start, end) => {
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    const length = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c)) + 1;
    
    let selectedText = '';
    const selectedCoords = [];

    for (let i = 0; i < length; i++) {
        const r = start.r + dr * i;
        const c = start.c + dc * i;
        selectedText += gameData.grid[r][c];
        selectedCoords.push(`${r}-${c}`);
    }

    const reversed = selectedText.split('').reverse().join('');
    const target = gameData.placedWords.find(pw => 
        (pw.word === selectedText || pw.word === reversed) &&
        !foundWords.includes(pw.word)
    );

    if (target) {
        const newFound = [...foundWords, target.word];
        setFoundWords(newFound);
        if (newFound.length === WORDS_PER_GAME) {
            setGameState('won');
            onFinishRef.current(true, false);
        }
    } else {
        setWrongSelection({ coords: selectedCoords });
        setTimeout(() => setWrongSelection(null), 1500);
    }
  };

  const isCellSelected = (r, c) => {
    if (!selection) return false;
    return selection.start.r === r && selection.start.c === c;
  };

  const isCellInFoundWord = (r, c) => {
    if (!gameData) return false;
    return gameData.placedWords.some(pw => 
        foundWords.includes(pw.word) && 
        pw.positions.some(p => p.r === r && p.c === c)
    );
  };

  const isCellWrong = (r, c) => {
    return wrongSelection?.coords.includes(`${r}-${c}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameData) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl shadow-[0_0_60px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        
        {/* ── PANEL IZQUIERDO: CUADRÍCULA ── */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-700/50 overflow-y-auto">
          <div className="w-full flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950/50 rounded-lg border border-cyan-500/30">
                    <Search className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-black text-white font-outfit uppercase tracking-wider">Sopa de Letras</h2>
             </div>
             <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${timeLeft < 30 ? 'bg-rose-900/30 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-400'}`}>
                <span className="text-lg font-mono font-black">{formatTime(timeLeft)}</span>
             </div>
          </div>

          <div 
            className="grid gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-inner"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: 'min(85vw, 500px)',
                aspectRatio: '1/1'
            }}
          >
            {gameData.grid.map((row, r) => 
                row.map((char, c) => {
                    const found = isCellInFoundWord(r, c);
                    const active = isCellSelected(r, c);
                    const isErr = isCellWrong(r, c);
                    return (
                        <button
                            key={`${r}-${c}`}
                            disabled={gameState !== 'playing'}
                            onClick={() => handleCellClick(r, c)}
                            className={`
                                aspect-square text-xs md:text-xl font-black flex items-center justify-center transition-all duration-200 rounded-md
                                ${found ? 'bg-cyan-500 text-white scale-90 shadow-lg' : 
                                  isErr ? 'bg-rose-500 text-white animate-shake' :
                                  active ? 'bg-amber-400 text-slate-900 animate-pulse' : 
                                  'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            {char}
                        </button>
                    );
                })
            )}
          </div>
          <div className="flex items-center gap-2 mt-6 text-slate-500">
             <Info className="w-4 h-4" />
             <p className="text-[10px] uppercase tracking-widest font-bold">Haz clic en la letra inicial y luego en la final</p>
          </div>
        </div>

        {/* ── PANEL DERECHO: DEFINICIONES ── */}
        <div className="w-full md:w-96 p-6 md:p-8 bg-slate-800/30 flex flex-col">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-700 pb-2">Objetivos de Búsqueda ({foundWords.length}/{WORDS_PER_GAME})</h3>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {gameData.placedWords.map((pw, i) => {
                    const isFound = foundWords.includes(pw.word);
                    return (
                        <div 
                            key={i}
                            className={`
                                p-2 md:p-3 rounded-xl border transition-all duration-500
                                ${isFound ? 'bg-emerald-950/30 border-emerald-500/50 grayscale-[0.5]' : 'bg-slate-900/50 border-slate-700/50'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-0.5">
                                <span className={`text-sm font-black tracking-widest font-outfit ${isFound ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                    {pw.word}
                                </span>
                                {isFound && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <p className={`text-[10px] leading-tight font-medium ${isFound ? 'text-emerald-600/70' : 'text-slate-400 italic'}`}>
                                {pw.def}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* ── FOOTER ESTADOS ── */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
                {gameState === 'playing' ? (
                    <button 
                        onClick={() => onClose()}
                        className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-rose-950/20 hover:border-rose-500/50 hover:text-rose-400 transition-all flex items-center justify-center gap-2 group"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        ABANDONAR MISIÓN
                    </button>
                ) : gameState === 'won' ? (
                    <div className="text-center animate-in slide-in-from-bottom duration-500">
                        <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                        <h4 className="text-lg font-black text-white mb-4 uppercase tracking-tighter">¡Sector Asegurado!</h4>
                        <button
                            onClick={() => onFinishRef.current(true, true)}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            RESTABLECER SISTEMAS 🪐
                        </button>
                    </div>
                ) : (
                    <div className="text-center animate-in slide-in-from-bottom duration-500">
                        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                        <h4 className="text-lg font-black text-white mb-4 uppercase tracking-tighter">Conexión Perdida</h4>
                        <button
                            onClick={() => onFinishRef.current(false, true)}
                            className="w-full py-4 bg-slate-700 text-white font-black rounded-xl hover:bg-slate-600 shadow-lg transition-all"
                        >
                            ENTENDIDO
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Botón de cierre absoluto */}
        <button 
            onClick={() => onClose()} 
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full transition-colors z-10"
        >
            <X className="w-5 h-5 text-slate-500 hover:text-white" />
        </button>
      </div>
    </div>,
    document.body
  );
}
