// ============================================================
// COMPONENTE: MinijuegoCompletar.jsx
// Minijuego de completar huecos con letras (incluyendo acentos).
// ============================================================

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, AlertTriangle, CheckCircle2, Type, Sparkles } from 'lucide-react';

const WORDS_TO_WIN = 5;
const MAX_MISTAKES = 3;
const GAME_TIME = 150; // 2.5 min

const ACCENT_POOL = ['Á', 'É', 'Í', 'Ó', 'Ú'];
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const WORD_POOL = [
    { word: 'SATÉLITE',   def: 'Cuerpo celeste que orbita alrededor de un planeta.' },
    { word: 'MICROSCOPIO', def: 'Instrumento para observar objetos muy pequeños.' },
    { word: 'TELESCOPIO', def: 'Instrumento para observar objetos lejanos.' },
    { word: 'QUÍMICA',    def: 'Ciencia que estudia la composición de la materia.' },
    { word: 'BIOLOGÍA',   def: 'Ciencia que estudia los seres vivos y sus leyes.' },
    { word: 'GENÉTICA',   def: 'Estudio de la herencia y de los genes.' },
    { word: 'MOLÉCULA',   def: 'Unión de varios átomos que forman una unidad.' },
    { word: 'OXÍGENO',    def: 'Gas vital para la respiración de los seres vivos.' },
    { word: 'FÓSIL',      def: 'Resto petrificado de un organismo antiguo.' },
    { word: 'VELOCIDAD',  def: 'Rapidez con la que se mueve un objeto.' },
    { word: 'OXIDACIÓN',  def: 'Proceso químico de combinar algo con oxígeno.' },
    { word: 'NEWTON',     def: 'Famoso científico de las leyes de la física.' },
    { word: 'EINSTEIN',   def: 'Científico autor de la teoría de la relatividad.' },
    { word: 'SISTEMA',    def: 'Conjunto de elementos que interactúan entre sí.' },
    { word: 'ECOSISTEMA', def: 'Entorno natural y los seres que viven en él.' },
    { word: 'HIDRÓGENO',  def: 'El elemento más ligero y abundante del universo.' },
    { word: 'MAGNETISMO', def: 'Propiedad de atracción o repulsión de los imanes.' },
    { word: 'EVOLUCIÓN',  def: 'Desarrollo o cambio gradual de las especies.' }
];

