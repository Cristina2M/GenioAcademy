import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Función para determinar si el botón debe aparecer
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función para hacer scroll animado hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full bg-slate-900 border border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md transition-all duration-500 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        title="Volver Arriba"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </>
  );
}
