import { Link } from 'react-router-dom';
import { BookOpen, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-12 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          {/* Añadimos un icono representativo de Genio Academy */}
          <BookOpen className="text-primary" />
          <span className="font-bold text-2xl tracking-tight">Genio Academy</span>
        </Link>
      </div>
      
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium text-base">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/courses">Catálogo de Cursos</Link></li>
          <li><a>Sobre Nosotros</a></li>
        </ul>
      </div>

      <div className="flex-none ml-4">
        <Link to="/login" className="btn btn-primary btn-outline mr-2 hidden sm:flex">
          Iniciar Sesión
        </Link>
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/courses">Catálogo</Link></li>
            <li><Link to="/login">Entrar</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
