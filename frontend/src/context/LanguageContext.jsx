// ============================================================
// ARCHIVO: LanguageContext.jsx
// FUNCIÓN: Contexto global de idioma (Español / Inglés).
//
// Permite que cualquier página o componente sepa en qué idioma
// debe mostrar sus textos y cambie entre ES <-> EN con un clic.
// Solo se usa en las páginas públicas (Home, Claustro, Misión)
// ya que la app para alumnos está completamente en español.
// ============================================================

import React, { createContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // 'es' o 'en'

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
