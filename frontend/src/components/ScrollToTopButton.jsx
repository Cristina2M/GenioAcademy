// ============================================================
// ARCHIVO: ScrollToTopButton.jsx
// FUNCIÓN: Botón flotante para volver al inicio de la página.
//
// Este botón aparece en la esquina inferior derecha de TODAS las páginas
// (está en App.jsx). Se hace visible automáticamente cuando el usuario
// ha bajado más de 300 píxeles desde la parte superior de la página.
//
// Al pulsarlo, hace un scroll suave hacia el principio de la página.
// ============================================================

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
    // Estado: controla si el botón debe mostrarse o estar oculto
    const [estaVisible, setEstaVisible] = useState(false);

    // Función que decide si el botón debe aparecer o desaparecer
    // Se llama cada vez que el usuario hace scroll
    const actualizarVisibilidad = () => {
        if (window.scrollY > 300) {
            // El usuario bajó más de 300px → mostramos el botón
            setEstaVisible(true);
        } else {
            // El usuario está cerca del top → ocultamos el botón
            setEstaVisible(false);
        }
    };

    // Función que hace el scroll animado hacia el principio
    const volverArriba = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Movimiento suave en lugar de salto brusco
        });
    };

    // Registramos el listener de scroll al montar el componente
    // y lo eliminamos cuando se desmonta (limpieza para evitar fugas de memoria)
    useEffect(() => {
        window.addEventListener('scroll', actualizarVisibilidad);
        return () => window.removeEventListener('scroll', actualizarVisibilidad);
    }, []); // El array vacío [] significa que solo se ejecuta una vez al montar

    return (
        <>
            {/* Botón flotante: cambia de opacidad y posición según estaVisible */}
            <button
                onClick={volverArriba}
                className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full bg-slate-900 border border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md transition-all duration-500 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] ${
                    estaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
                title="Volver Arriba"
            >
                <ChevronUp className="w-6 h-6" />
            </button>
        </>
    );
}
