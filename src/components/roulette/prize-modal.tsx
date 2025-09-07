// components/roulette/prize-modal.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Gift, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Prize {
  name: string;
  type: string;
  value: number;
  color: string;
  position: number;
}

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: Prize | null;
  spinType: string;
}

export function PrizeModal({ isOpen, onClose, prize, spinType }: PrizeModalProps) {
  const isWinner = prize && prize.value > 0;
  const isDemo = spinType === 'demo';

  useEffect(() => {
    if (isOpen && isWinner && !isDemo) {
      // Lanzar confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, isWinner, isDemo]);

  const handleShare = () => {
    if (navigator.share && prize) {
      navigator.share({
        title: '¡Gané en Inkas Poker!',
        text: `¡Acabo de ganar ${prize.name} en la ruleta de Inkas Poker! 🎰`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && prize && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Header */}
            <div className={`relative p-8 text-center ${
              isWinner 
                ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' 
                : 'bg-gradient-to-br from-gray-600 to-gray-700'
            }`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-4"
              >
                {isWinner ? (
                  <Trophy className="w-16 h-16 text-white mx-auto" />
                ) : (
                  <Gift className="w-16 h-16 text-white mx-auto" />
                )}
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {isWinner ? '¡FELICIDADES!' : '¡Sigue Intentando!'}
              </motion.h2>
              
              {isDemo && (
                <span className="inline-block px-3 py-1 bg-black/30 rounded-full text-white text-sm font-medium">
                  GIRO DE DEMOSTRACIÓN
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {prize.name}
                </h3>
                
                {isWinner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-4xl font-bold text-yellow-400"
                  >
                    ${prize.value}
                  </motion.div>
                )}
              </div>

              <div className="text-gray-300 text-center mb-6">
                {isDemo ? (
                  <p>
                    Este es un giro de demostración. 
                    ¡Juega para obtener tu giro real con premios de verdad!
                  </p>
                ) : isWinner ? (
                  <>
                    <p className="mb-2">
                      Has ganado <strong className="text-yellow-400">${prize.value}</strong> en bonificación.
                    </p>
                    <p className="text-sm text-gray-400">
                      El bonus ha sido agregado a tu cuenta y estará disponible para usar.
                    </p>
                  </>
                ) : (
                  <p>
                    No ganaste esta vez, pero no te desanimes.
                    ¡Obtén más giros con nuestros códigos promocionales!
                  </p>
                )}
              </div>

              {!isDemo && isWinner && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-semibold mb-2">Términos del Bonus:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Válido por 7 días desde hoy</li>
                    <li>• Aplica a todos los juegos</li>
                    <li>• Consulta términos y condiciones</li>
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {isWinner && !isDemo ? '¡Genial!' : 'Cerrar'}
                </button>
                
                {isWinner && !isDemo && (
                  <button
                    onClick={handleShare}
                    className="py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}