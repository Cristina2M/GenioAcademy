import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        {/* Usamos el Navbar de forma global para toda la app */}
        <Navbar />
        
        {/* Contenido principal inyectado por el enrutador */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mt-4">Página no encontrada o en construcción</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;