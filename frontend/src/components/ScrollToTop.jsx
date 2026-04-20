import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar la ruta de React, sube automáticamente el foco visual arriba del todo
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
