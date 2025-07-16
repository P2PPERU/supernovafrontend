'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface RouletteWheelProps {
  isSpinning: boolean;
  onSpinComplete: () => void;
  lastPrize?: Prize | null | undefined;
}

// Configuración de premios mejorada
const PRIZES = [
  { id: 1, name: "S/ 100", shortName: "100", color: "#FFD700", probability: 5, value: 100, icon: "💰" },
  { id: 2, name: "Giro Extra", shortName: "SPIN", color: "#4ECDC4", probability: 20, value: 0, icon: "🎯" },
  { id: 3, name: "S/ 50", shortName: "50", color: "#FF6B6B", probability: 10, value: 50, icon: "💵" },
  { id: 4, name: "50% Bonus", shortName: "50%", color: "#95E1D3", probability: 15, value: 0, icon: "🎁" },
  { id: 5, name: "S/ 20", shortName: "20", color: "#A8E6CF", probability: 20, value: 20, icon: "💸" },
  { id: 6, name: "Puntos x2", shortName: "x2", color: "#C7CEEA", probability: 25, value: 0, icon: "⭐" },
  { id: 7, name: "S/ 200", shortName: "200", color: "#FECA57", probability: 3, value: 200, icon: "🏆" },
  { id: 8, name: "Mejor Suerte", shortName: "😢", color: "#DDA0DD", probability: 2, value: 0, icon: "🍀" },
];

