import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import logoPrincipal from '../assets/img/logo.png';
import { getStudentAvatar } from '../utils/avatarUtils';
import axiosInstance from '../api/axios';

// ==========================================
// COMPONENTE UI: Barra de Navegación (Navbar.jsx)
// ==========================================
// Este componente se muestra en todas las páginas. Maneja la navegación y
// el menú adaptativo (hamburguesa) para pantallas de móviles.

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);

  // Número de respuestas del profesor que el alumno aún no ha leído
  const [unreadCount, setUnreadCount] = useState(0);

  // Consultamos el conteo de notificaciones sin leer al montar el componente.
  // Solo para alumnos con Plan 3 (los únicos que pueden tener tutorías).
  useEffect(() => {
    if (!user || user.is_teacher || user.subscription_level < 3) return;

    const fetchUnread = async () => {
      try {
        const res = await axiosInstance.get('teachers/consultations/unread_count/');
        setUnreadCount(res.data.unread || 0);
      } catch {
        // Si falla, ignoramos silenciosamente (no es crítico)
      }
    };

    fetchUnread();
    // Polling cada 60 segundos para detectar nuevas respuestas del profesor
    const intervalo = setInterval(fetchUnread, 60000);
    return () => clearInterval(intervalo);
  }, [user]);

  return (
    <div className="navbar bg-slate-900/50 backdrop-blur-md shadow-lg border-b border-white/5 px-4 lg:px-8 sticky top-0 z-50 transition-all duration-300 min-h-[4.5rem]">
      <div className="flex-1 flex items-center">
        {/* Logo sobresaliente */}
        <Link to={user ? (user.is_teacher ? "/teacher-dashboard" : "/dashboard") : "/"} className="group relative z-[100] w-24 h-24 md:w-36 md:h-36 -mb-12 md:-mb-16 -ml-2 mr-2">
          <div className="w-full h-full bg-slate-950 rounded-full border-2 border-cyan-500/40 p-2 shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:border-pink-500/40 transition-all duration-300 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500/10 to-cyan-500/10 flex items-center justify-center p-1">
              <img src={logoPrincipal} alt="Genio Academy Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
        </Link>

        <Link to={user ? (user.is_teacher ? "/teacher-dashboard" : "/dashboard") : "/"} className="btn btn-ghost hover:bg-transparent h-auto py-2 px-2 hidden sm:flex">
          <span className="font-extrabold text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Genio</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">Academy</span>
          </span>
        </Link>
      </div>

      {/* Links de navegación desktop */}
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-slate-200">
          {!user && (
            <>
              <li><Link className="hover:text-pink-400 hover:bg-white/5 transition-colors" to="/">Inicio</Link></li>
              <li><Link className="hover:text-cyan-400 hover:bg-white/5 transition-colors" to="/courses">Catálogo Estelar</Link></li>
              <li><Link className="hover:text-purple-400 hover:bg-white/5 transition-colors" to="/mission">La Misión</Link></li>
              <li><Link className="hover:text-teal-400 hover:bg-white/5 transition-colors" to="/claustro">Claustro</Link></li>
            </>
          )}
          {user && (
            <li><Link className="hover:text-cyan-400 hover:bg-white/5 transition-colors" to="/courses">Cursos</Link></li>
          )}
        </ul>
      </div>

      {/* Zona derecha: badge + avatar + menú */}
      <div className="flex-none ml-4 flex items-center gap-1 sm:gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            {/* Nombre y nivel del usuario */}
            <div className="hidden sm:flex text-right mr-2 flex-col justify-center">
              <span className="text-sm font-bold text-white leading-tight">
                {user.is_teacher ? 'Maestro' : 'Agente'} {user.username || ''}
              </span>
              {!user.is_teacher && (
                <span className="text-xs text-cyan-400 font-semibold tracking-wide">
                  Nivel de Rango {user.current_student_level || 1}
                </span>
              )}
            </div>

            {/* Badge de notificaciones — solo para alumnos Plan 3 con respuestas sin leer */}
            {!user.is_teacher && user.subscription_level >= 3 && unreadCount > 0 && (
              <Link
                to="/dashboard/claustro"
                className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-all group"
                title={`${unreadCount} respuesta${unreadCount > 1 ? 's' : ''} sin leer`}
              >
                <Bell className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50 animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </Link>
            )}

            {/* Menú Desplegable del Avatar */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-cyan-500 p-[2px] hidden sm:flex cursor-pointer hover:scale-105 transition-transform hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={user.is_teacher ? user.professor_image : getStudentAvatar(user.selected_avatar || user.current_student_level)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl w-52 mt-4 space-y-1 hidden sm:flex">
                <li>
                  <Link to={user.is_teacher ? "/teacher-dashboard" : "/dashboard"} className="text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all font-semibold">
                    <UserIcon className="w-4 h-4 text-cyan-400" /> Mi Panel Base
                  </Link>
                </li>
                <div className="h-[1px] bg-white/10 my-1 w-full" />
                <li>
                  <button onClick={logoutUser} className="text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all font-semibold tracking-wide">
                    <LogOut className="w-4 h-4" /> Eyectar Nave
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 hidden sm:flex rounded-full px-4 transition-all">
              Entrar
            </Link>
            <Link to="/register" className="btn bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white hover:from-pink-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hidden sm:flex rounded-full px-6">
              Nueva Cuenta
            </Link>
          </>
        )}

        {/* Menú hamburguesa para móvil */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-slate-900 border border-white/10 rounded-box z-10 mt-3 w-52 p-2 shadow-2xl"
            onClick={() => { const elem = document.activeElement; if (elem) elem.blur(); }}
          >
            {!user ? (
              <>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/courses">Catálogo Estelar</Link></li>
                <li><Link to="/mission">La Misión</Link></li>
                <li><Link to="/claustro">Claustro</Link></li>
              </>
            ) : (
              <li><Link to="/courses" className="text-white font-bold">Cursos</Link></li>
            )}
            {user ? (
              <>
                <li>
                  <Link to={user.is_teacher ? "/teacher-dashboard" : "/dashboard"} className="text-cyan-400 font-bold border border-cyan-500/30 rounded-lg my-1">
                    Mi Panel Base
                  </Link>
                </li>
                {/* Badge móvil de notificaciones */}
                {!user.is_teacher && user.subscription_level >= 3 && unreadCount > 0 && (
                  <li>
                    <Link to="/dashboard/claustro" className="text-pink-400 font-bold border border-pink-500/30 rounded-lg my-1 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      {unreadCount} respuesta{unreadCount > 1 ? 's' : ''} nueva{unreadCount > 1 ? 's' : ''}
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={logoutUser} className="text-red-400 hover:bg-red-500/20 rounded-lg">
                    Desconectar nave
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-cyan-400">Entrar</Link></li>
                <li><Link to="/register" className="text-pink-400 font-bold">Unirse a la Academia</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
