import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Mission from './pages/Mission';
import spaceBg from './assets/img/logo-fondo.jpg';

function App() {
  return (
    <Router>
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

        {/* Añadimos div para asegurar que el contenido se posiciona sobre el overlay */}
        <div className="relative z-10 flex flex-col flex-grow">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <h1 className="text-5xl font-bold text-pink-500">404</h1>
                  <p className="mt-4 text-xl text-slate-300">Explorador, te has perdido en la nebulosa.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;