import { Link } from 'react-router-dom';
import logoPrincipal from '../assets/img/logo.png';

export default function Navbar() {
  return (
    <div className="navbar bg-slate-900/50 backdrop-blur-md shadow-lg border-b border-white/5 px-4 lg:px-12 sticky top-0 z-50 transition-all duration-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost hover:bg-white/5 h-auto py-2 flex items-center gap-3">
          {/* Logo oficial */}
          <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <img src={logoPrincipal} alt="Genio Academy" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">Genio Academy</span>
        </Link>
      </div>
      
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-slate-200">
          <li><Link className="hover:text-pink-400 hover:bg-white/5 transition-colors" to="/">Inicio</Link></li>
          <li><Link className="hover:text-cyan-400 hover:bg-white/5 transition-colors" to="/courses">Catálogo Estelar</Link></li>
          <li><Link className="hover:text-purple-400 hover:bg-white/5 transition-colors" to="/mission">La Misión</Link></li>
        </ul>
      </div>

      <div className="flex-none ml-4">
        <Link to="/login" className="btn bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all mr-2 hidden sm:flex rounded-full px-6">
          Iniciar Sesión
        </Link>
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-slate-900 border border-white/10 rounded-box z-10 mt-3 w-52 p-2 shadow-2xl">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/courses">Catálogo Estelar</Link></li>
            <li><Link to="/mission">La Misión</Link></li>
            <li><Link to="/login" className="text-cyan-400">Entrar</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
