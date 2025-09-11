'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { RouletteGame } from '@/components/roulette/rouletteGame';
import { RouletteHeader } from '@/components/roulette/roulette-header';
import { RouletteHistory } from '@/components/roulette/roulette-history';

// export const metadata: Metadata = {
//   title: 'Ruleta de Premios | Supernova Poker',
//   description: 'Gira la ruleta y gana increíbles premios y bonificaciones',
// };

export default function RoulettePage() {
  const [currentCard, setCurrentCard] = useState(0);
  
  // Array de símbolos de cartas
  const cards = ['♠', '♥', '♣', '♦'];
  
  // Efecto para rotar los símbolos de cartas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923] relative overflow-hidden">
      {/* Elementos de fondo animados - SÍMBOLOS DE CARTAS MONOCROMÁTICOS RESPONSIVE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Carta superior izquierda - responsive */}
        <div className="absolute top-6 md:top-10 left-[5%] text-[60px] md:text-[80px] lg:text-[120px] opacity-10 text-gray-400 floating">
          {cards[currentCard]}
        </div>
        
        {/* Carta inferior derecha - responsive */}
        <div className="absolute bottom-8 md:bottom-16 right-[10%] text-[50px] md:text-[70px] lg:text-[100px] opacity-10 text-gray-400 floating" style={{ animationDelay: '1s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        
        {/* Carta centro izquierda - responsive */}
        <div className="absolute top-1/2 left-[15%] text-[45px] md:text-[60px] lg:text-[90px] opacity-10 text-gray-400 floating" style={{ animationDelay: '2s' }}>
          {cards[(currentCard + 2) % cards.length]}
        </div>
        
        {/* Carta centro derecha - responsive */}
        <div className="absolute top-1/3 right-[20%] text-[55px] md:text-[80px] lg:text-[110px] opacity-10 text-gray-400 floating" style={{ animationDelay: '3s' }}>
          {cards[(currentCard + 3) % cards.length]}
        </div>
        
        {/* Cartas adicionales para más densidad - responsive */}
        <div className="absolute top-[70%] left-[40%] text-[40px] md:text-[60px] lg:text-[80px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '1.5s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        
        <div className="absolute top-[20%] right-[35%] text-[50px] md:text-[70px] lg:text-[95px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '2.5s' }}>
          {cards[(currentCard + 2) % cards.length]}
        </div>

        {/* Cartas para la sección inferior - responsive */}
        <div className="absolute top-[80%] right-[15%] text-[80px] md:text-[120px] lg:text-[160px] opacity-[0.05] text-gray-500 rotating-slow">
          {cards[(currentCard + 3) % cards.length]}
        </div>
        <div className="absolute bottom-[5%] left-[25%] text-[70px] md:text-[100px] lg:text-[140px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '2s' }}>
          {cards[currentCard]}
        </div>
        <div className="absolute top-[60%] right-[45%] text-[60px] md:text-[90px] lg:text-[120px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '4s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
      </div>

      {/* Gradiente overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-blue-900/5" />
      
      {/* Contenido principal responsive */}
      <div className="relative z-10">
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
          <RouletteHeader />
          
          {/* Grid layout responsive - en móvil se apila verticalmente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8">
            {/* Componente principal de la ruleta */}
            <div className="lg:col-span-2 order-1">
              <RouletteGame />
            </div>
            
            {/* Historial - en móvil va abajo, en desktop a la derecha */}
            <div className="lg:col-span-1 order-2">
              <RouletteHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        .floating {
          animation: floating 6s ease-in-out infinite;
        }
        
        .rotating-slow {
          animation: rotating-slow 20s linear infinite;
        }
        
        @keyframes floating {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-10px) rotate(2deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-10px) rotate(-2deg); 
          }
        }
        
        @keyframes rotating-slow {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }

        /* Scrollbar personalizado para móviles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }

        /* Mejor espaciado en móviles */
        @media (max-width: 768px) {
          .floating {
            animation-duration: 8s;
          }
          
          .rotating-slow {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  );
}