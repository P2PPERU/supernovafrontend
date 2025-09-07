// components/roulette/roulette-header.tsx
'use client';

import { useState } from 'react';
import { Info, Gift, HelpCircle } from 'lucide-react';

export function RouletteHeader() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="text-center text-white mb-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
        Ruleta de Premios
      </h1>
      <p className="text-xl text-gray-300 mb-4">
        Gira y gana increíbles premios cada día
      </p>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700/50 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Info className="w-5 h-5" />
          Cómo funciona
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-700/50 hover:bg-purple-700 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
          Ayuda
        </button>
      </div>

      {showInfo && (
        <div className="mt-6 bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 max-w-2xl mx-auto text-left">
          <h3 className="text-lg font-semibold mb-4">¿Cómo funciona la ruleta?</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Todos los usuarios nuevos reciben un giro de demostración gratis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Después del giro demo, debes validar tu cuenta para obtener el giro real</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Puedes ganar giros adicionales con códigos promocionales</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Los premios incluyen bonos en efectivo, giros extra y premios especiales</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}