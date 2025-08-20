// components/roulette/prize-modal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Gift, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Prize {
  id?: string;
  type?: string;
  isReal?: boolean;
  prize?: {
    name: string;
    description?: string;
    prize_type?: string;
    type?: string;
    prize_value?: number;
    value?: number;
  };
  message?: string;
}

interface PrizeModalProps {
  open: boolean;
  onClose: () => void;
  prize?: Prize | null;
}

export function PrizeModal({ open, onClose, prize }: PrizeModalProps) {
  const isDemo = prize?.type === 'demo' || !prize?.isReal;
  const prizeValue = prize?.prize?.prize_value || prize?.prize?.value || 0;
  
  // Efecto de confetti cuando se abre el modal con premio valioso
  React.useEffect(() => {
    if (open && prizeValue >= 100) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
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
  }, [open, prizeValue]);

  const getPrizeIcon = () => {
    const prizeType = prize?.prize?.prize_type || prize?.prize?.type;
    switch (prizeType) {
      case 'cash':
        return '💰';
      case 'spin':
        return '🎯';
      case 'bonus':
        return '🎁';
      case 'points':
        return '⭐';
      default:
        return '🎉';
    }
  };

  const getPrizeColor = () => {
    if (prizeValue >= 500) return 'from-yellow-400 to-orange-500';
    if (prizeValue >= 100) return 'from-purple-400 to-pink-500';
    if (prizeValue >= 50) return 'from-blue-400 to-cyan-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isDemo ? '🎮 Premio Demo' : '🎉 ¡Felicitaciones!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isDemo 
              ? 'Has ganado un premio de demostración'
              : 'Has ganado un premio real'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Premio principal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center py-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.5,
                repeat: 3
              }}
              className="text-8xl mb-4"
            >
              {getPrizeIcon()}
            </motion.div>
            
            <h3 className={`text-3xl font-black mb-2 bg-gradient-to-r ${getPrizeColor()} bg-clip-text text-transparent`}>
              {prize?.prize?.name || 'Premio'}
            </h3>
            
            {prizeValue > 0 && (
              <motion.p 
                className="text-4xl font-bold text-gray-800 dark:text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                S/ {prizeValue}
              </motion.p>
            )}
            
            {prize?.prize?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {prize.prize.description}
              </p>
            )}
          </motion.div>

          {/* Estado del premio */}
          {isDemo ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                    Este es un premio de demostración
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Los premios demo no son reales. Valídate para ganar premios de verdad y reclamar tus ganancias.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    ¡Premio Real Confirmado!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Este premio ha sido agregado a tu cuenta. Puedes reclamarlo en cualquier momento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje personalizado */}
          {prize?.message && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
              "{prize.message}"
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            {isDemo && (
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => {
                  // Aquí podrías redirigir a la página de validación
                  onClose();
                }}
              >
                Validarme Ahora
              </Button>
            )}
            <Button
              variant={isDemo ? "outline" : "default"}
              className="flex-1"
              onClick={onClose}
            >
              {isDemo ? 'Cerrar' : '¡Genial!'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}