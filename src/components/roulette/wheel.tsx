'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

// Configuración de premios de la ruleta
const PRIZES = [
  { id: 1, name: "S/ 100", color: "#FFD700", probability: 5, value: 100 },
  { id: 2, name: "Giro Extra", color: "#4ECDC4", probability: 20, value: 0 },
  { id: 3, name: "S/ 50", color: "#FF6B6B", probability: 10, value: 50 },
  { id: 4, name: "50% Bonus", color: "#95E1D3", probability: 15, value: 0 },
  { id: 5, name: "S/ 20", color: "#A8E6CF", probability: 20, value: 20 },
  { id: 6, name: "Puntos x2", color: "#C7CEEA", probability: 25, value: 0 },
  { id: 7, name: "S/ 200", color: "#FECA57", probability: 3, value: 200 },
  { id: 8, name: "Mejor Suerte", color: "#DDA0DD", probability: 2, value: 0 },
];

export function RouletteWheel({ isSpinning, onSpinComplete, lastPrize }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>(0);
  const velocityRef = useRef(0);

  // Dibujar la ruleta
  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const segmentAngle = (2 * Math.PI) / PRIZES.length;
    
    // Dibujar cada segmento
    PRIZES.forEach((prize, index) => {
      const startAngle = index * segmentAngle + rotation;
      const endAngle = startAngle + segmentAngle;
      
      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      
      // Dibujar borde
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Dibujar texto
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(prize.name, radius * 0.7, 0);
      ctx.restore();
    });
    
    // Dibujar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Dibujar botón central
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // Texto "SPIN" en el centro
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
  };

  // Dibujar el indicador (flecha)
  const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const pointerSize = 30;
    const pointerY = centerY - radius - 20;
    
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY);
    ctx.lineTo(centerX - pointerSize / 2, pointerY - pointerSize);
    ctx.lineTo(centerX + pointerSize / 2, pointerY - pointerSize);
    ctx.closePath();
    
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 3;
  };

  // Animación de giro
  const animate = () => {
    if (!isAnimating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar rotación
    if (velocityRef.current > 0) {
      setRotation(prev => prev + velocityRef.current);
      velocityRef.current *= 0.985; // Fricción
      
      if (velocityRef.current < 0.001) {
        velocityRef.current = 0;
        setIsAnimating(false);
        onSpinComplete();
      }
    }
    
    // Dibujar ruleta
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    drawWheel(ctx, centerX, centerY, radius);
    drawPointer(ctx, centerX, centerY, radius);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Efecto para iniciar/detener animación
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      velocityRef.current = 0.3 + Math.random() * 0.2; // Velocidad inicial aleatoria
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
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    drawWheel(ctx, centerX, centerY, radius);
    drawPointer(ctx, centerX, centerY, radius);
  }, []);

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-poker-gold/20 to-poker-green/20 rounded-full blur-3xl" />
      
      {/* Canvas de la ruleta */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-auto max-w-full"
          style={{ filter: isSpinning ? 'blur(1px)' : 'none' }}
        />
        
        {/* Luces decorativas */}
        <div className="absolute -inset-4">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-poker-gold rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-220px)`,
              }}
              animate={{
                opacity: isSpinning ? [0.3, 1, 0.3] : 0.5,
                scale: isSpinning ? [1, 1.5, 1] : 1,
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
      
      {/* Efecto de brillo al girar */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
        </motion.div>
      )}
    </div>
  );
}