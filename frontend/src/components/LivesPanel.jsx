// ============================================================
// ARCHIVO: LivesPanel.jsx
// FUNCIÓN: Panel de "Planetas" (vidas) del alumno con simuladores de minijuego.
//
// Muestra:
//   - Los 3 planetas actuales (rellenos o vacíos)
//   - Cuenta atrás hasta el siguiente planeta si hay vidas perdidas
//   - Si está en Game Over (0 vidas) y es Plan 3: botones de simulación de minijuego
//
// Los botones "Superado" y "Fallado" simulan el resultado de un minijuego
// para comprobar la lógica del backend antes de implementar los juegos reales.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Rocket, ShieldAlert, RefreshCw, X, Clock, Play } from 'lucide-react';
import MinijuegoParejas from './MinijuegoParejas';
import MinijuegoCalculo from './MinijuegoCalculo';
import MinijuegoSopaLetras from './MinijuegoSopaLetras';
import MinijuegoCompletar from './MinijuegoCompletar';
import MinijuegoVerdaderoFalso from './MinijuegoVerdaderoFalso';

// IDs de los 5 minijuegos disponibles
const MINIGAMES = [
  { id: 'pairs',      label: '🎴 Parejas',      desc: 'Busca las parejas de imágenes de Astro antes de agotar tus 6 intentos.',  route: '/minijuego/parejas' },
  { id: 'arcade',     label: '⏱️ Cálculo',     desc: 'Resuelve 10 operaciones matemáticas al azar. ¡Solo se permiten 3 errores!', route: '/minijuego/calculo' },
  { id: 'wordsearch', label: '🔤 Sopa letras', desc: 'Encuentra palabras clave escondidas en la cuadrícula de letras.',       route: '/minijuego/sopa-letras' },
  { id: 'fill_word',  label: '✍️ Completar',   desc: 'Rellena los huecos de la palabra con las letras que faltan.',           route: '/minijuego/completar' },
  { id: 'true_false', label: '🎯 V o F',       desc: 'Responde Verdadero o Falso a una serie de preguntas rápidas.',         route: '/minijuego/verdadero-falso' },
];

// Debe coincidir con MINIGAME_COOLDOWN_SECONDS en backend/users/views.py
const MINIGAME_COOLDOWN_SECONDS = 30; // 30 segundos para pruebas

