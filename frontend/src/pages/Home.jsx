import { ArrowRight, GraduationCap, Map, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero pt-20 pb-32 bg-gradient-to-br from-primary/10 to-base-200">
        <div className="hero-content text-center max-w-4xl">
          <div>
            <span className="badge badge-accent mb-4 font-bold p-3">ESO - Educación Secundaria</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-base-content mb-6">
              Aprende a tu <span className="text-primary">propio ritmo</span> y nivel
            </h1>
            <p className="py-6 text-xl text-base-content/80 max-w-2xl mx-auto">
              Genio Academy revoluciona tu aprendizaje estructurando los cursos por <strong className="text-primary">niveles de conocimiento</strong> específicos, no por edad. Desarrolla tus habilidades con ejercicios interactivos y tutorías personalizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Link to="/courses" className="btn btn-primary btn-lg shadow-lg shadow-primary/30">
                Ver Catálogo de Cursos <ArrowRight className="ml-1 w-5 h-5"/>
              </Link>
              <Link to="/signup" className="btn btn-neutral btn-lg">
                Pruébalo Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Características / Propuesta de valor */}
      <div className="py-24 bg-base-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              Nuestra Metodología
            </h2>
            <p className="mt-4 text-lg text-base-content/70">
              ¿Por qué somos diferentes a tu instituto tradicional?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary">
                  <Map className="w-8 h-8"/>
                </div>
                <h3 className="card-title">Micro-Clases</h3>
                <p className="text-base-content/70">Temario dividido en conocimientos hiper-específicos (ej. Sumas, Derivadas, Sintaxis). Directo al grano.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4 text-secondary">
                  <BrainCircuit className="w-8 h-8"/>
                </div>
                <h3 className="card-title">Asistente de IA</h3>
                <p className="text-base-content/70">Resuelve dudas al instante con nuestro búho inteligente alimentado por la base de conocimientos del temario.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-4 text-accent">
                  <GraduationCap className="w-8 h-8"/>
                </div>
                <h3 className="card-title">Suscripciones Flexibles</h3>
                <p className="text-base-content/70">3 Niveles: Desde acceso básico a autocorregibles, hasta tutorías personalizadas ilimitadas con profesores 1 a 1.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