export function RouletteWheel({ isSpinning, onSpinComplete, lastPrize }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState(false);
  const [winningPrize, setWinningPrize] = useState<typeof PRIZES[0] | null>(null);
  const animationRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const targetRotationRef = useRef(0);

  // Función mejorada para dibujar la ruleta
  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, currentRotation: number) => {
    const segmentAngle = (2 * Math.PI) / PRIZES.length;
    
    // Sombra de la ruleta
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    // Dibujar borde exterior decorativo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Dibujar anillo dorado
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    ctx.restore();
    
    // Dibujar cada segmento
    PRIZES.forEach((prize, index) => {
      const startAngle = index * segmentAngle + currentRotation;
      const endAngle = startAngle + segmentAngle;
      
      // Dibujar segmento principal
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Gradiente radial para cada segmento
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, prize.color);
      gradient.addColorStop(0.7, prize.color);
      gradient.addColorStop(1, shadeColor(prize.color, -20));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Borde del segmento
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Dibujar contenido del segmento
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      
      // Icono
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prize.icon, radius * 0.65, 0);
      
      // Texto principal
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(prize.shortName, radius * 0.85, 0);
      
      ctx.restore();
    });
    
    // Círculo central mejorado
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.2);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.7, '#FFA500');
    centerGradient.addColorStop(1, '#FF8C00');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Borde del círculo central
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Texto "SPIN" con efecto
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
    ctx.restore();
    
    // Puntos decorativos alrededor
    for (let i = 0; i < PRIZES.length; i++) {
      const angle = i * segmentAngle + currentRotation;
      const dotX = centerX + Math.cos(angle) * (radius + 25);
      const dotY = centerY + Math.sin(angle) * (radius + 25);
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFF';
      ctx.fill();
    }
  };

  // Indicador mejorado
  const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const pointerSize = 40;
    const pointerY = centerY - radius - 35;
    
    ctx.save();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    
    // Triángulo principal
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + pointerSize);
    ctx.lineTo(centerX - pointerSize / 2, pointerY);
    ctx.lineTo(centerX + pointerSize / 2, pointerY);
    ctx.closePath();
    
    // Gradiente para el indicador
    const pointerGradient = ctx.createLinearGradient(
      centerX - pointerSize / 2, pointerY,
      centerX + pointerSize / 2, pointerY + pointerSize
    );
    pointerGradient.addColorStop(0, '#E74C3C');
    pointerGradient.addColorStop(0.5, '#C0392B');
    pointerGradient.addColorStop(1, '#E74C3C');
    
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    
    // Borde del indicador
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Círculo decorativo en la base
    ctx.beginPath();
    ctx.arc(centerX, pointerY - 5, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  // Función auxiliar para oscurecer colores
  const shadeColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  };

  // Determinar premio ganador
  const getWinningPrize = (finalRotation: number) => {
    const segmentAngle = (2 * Math.PI) / PRIZES.length;
    const normalizedRotation = ((finalRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const pointerAngle = 1.5 * Math.PI; // Indicador arriba
    const winningAngle = (pointerAngle - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(winningAngle / segmentAngle);
    return PRIZES[winningIndex];
  };

  // Animación mejorada
  const animate = () => {
    if (!isAnimating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar rotación con easing
    if (velocityRef.current > 0) {
      setRotation(prev => {
        const newRotation = prev + velocityRef.current;
        
        // Aplicar fricción más suave
        velocityRef.current *= 0.98;
        
        // Cuando la velocidad es muy baja, ajustar al premio objetivo
        if (velocityRef.current < 0.005 && targetRotationRef.current > 0) {
          const diff = targetRotationRef.current - newRotation;
          if (Math.abs(diff) < 0.1) {
            velocityRef.current = 0;
            setIsAnimating(false);
            const prize = getWinningPrize(targetRotationRef.current);
            setWinningPrize(prize);
            setShowPrizeAnimation(true);
            
            // Lanzar confetti si es un premio valioso
            if (prize.value >= 50) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
            
            setTimeout(() => {
              onSpinComplete();
              setShowPrizeAnimation(false);
            }, 2000);
            
            return targetRotationRef.current;
          }
          return newRotation + diff * 0.1;
        }
        
        return newRotation;
      });
    }
    
    // Dibujar ruleta
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    drawWheel(ctx, centerX, centerY, radius, rotation);
    drawPointer(ctx, centerX, centerY, radius);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto para iniciar animación
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      setShowPrizeAnimation(false);
      
      // Calcular rotación objetivo
      const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
      const segmentAngle = (2 * Math.PI) / PRIZES.length;
      const extraSpins = 5 + Math.random() * 3; // 5-8 vueltas completas
      targetRotationRef.current = extraSpins * 2 * Math.PI + randomPrizeIndex * segmentAngle + segmentAngle / 2;
      
      velocityRef.current = 0.4 + Math.random() * 0.2; // Velocidad inicial
    }
  }, [isSpinning, isAnimating]);

  // Efecto para la animación
  useEffect(() => {
    if (isAnimating) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, rotation]);

  // Dibujar inicial
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 600;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    drawWheel(ctx, centerX, centerY, radius, 0);
    drawPointer(ctx, centerX, centerY, radius);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      {/* Efecto de resplandor de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-poker-gold/30 via-poker-green/30 to-poker-gold/30 rounded-full blur-3xl animate-pulse" />
      
      {/* Canvas de la ruleta */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="w-full h-auto max-w-full rounded-full"
          style={{ 
            filter: isSpinning ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))' : 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))',
            transition: 'filter 0.3s ease'
          }}
        />
        
        {/* Luces decorativas animadas */}
        <div className="absolute -inset-8">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-280px)`,
                background: i % 2 === 0 ? '#FFD700' : '#FFF',
                boxShadow: '0 0 10px currentColor',
              }}
              animate={{
                opacity: isSpinning ? [0.3, 1, 0.3] : 0.8,
                scale: isSpinning ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Animación del premio ganador */}
      <AnimatePresence>
        {showPrizeAnimation && winningPrize && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: 2
              }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-4 border-poker-gold"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{winningPrize.icon}</div>
                <h3 className="text-2xl font-bold text-poker-darkGreen mb-2">
                  ¡{winningPrize.name}!
                </h3>
                {winningPrize.value > 0 && (
                  <p className="text-lg text-poker-gold font-semibold">
                    Has ganado S/ {winningPrize.value}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Efecto de brillo al girar */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rotate-45" />
        </motion.div>
      )}
    </div>
  );
}