export default function LivesPanel() {
  const navigate = useNavigate();
  const [livesData, setLivesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedMinigame, setSelectedMinigame] = useState(MINIGAMES[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMinigame, setActiveMinigame] = useState(null); // ID del minijuego activo

  // Carga el estado de vidas desde el backend
  const fetchLives = useCallback(async () => {
    try {
      const res = await axiosInstance.get('users/lives/');
      setLivesData(res.data);
      setCountdown(res.data.seconds_until_next_life);
    } catch (err) {
      console.error('Error al obtener vidas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLives();
  }, [fetchLives]);

  // Escuchar eventos globales para actualizaciones instantáneas de UI (ej. desde el Simulador)
  useEffect(() => {
    const handlePlanetaPerdido = () => {
      setLivesData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lives: Math.max(0, prev.lives - 1)
        };
      });
      // Pedimos datos al servidor poco después para asegurar sincronía
      setTimeout(fetchLives, 500);
    };

    window.addEventListener('planetaPerdido', handlePlanetaPerdido);
    return () => window.removeEventListener('planetaPerdido', handlePlanetaPerdido);
  }, [fetchLives]);

  // Polling independiente al servidor cada 1 segundo para mantener sincronía
  // Esto garantiza que los planetas se actualicen sin necesidad de recargar
  useEffect(() => {
    const poll = setInterval(() => {
      fetchLives();
    }, 1000);
    return () => clearInterval(poll);
  }, [fetchLives]);

  // Reloj local: descuenta 1 segundo cada tick para la cuenta atrás visual
  // Es INDEPENDIENTE del polling — si llega a 0 simplemente espera el próximo fetch
  useEffect(() => {
    if (!countdown || countdown <= 0) return;
    const tick = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [countdown]);

  // Formatea segundos como "1h 23m 45s"
  const formatCountdown = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Simula perder una vida (como si el alumno fallara un quiz)
  const handleLoseLife = async () => {
    setMessage(null);
    try {
      const res = await axiosInstance.post('users/lives/decrease/');
      setLivesData(res.data);
      setCountdown(res.data.seconds_until_next_life);
      setMessage({ type: 'error', text: res.data.detail });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Error inesperado.' });
    }
  };

  // Simula ganar un minijuego (won=true) o perderlo (won=false)
  // Recibe el id del minijuego directamente para evitar el estado desactualizado
  const handleMinigame = useCallback(async (minigameId, won) => {
    // Actualización optimista
    if (won) {
      setLivesData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lives: Math.min(prev.max_lives, prev.lives + 1)
        };
      });
      // Avisamos a toda la app para que el Simulador se desbloquee sin esperas
      window.dispatchEvent(new CustomEvent('planetaRecuperado'));
    } else {
      setLivesData(prev => ({
        ...prev,
        minigames_cooldowns: {
          ...(prev?.minigames_cooldowns || {}),
          [minigameId]: MINIGAME_COOLDOWN_SECONDS
        }
      }));
    }

    try {
      const res = await axiosInstance.post('users/minigames/play/', {
        minigame_id: minigameId,
        won,
      });
      // Sincronización PROFUNDA con la respuesta del servidor
      setLivesData(res.data);
      setCountdown(res.data.seconds_until_next_life);
      
      if (won) setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      await fetchLives();
    }
  }, [axiosInstance, fetchLives]);

  // Llamado por el componente de minijuego cuando termina (won = true/false)
  const handleMinigameFinish = useCallback((minigameId, won, shouldClose = true) => {
    // Primero lanzamos la actualización (optimista e interna)
    handleMinigame(minigameId, won);
    // Solo cerramos si se nos indica explícitamente
    if (shouldClose) {
      setActiveMinigame(null);
    }
  }, [handleMinigame]);

  if (loading || !livesData) {
    return (
      <div className="flex items-center justify-center p-4 text-slate-400 text-sm">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Cargando planetas...
      </div>
    );
  }

  const { lives, max_lives, can_play_minigame, minigames_cooldowns = {} } = livesData;

  return (
    <>
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 space-y-4">

      {/* ── MARCADOR DE PLANETAS ── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Planetas</span>
        <div className="flex gap-2">
          {Array.from({ length: max_lives }).map((_, i) => (
            <span
              key={i}
              className={`text-xl transition-all duration-300 ${
                i < lives ? 'opacity-100 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'opacity-20 grayscale'
              }`}
            >
              🪐
            </span>
          ))}
        </div>
      </div>

      {/* ── CUENTA ATRÁS DE REGENERACIÓN ── */}
      {lives < max_lives && countdown !== null && (
        <p className="text-xs text-slate-400 text-center">
          Próximo planeta en:{' '}
          <span className="text-cyan-400 font-bold">{formatCountdown(countdown)}</span>
        </p>
      )}

      {/* ── PANEL DE MINIJUEGOS (solo Plan 3 con 0 vidas) ── */}
      {can_play_minigame ? (
        <div className="border-t border-slate-700 pt-3 text-center">
          <p className="text-xs text-amber-400 font-bold mb-3 flex items-center justify-center gap-1">
            <ShieldAlert className="w-4 h-4" /> ¡Game Over! 
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full btn btn-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-none text-white rounded-xl font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
          >
            🕹️ Minijuegos de Rescate
          </button>
        </div>
      ) : lives === 0 ? (
        // Plan 1 o 2: sin acceso a minijuegos aunque tenga 0 vidas
        <div className="border-t border-slate-700 pt-3 text-center">
          <p className="text-xs text-slate-500">
            🔒 Los minijuegos de rescate son exclusivos del
            <span className="text-pink-400 font-bold"> Plan Agujero de Gusano</span>.
          </p>
        </div>
      ) : null}

    </div>

      {/* ── MODAL DE CATÁLOGO DE MINIJUEGOS ── */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-5xl shadow-[0_0_50px_rgba(245,158,11,0.15)] relative animate-[scale-up_0.2s_ease-out]">
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
              <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6" /> Minijuegos de Rescate
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-slate-300 mb-6 text-sm">
              Selecciona un minijuego. Si ganas, recuperarás 1 planeta. Cada minijuego tiene un tiempo de reutilización después de usarlo. ¡Elige sabiamente!
            </p>

            {/* Grid del Catálogo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {MINIGAMES.map(mg => {
                const cooldown = minigames_cooldowns[mg.id] || 0;
                const isOnCooldown = cooldown > 0;
                
                return (
                  <div key={mg.id} className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${isOnCooldown ? 'bg-slate-900 border-slate-800 opacity-60 grayscale' : 'bg-slate-800/80 border-slate-600 hover:border-amber-500/50'}`}>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{mg.label}</h3>
                      {isOnCooldown ? (
                        <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Reutilizable en: {formatCountdown(cooldown)}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">{mg.desc}</p>
                      )}
                    </div>
                    
                    {/* Botones de simulación por cada juego */}
                    <div className="mt-auto">
                      <button
                        disabled={isOnCooldown}
                        onClick={() => {
                          setIsModalOpen(false);
                          setActiveMinigame(mg.id);
                        }}
                        className={`w-full btn btn-xs border-none text-white rounded-lg transition-all flex items-center justify-center gap-1 ${isOnCooldown ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'}`}
                      >
                        {!isOnCooldown && <Play className="w-3 h-3" />} Jugar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>,
        document.body
      )}
      {/* ── MINIJUEGOS INDIVIDUALES (MODALES) ── */}
      {activeMinigame === 'pairs' && (
        <MinijuegoParejas 
          key="game-pairs"
          onClose={() => handleMinigameFinish('pairs', false, true)} 
          onFinish={(won, shouldClose = true) => handleMinigameFinish('pairs', won, shouldClose)} 
        />
      )}
      {activeMinigame === 'arcade' && (
        <MinijuegoCalculo 
          key="game-arcade"
          onClose={() => handleMinigameFinish('arcade', false, true)} 
          onFinish={(won, shouldClose = true) => handleMinigameFinish('arcade', won, shouldClose)} 
        />
      )}
      {activeMinigame === 'wordsearch' && (
        <MinijuegoSopaLetras 
          key="game-wordsearch"
          onClose={() => handleMinigameFinish('wordsearch', false, true)} 
          onFinish={(won, shouldClose = true) => handleMinigameFinish('wordsearch', won, shouldClose)} 
        />
      )}
      {activeMinigame === 'fill_word' && (
        <MinijuegoCompletar 
          key="game-fill_word"
          onClose={() => handleMinigameFinish('fill_word', false, true)} 
          onFinish={(won, shouldClose = true) => handleMinigameFinish('fill_word', won, shouldClose)} 
        />
      )}
      {activeMinigame === 'true_false' && (
        <MinijuegoVerdaderoFalso 
          key="game-true_false"
          onClose={() => handleMinigameFinish('true_false', false, true)} 
          onFinish={(won, shouldClose = true) => handleMinigameFinish('true_false', won, shouldClose)} 
        />
      )}
    </>
  );
}
