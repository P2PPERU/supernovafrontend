'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Trophy, 
  Gift, 
  Star,
  Coins,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

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
  prize: Prize | null;
}

export function PrizeModal({ open, onClose, prize }: PrizeModalProps) {
  // Efecto de confetti al abrir
  useEffect(() => {
    if (open && prize?.isReal) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
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
  }, [open, prize?.isReal]);

  if (!prize) return null;

  const getPrizeIcon = () => {
    const type = prize.prize?.prize_type || prize.prize?.type;
    switch (type) {
      case 'cash':
        return <Coins className="h-16 w-16 text-poker-gold" />;
      case 'bonus':
        return <Gift className="h-16 w-16 text-purple-500" />;
      case 'points':
        return <Star className="h-16 w-16 text-blue-500" />;
      case 'spin':
        return <Zap className="h-16 w-16 text-poker-green" />;
      default:
        return <Trophy className="h-16 w-16 text-poker-gold" />;
    }
  };

  const getPrizeColor = () => {
    if (!prize.isReal) return 'from-gray-500 to-gray-600';
    
    const value = prize.prize?.prize_value || prize.prize?.value || 0;
    if (value >= 100) return 'from-poker-gold to-yellow-600';
    if (value >= 50) return 'from-purple-500 to-purple-600';
    return 'from-poker-green to-poker-darkGreen';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className={`bg-gradient-to-br ${getPrizeColor()} p-6 text-white`}>
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Contenido */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="flex justify-center mb-4"
            >
              {getPrizeIcon()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2">
                {prize.isReal ? '¡Felicidades!' : '¡Giro Demo!'}
              </h2>
              
              <div className="mb-4">
                <p className="text-3xl font-bold mb-1">
                  {prize.prize?.name}
                </p>
                {prize.prize?.description && (
                  <p className="text-sm opacity-90">
                    {prize.prize.description}
                  </p>
                )}
              </div>

              {!prize.isReal && (
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    Este fue un giro de demostración.
                    ¡Completa tu validación para obtener premios reales!
                  </p>
                </div>
              )}

              {prize.message && (
                <p className="text-sm opacity-90 mb-4">
                  {prize.message}
                </p>
              )}
            </motion.div>

            {/* Estrellas decorativas */}
            <div className="absolute -top-4 -left-4">
              <Sparkles className="h-8 w-8 opacity-50" />
            </div>
            <div className="absolute -top-4 -right-4">
              <Star className="h-8 w-8 opacity-50" />
            </div>
            <div className="absolute -bottom-4 -left-4">
              <Star className="h-8 w-8 opacity-50" />
            </div>
            <div className="absolute -bottom-4 -right-4">
              <Sparkles className="h-8 w-8 opacity-50" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-background">
          <Button onClick={onClose} className="w-full">
            {prize.isReal ? '¡Genial!' : 'Entendido'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}