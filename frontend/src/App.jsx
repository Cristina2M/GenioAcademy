import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Mission from './pages/Mission';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import Claustro from './pages/Claustro';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import spaceBg from './assets/img/logo-fondo.jpg';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';

// ==========================================
// COMPONENTE PRINCIPAL: App.jsx
// ==========================================
// Este archivo actúa como el "esqueleto" o contenedor base de toda la aplicación.
// Aquí configuramos el enrutador (Router) que decide qué página mostrar en base a la URL.

function App() {
  return (
    // <Router> envuelve todo para habilitar la navegación sin recargar la página entera
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div 
        className="flex flex-col min-h-screen text-slate-100 relative overflow-hidden"
        style={{ 
          backgroundImage: `url(${spaceBg})`, 
          backgroundSize: 'cover', 
          backgroundAttachment: 'fixed', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Overlay oscuro estelar para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-slate-950/80 z-0"></div>

        {/* Añadimos un contenedor relativo (relative z-10) para asegurar que el contenido 
            se posiciona físicamente "encima" del overlay oscuro y no quede tapado */}
        <div className="relative z-10 flex flex-col flex-grow">
          
          {/* El Navbar va fuera de las rutas porque queremos que se renderice en TODAS las páginas */}
          <Navbar />
          
          {/* main actúa como el contenedor principal del contenido cambiante */}
          <main className="flex-grow">
            
            {/* <Routes> es como un "Switch". Busca la primera <Route> que coincida con la URL actual */}
            <Routes>
              {/* Ruta Base o Inicio: Si la URL es la raíz ("/"), carga el componente <Home /> */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas Privadas y de Usuario (Protegidas por PrivateRoute) */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/player/:courseId" element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
              <Route path="/claustro" element={<Claustro />} />
              
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <h1 className="text-5xl font-bold text-pink-500">404</h1>
                  <p className="mt-4 text-xl text-slate-300">Explorador, te has perdido en la nebulosa.</p>
                </div>
              } />
            </Routes>
          </main>
          
          {/* Botón Flotante Global para volver arriba */}
          <ScrollToTopButton />
        </div>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;