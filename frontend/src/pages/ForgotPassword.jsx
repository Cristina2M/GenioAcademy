// ============================================================
// PÁGINA: ForgotPassword.jsx  (/forgot-password)
// FUNCIÓN: El alumno introduce su email para recibir el enlace de reset.
// En local, el "email" aparece en la consola del servidor Django.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import axiosInstance from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('users/forgot-password/', { email });
      setEnviado(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Error al procesar la solicitud. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      {/* Luces decorativas */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            ¿Olvidaste tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">contraseña?</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Introduce tu email y te enviaremos un enlace para recuperarla.
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.4)]">

          {/* Estado: formulario enviado con éxito */}
          {enviado ? (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">¡Enlace enviado!</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Si existe una cuenta con ese email, recibirás el enlace en breve.<br/>
                <span className="text-cyan-400 font-semibold">En modo local, el email aparece en la consola del servidor Django.</span>
              </p>
              <Link to="/login" className="btn btn-block bg-gradient-to-r from-cyan-500 to-purple-600 border-none text-white font-bold rounded-2xl">
                Volver al Login
              </Link>
            </div>
          ) : (
            /* Estado: formulario normal */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email de tu cuenta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email-input"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input w-full pl-11 bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn btn-block bg-gradient-to-r from-cyan-500 to-purple-600 border-none text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 h-12"
              >
                {loading
                  ? <span className="loading loading-spinner loading-sm" />
                  : <><Send className="w-4 h-4" /> Enviar enlace de recuperación</>
                }
              </button>
            </form>
          )}

          {/* Volver al login */}
          {!enviado && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-slate-400 hover:text-cyan-400 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver al login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
