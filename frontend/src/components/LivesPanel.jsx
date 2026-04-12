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
import axiosInstance from '../api/axios';
import { Rocket, ShieldAlert, RefreshCw } from 'lucide-react';

// IDs de los 5 minijuegos disponibles
const MINIGAMES = [
  { id: 'pairs',      label: '🎴 Parejas' },
  { id: 'arcade',     label: '⏱️ Cálculo' },
  { id: 'wordsearch', label: '🔤 Sopa letras' },
  { id: 'fill_word',  label: '✍️ Completar' },
  { id: 'true_false', label: '🎯 V o F' },
];

export default function LivesPanel() {
  const [livesData, setLivesData] = useState(null);   // Datos de vidas del servidor
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);        // Mensaje de feedback al alumno
  const [countdown, setCountdown] = useState(null);    // Segundos hasta el próximo planeta
  const [selectedMinigame, setSelectedMinigame] = useState(MINIGAMES[0].id);

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

  // Polling independiente al servidor cada 5 segundos para mantener sincronía
  // Esto garantiza que los planetas se actualicen sin necesidad de recargar
  useEffect(() => {
    const poll = setInterval(() => {
      fetchLives();
    }, 5000);
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
      setMessage({ type: 'error', text: res.data.detail });
      await fetchLives();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Error inesperado.' });
    }
  };

  // Simula ganar un minijuego (si won=true) o perderlo (si won=false)
  const handleMinigame = async (won) => {
    setMessage(null);
    try {
      const res = await axiosInstance.post('users/minigames/play/', {
        minigame_id: selectedMinigame,
        won,
      });
      setMessage({
        type: won ? 'success' : 'warning',
        text: res.data.detail,
      });
      await fetchLives();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Error inesperado.';
      setMessage({ type: 'error', text: detail });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-slate-400 text-sm">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Cargando planetas...
      </div>
    );
  }

  const { lives, max_lives, can_play_minigame } = livesData;

  return (
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

      {/* ── BOTÓN DE SIMULACIÓN "PERDER VIDA" (siempre visible para pruebas) ── */}
      <button
        onClick={handleLoseLife}
        disabled={lives === 0}
        className="w-full btn btn-sm bg-rose-600 hover:bg-rose-500 border-none text-white rounded-xl disabled:bg-slate-700 disabled:text-slate-500 transition-all"
      >
        💥 Simular fallo (−1 planeta)
      </button>

      {/* ── PANEL DE MINIJUEGOS (solo Plan 3 con 0 vidas) ── */}
      {can_play_minigame ? (
        <div className="space-y-3 border-t border-slate-700 pt-3">
          <p className="text-xs text-amber-400 font-bold text-center flex items-center justify-center gap-1">
            <ShieldAlert className="w-4 h-4" /> ¡Game Over! Elige un minijuego de rescate
          </p>

          {/* Selector del minijuego */}
          <select
            value={selectedMinigame}
            onChange={e => setSelectedMinigame(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500"
          >
            {MINIGAMES.map(mg => (
              <option key={mg.id} value={mg.id}>{mg.label}</option>
            ))}
          </select>

          {/* Botones de simulación de resultado */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleMinigame(true)}
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 border-none text-white rounded-xl transition-all"
            >
              ✅ Superado
            </button>
            <button
              onClick={() => handleMinigame(false)}
              className="btn btn-sm bg-slate-700 hover:bg-slate-600 border-none text-white rounded-xl transition-all"
            >
              ❌ Fallado
            </button>
          </div>
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
  );
}
