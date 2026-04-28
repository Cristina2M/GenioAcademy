// ============================================================
// PÁGINA: ResetPassword.jsx  (/reset-password/:uid/:token)
// FUNCIÓN: El alumno introduce su nueva contraseña después de
//          hacer clic en el enlace del email de recuperación.
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import axiosInstance from '../api/axios';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('users/reset-password/', { uid, token, password });
      setExito(true);
      // Redirigimos al login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'El enlace no es válido o ha expirado. Solicita uno nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Indicador de fuerza de contraseña
  const fuerzaPass = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { nivel: 1, texto: 'Muy corta', color: 'bg-red-500' };
    if (password.length < 12) return { nivel: 2, texto: 'Aceptable', color: 'bg-amber-500' };
    return { nivel: 3, texto: 'Segura', color: 'bg-green-500' };
  };
  const fuerza = fuerzaPass();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Luces decorativas */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <KeyRound className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Nueva <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">contraseña</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Elige una contraseña segura para tu cuenta.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.4)]">

          {/* Estado: cambio exitoso */}
          {exito ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
              <p className="text-slate-400 text-sm mb-2">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <p className="text-xs text-slate-500">Redirigiendo al login en 3 segundos...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Campo: nueva contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="new-password-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input w-full pl-11 pr-12 bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:border-purple-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Barra de fuerza de contraseña */}
                {fuerza && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className={`flex-1 rounded-full transition-all ${n <= fuerza.nivel ? fuerza.color : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${fuerza.nivel === 1 ? 'text-red-400' : fuerza.nivel === 2 ? 'text-amber-400' : 'text-green-400'}`}>
                      {fuerza.texto}
                    </p>
                  </div>
                )}
              </div>

              {/* Campo: confirmar contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="confirm-password-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className={`input w-full pl-11 bg-slate-800/50 border text-white placeholder-slate-500 rounded-2xl focus:outline-none transition-all ${
                      confirm && password !== confirm
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-purple-500'
                    }`}
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Las contraseñas no coinciden
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="btn btn-block bg-gradient-to-r from-purple-500 to-pink-600 border-none text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 h-12"
              >
                {loading
                  ? <span className="loading loading-spinner loading-sm" />
                  : 'Guardar nueva contraseña'
                }
              </button>

              <div className="text-center">
                <Link to="/login" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                  Volver al login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
