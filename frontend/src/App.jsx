import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-primary">
        Genio Academy
      </h1>
      <p className="text-lg">Tailwind CSS + DaisyUI instalados correctamente</p>
      <button className="btn btn-primary">¡Funciona!</button>
      
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Cursos disponibles</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">Fase de desarrollo</div>
        </div>
      </div>
    </div>
  )
}

export default App