export default function MinijuegoCompletar({ onClose, onFinish }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  
  // Estado de la palabra actual
  const [displayWord, setDisplayWord] = useState([]); // Array de {original, hidden, userInput}
  
  // Estados del teclado
  const [correctLetters, setCorrectLetters] = useState([]);
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [wrongHighlight, setWrongHighlight] = useState(null); // La letra parpadeando en rojo

  // Ref para el callback de salida
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);

  // Inicializar juego: elegir 5 palabras
  useEffect(() => {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    setSelectedWords(shuffled.slice(0, WORDS_TO_WIN));
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

  // Preparar palabra actual
  useEffect(() => {
    if (selectedWords.length === 0 || currentIndex >= WORDS_TO_WIN) return;
    
    // Resetear estados del teclado para la nueva palabra
    setCorrectLetters([]);
    setDisabledLetters([]);
    setWrongHighlight(null);

    const targetWord = selectedWords[currentIndex].word;
    const wordArr = targetWord.split('');
    
    // Decidir qué letras esconder según las reglas del usuario
    const len = wordArr.length;
    let hiddenCount = 1;

    if (len >= 3 && len <= 4) hiddenCount = 2;
    else if (len >= 5 && len <= 6) hiddenCount = 3;
    else if (len >= 7 && len <= 8) hiddenCount = 4;
    else if (len >= 9) hiddenCount = 5; // Para 9-10 o más

    const hiddenIndices = [];
    while (hiddenIndices.length < hiddenCount) {
        const idx = Math.floor(Math.random() * len);
        if (!hiddenIndices.includes(idx)) hiddenIndices.push(idx);
    }

    const stateArr = wordArr.map((char, i) => ({
        original: char,
        hidden: hiddenIndices.includes(i),
        userInput: ''
    }));

    setDisplayWord(stateArr);
  }, [selectedWords, currentIndex]);

  const handleLetterClick = (letter) => {
    if (gameState !== 'playing' || wrongHighlight || disabledLetters.includes(letter)) return;

    // Verificar si la letra pulsada está en ALGUNO de los huecos ocultos de la palabra
    const isCorrect = displayWord.some(item => item.hidden && item.original === letter && !item.userInput);

    if (isCorrect) {
        setCorrectLetters(prev => [...prev, letter]);
        
        // Rellenar TODOS los huecos que coincidan con esa letra
        const newDisplay = displayWord.map(item => {
            if (item.hidden && item.original === letter) {
                return { ...item, userInput: letter };
            }
            return item;
        });
        
        setDisplayWord(newDisplay);

        // ¿Palabra completada (todos los huecos rellenos)?
        if (newDisplay.every(item => item.hidden ? item.userInput !== '' : true)) {
            setTimeout(() => {
                if (currentIndex + 1 >= WORDS_TO_WIN) {
                    setGameState('won');
                    onFinishRef.current(true, false);
                } else {
                    setCurrentIndex(prev => prev + 1);
                }
            }, 800);
        }
    } else {
        // Fallo
        setWrongHighlight(letter);
        setMistakes(prev => {
            const next = prev + 1;
            if (next >= MAX_MISTAKES) {
                setGameState('lost');
                onFinishRef.current(false, false);
            }
            return next;
        });
        
        // Esperar 1.5s y luego deshabilitar
        setTimeout(() => {
            setWrongHighlight(null);
            setDisabledLetters(prev => [...prev, letter]);
        }, 1500);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedWords.length === 0) return null;

  const currentDef = selectedWords[currentIndex]?.def || '';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/98 backdrop-blur-md p-2 md:p-4">
      <div className="bg-slate-900 border-2 border-slate-700/50 rounded-3xl w-full max-w-5xl shadow-[0_0_80px_rgba(139,92,246,0.2)] relative overflow-hidden flex flex-col p-4 md:p-8 max-h-[98vh]">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-violet-400 mb-0.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Completar Palabra</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white font-outfit uppercase">Misión {currentIndex + 1} de {WORDS_TO_WIN}</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Escudos Vitales</span>
                    <div className="flex gap-1">
                        {[...Array(MAX_MISTAKES)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-5 h-1.5 rounded-full transition-all duration-500 ${i < (MAX_MISTAKES - mistakes) ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-800'}`} 
                            />
                        ))}
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 ${timeLeft < 30 ? 'bg-rose-900/30 border-rose-500 text-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-violet-400'}`}>
                    <span className="text-lg font-mono font-black">{formatTime(timeLeft)}</span>
                </div>
            </div>
        </div>

        {/* ── ÁREA DE JUEGO ── */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 relative overflow-y-auto min-h-0">
            
            <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl max-w-2xl mb-6 text-center relative animate-in fade-in slide-in-from-top duration-500">
                <p className="text-sm md:text-base text-slate-300 font-medium italic leading-relaxed">"{currentDef}"</p>
            </div>

            {/* Palabra con Huecos */}
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mb-8">
                {displayWord.map((item, i) => (
                    <div 
                        key={i}
                        className={`
                            w-8 h-12 md:w-14 md:h-18 rounded-lg flex items-center justify-center text-xl md:text-3xl font-black transition-all duration-300
                            ${!item.hidden ? 'bg-slate-800/50 text-slate-400' : 
                              item.userInput ? 'bg-violet-600 text-white shadow-lg scale-105 border-b-4 border-violet-800' : 
                              'bg-slate-900 border-2 border-slate-700 text-transparent shadow-inner'}
                        `}
                    >
                        {item.hidden ? item.userInput : item.original}
                    </div>
                ))}
            </div>

            {/* CONTENEDOR DE TECLADO: Principal + Numpad de Acentos */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6 px-2">
                
                {/* Teclado Alfabético (Izquierda/Centro) */}
                <div className="flex flex-col gap-2 md:gap-3 flex-1 lg:flex-none">
                    {[
                        ['A','B','C','D','E','F','G','H','I','J'],
                        ['K','L','M','N','Ñ','O','P','Q','R','S'],
                        ['T','U','V','W','X','Y','Z']
                    ].map((row, rIdx) => (
                        <div key={rIdx} className="flex justify-center gap-1 md:gap-2">
                            {row.map(letter => {
                                const isCorrect = correctLetters.includes(letter);
                                const isDisabled = disabledLetters.includes(letter);
                                const isWrong = wrongHighlight === letter;
                                return (
                                    <button
                                        key={letter}
                                        disabled={isDisabled || isWrong || isCorrect || gameState !== 'playing'}
                                        onClick={() => handleLetterClick(letter)}
                                        className={`
                                            w-8 h-10 md:w-12 md:h-14 rounded-lg font-black text-sm md:text-lg transition-all duration-200
                                            ${isCorrect ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                                              isWrong ? 'bg-rose-500 text-white animate-shake' :
                                              isDisabled ? 'opacity-20 bg-slate-800 text-slate-600' :
                                              'bg-slate-800 text-white hover:bg-violet-600 hover:scale-105 active:scale-95 border-b-4 border-slate-950'}
                                        `}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Panel de Tildes (Derecha - Estilo Teclado Numérico) */}
                <div className="bg-slate-800/40 p-4 rounded-3xl border border-violet-500/20 flex flex-col items-center shadow-inner">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-3">Tildes</span>
                    <div className="grid grid-cols-2 gap-2">
                        {ACCENT_POOL.map((letter, idx) => {
                            const isCorrect = correctLetters.includes(letter);
                            const isDisabled = disabledLetters.includes(letter);
                            const isWrong = wrongHighlight === letter;
                            return (
                                <button
                                    key={letter}
                                    disabled={isDisabled || isWrong || isCorrect || gameState !== 'playing'}
                                    onClick={() => handleLetterClick(letter)}
                                    style={{ 
                                        gridColumn: idx === 4 ? 'span 2' : 'span 1' // Centramos la 'Ú' si es la última
                                    }}
                                    className={`
                                        w-12 h-12 md:w-14 md:h-14 rounded-xl font-black text-lg md:text-2xl transition-all duration-200
                                        ${isCorrect ? 'bg-emerald-500 text-white shadow-lg' :
                                          isWrong ? 'bg-rose-500 text-white animate-shake' :
                                          isDisabled ? 'opacity-20 bg-slate-800' :
                                          'bg-gradient-to-br from-violet-600 to-indigo-700 text-white hover:from-violet-500 hover:to-indigo-600 shadow-[0_4px_0_rgb(76,29,149)] active:translate-y-1'}
                                    `}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>

        {/* ── FOOTER ── */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-center">
             {gameState === 'playing' ? (
                <button 
                    onClick={() => onClose()}
                    className="flex items-center gap-2 text-slate-600 hover:text-rose-400 font-bold uppercase text-[10px] transition-colors"
                >
                    <X className="w-3 h-3" /> ABANDONAR MISIÓN
                </button>
             ) : gameState === 'won' ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                    <h4 className="text-lg font-black text-white mb-2 tracking-tighter uppercase">¡MISIÓN CUMPLIDA!</h4>
                    <button
                        onClick={() => onFinishRef.current(true, true)}
                        className="py-3 px-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-sm"
                    >
                        RECUPERAR PLANETA 🪐
                    </button>
                </div>
             ) : (
                <div className="text-center animate-in zoom-in duration-500">
                    <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                    <h4 className="text-lg font-black text-white mb-1">FALLO EN LA TRANSMISIÓN</h4>
                    <p className="text-slate-400 text-xs mt-1 mb-4">La palabra era: <span className="text-white font-bold tracking-widest">"{selectedWords[currentIndex].word}"</span></p>
                    <button
                        onClick={() => onFinishRef.current(false, true)}
                        className="py-3 px-10 bg-slate-700 text-white font-black rounded-xl hover:bg-slate-600 transition-all uppercase tracking-widest text-sm"
                    >
                        ENTENDIDO
                    </button>
                </div>
             )}
        </div>

      </div>
    </div>,
    document.body
  );
}
