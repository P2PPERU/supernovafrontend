'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Zap } from 'lucide-react';

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

// Configuración de premios con diseño mejorado
const PRIZES = [
  { 
    id: 1, 
    name: "S/ 200 MEGA", 
    shortName: "200", 
    color: "#FFD700", 
    gradient: "linear-gradient(135deg, #FFD700, #FFA500)",
    probability: 3, 
    value: 200, 
    icon: "🏆",
    rarity: "legendary"
  },
  { 
    id: 2, 
    name: "GIRO EXTRA", 
    shortName: "SPIN", 
    color: "#4ECDC4",
    gradient: "linear-gradient(135deg, #4ECDC4, #44A08D)", 
    probability: 20, 
    value: 0, 
    icon: "🎯",
    rarity: "common"
  },
  { 
    id: 3, 
    name: "S/ 100", 
    shortName: "100", 
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg, #FF6B6B, #C44569)", 
    probability: 5, 
    value: 100, 
    icon: "💰",
    rarity: "epic"
  },
  { 
    id: 4, 
    name: "50% BONUS", 
    shortName: "50%", 
    color: "#95E1D3",
    gradient: "linear-gradient(135deg, #95E1D3, #3AA89D)", 
    probability: 15, 
    value: 0, 
    icon: "🎁",
    rarity: "rare"
  },
  { 
    id: 5, 
    name: "S/ 50", 
    shortName: "50", 
    color: "#A8E6CF",
    gradient: "linear-gradient(135deg, #A8E6CF, #7FD1B0)", 
    probability: 10, 
    value: 50, 
    icon: "💵",
    rarity: "rare"
  },
  { 
    id: 6, 
    name: "PUNTOS x2", 
    shortName: "x2", 
    color: "#C7CEEA",
    gradient: "linear-gradient(135deg, #C7CEEA, #9FA5D5)", 
    probability: 25, 
    value: 0, 
    icon: "⭐",
    rarity: "common"
  },
  { 
    id: 7, 
    name: "S/ 500 JACKPOT", 
    shortName: "500", 
    color: "#FECA57",
    gradient: "linear-gradient(135deg, #FECA57, #FFA502)", 
    probability: 1, 
    value: 500, 
    icon: "💎",
    rarity: "mythic"
  },
  { 
    id: 8, 
    name: "S/ 20", 
    shortName: "20", 
    color: "#DDA0DD",
    gradient: "linear-gradient(135deg, #DDA0DD, #BA68C8)", 
    probability: 21, 
    value: 20, 
    icon: "💸",
    rarity: "common"
  },
];

export function RouletteWheel({ isSpinning, onSpinComplete, lastPrize }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [showPrizeAnimation, setShowPrizeAnimation] = useState<boolean>(false);
  const [winningPrize, setWinningPrize] = useState<typeof PRIZES[0] | null>(null);
  const [showLights, setShowLights] = useState<boolean>(false);
  const animationIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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

  // Función para dibujar estrellas
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, points: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / points;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < points; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  };

  // Función mejorada para dibujar la ruleta
  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, rotation: number) => {
    const segmentAngle = (2 * Math.PI) / PRIZES.length;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Fondo con gradiente radial
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
    bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    bgGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Sombra principal de la ruleta
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    
    // Círculo base con gradiente
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
    const baseGradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    baseGradient.addColorStop(0, '#2C3E50');
    baseGradient.addColorStop(0.5, '#34495E');
    baseGradient.addColorStop(1, '#2C3E50');
    ctx.fillStyle = baseGradient;
    ctx.fill();
    
    // Anillo exterior dorado con gradiente
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI, true);
    const goldGradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    goldGradient.addColorStop(0, '#FFD700');
    goldGradient.addColorStop(0.25, '#FFA500');
    goldGradient.addColorStop(0.5, '#FFD700');
    goldGradient.addColorStop(0.75, '#FFA500');
    goldGradient.addColorStop(1, '#FFD700');
    ctx.fillStyle = goldGradient;
    ctx.fill();
    
    ctx.restore();
    
    // Dibujar cada segmento con efectos mejorados
    PRIZES.forEach((prize, index) => {
      const startAngle = index * segmentAngle + rotation;
      const endAngle = startAngle + segmentAngle;
      
      ctx.save();
      
      // Crear path del segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Aplicar gradiente personalizado para cada premio
      const gradient = ctx.createRadialGradient(
        centerX + Math.cos(startAngle + segmentAngle / 2) * radius * 0.3,
        centerY + Math.sin(startAngle + segmentAngle / 2) * radius * 0.3,
        0,
        centerX + Math.cos(startAngle + segmentAngle / 2) * radius * 0.3,
        centerY + Math.sin(startAngle + segmentAngle / 2) * radius * 0.3,
        radius
      );
      
      // Colores según rareza
      let colorStart, colorEnd;
      switch(prize.rarity) {
        case 'mythic':
          colorStart = prize.color;
          colorEnd = shadeColor(prize.color, -30);
          ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
          ctx.shadowBlur = 20;
          break;
        case 'legendary':
          colorStart = prize.color;
          colorEnd = shadeColor(prize.color, -25);
          ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
          ctx.shadowBlur = 15;
          break;
        case 'epic':
          colorStart = prize.color;
          colorEnd = shadeColor(prize.color, -20);
          break;
        case 'rare':
          colorStart = prize.color;
          colorEnd = shadeColor(prize.color, -15);
          break;
        default:
          colorStart = prize.color;
          colorEnd = shadeColor(prize.color, -10);
      }
      
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(0.7, colorStart);
      gradient.addColorStop(1, colorEnd);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Borde del segmento con gradiente
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Línea divisoria brillante
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const lineEndX = centerX + Math.cos(startAngle) * radius;
      const lineEndY = centerY + Math.sin(startAngle) * radius;
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
      
      // Dibujar contenido del segmento con mejor diseño
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      
      // Efecto de sombra para el texto
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Icono más grande y con efecto
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prize.icon, radius * 0.65, 0);
      
      // Texto del premio con mejor estilo
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeText(prize.shortName, radius * 0.85, 0);
      ctx.fillText(prize.shortName, radius * 0.85, 0);
      
      // Indicador de rareza
      if (prize.rarity === 'mythic' || prize.rarity === 'legendary') {
        ctx.beginPath();
        ctx.arc(radius * 0.5, 0, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      }
      
      ctx.restore();
    });
    
    // Círculo central mejorado con múltiples capas
    // Capa base
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
    ctx.fillStyle = '#2C3E50';
    ctx.fill();
    
    // Anillo intermedio
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.23, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Centro con gradiente
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.2);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.3, '#FFA500');
    centerGradient.addColorStop(0.6, '#FF8C00');
    centerGradient.addColorStop(1, '#FF6347');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Borde del círculo central
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Texto "SPIN" con efecto 3D
    ctx.save();
    // Sombra del texto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX + 2, centerY + 2);
    
    // Texto principal
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SPIN', centerX, centerY);
    ctx.restore();
    
    // Luces decorativas alrededor (más visibles)
    for (let i = 0; i < PRIZES.length * 2; i++) {
      const angle = (i * Math.PI) / PRIZES.length + rotation;
      const dotX = centerX + Math.cos(angle) * (radius + 30);
      const dotY = centerY + Math.sin(angle) * (radius + 30);
      
      // Efecto glow
      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
      const glowGradient = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 8);
      glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Punto central
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
  };

  // Indicador mejorado con animación
  const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const pointerSize = 50;
    const pointerY = centerY - radius - 40;
    
    ctx.save();
    
    // Efecto glow del indicador
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    
    // Base del indicador
    ctx.beginPath();
    ctx.arc(centerX, pointerY - 10, 15, 0, 2 * Math.PI);
    const baseGradient = ctx.createRadialGradient(centerX, pointerY - 10, 0, centerX, pointerY - 10, 15);
    baseGradient.addColorStop(0, '#FFD700');
    baseGradient.addColorStop(1, '#FF8C00');
    ctx.fillStyle = baseGradient;
    ctx.fill();
    
    // Triángulo principal con gradiente
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + pointerSize);
    ctx.lineTo(centerX - pointerSize / 2, pointerY);
    ctx.lineTo(centerX + pointerSize / 2, pointerY);
    ctx.closePath();
    
    const pointerGradient = ctx.createLinearGradient(
      centerX, pointerY,
      centerX, pointerY + pointerSize
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
    
    // Detalles decorativos
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + pointerSize - 10);
    ctx.lineTo(centerX - pointerSize / 3, pointerY + 10);
    ctx.lineTo(centerX + pointerSize / 3, pointerY + 10);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    
    // Estrella en el centro del indicador
    drawStar(ctx, centerX, pointerY - 10, 8, 5, 3);
    
    ctx.restore();
  };

  // Determinar premio ganador
  const getWinningPrize = (finalRotation: number) => {
    const segmentAngle = (2 * Math.PI) / PRIZES.length;
    const normalizedRotation = ((finalRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    const pointerAngle = 1.5 * Math.PI;
    const winningAngle = (pointerAngle - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(winningAngle / segmentAngle);
    return PRIZES[winningIndex];
  };

  // Función de animación principal
  const animate = (timestamp: DOMHighResTimeStamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = timestamp - startTimeRef.current;
    const duration = 5000; // 5 segundos de animación
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    // Calcular rotación actual
    const newRotation = targetRotationRef.current * easeOut;
    setCurrentRotation(newRotation);
    
    // Dibujar la ruleta con la rotación actual
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    drawWheel(ctx, centerX, centerY, radius, newRotation);
    drawPointer(ctx, centerX, centerY, radius);
    
    if (progress < 1) {
      animationIdRef.current = window.requestAnimationFrame(animate);
    } else {
      // Animación completada
      setIsAnimating(false);
      const prize = getWinningPrize(targetRotationRef.current);
      setWinningPrize(prize);
      setShowPrizeAnimation(true);
      
      // Efectos especiales según rareza del premio
      if (prize.rarity === 'mythic' || prize.rarity === 'legendary') {
        // Confetti dorado masivo
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFD700', '#FFFFFF']
        };

        function fire(particleRatio: number, opts: any) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } else if (prize.value >= 50) {
        // Confetti estándar para premios buenos
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setTimeout(() => {
        onSpinComplete();
        setShowPrizeAnimation(false);
        setShowLights(false);
      }, 2000);
    }
  };

  // Efecto para iniciar/detener animación
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      setShowPrizeAnimation(false);
      setShowLights(true);
      startTimeRef.current = 0;
      
      // Calcular rotación objetivo (premio aleatorio + vueltas extra)
      const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
      const segmentAngle = (2 * Math.PI) / PRIZES.length;
      const extraSpins = 8 + Math.random() * 4; // 8-12 vueltas
      targetRotationRef.current = currentRotation + extraSpins * 2 * Math.PI + randomPrizeIndex * segmentAngle + segmentAngle / 2;
      
      // Iniciar animación
      animationIdRef.current = window.requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationIdRef.current) {
        window.cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isSpinning]);

  // Dibujar inicial y cuando no está girando
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
    
    // Solo redibujar si no está animando
    if (!isAnimating) {
      drawWheel(ctx, centerX, centerY, radius, currentRotation);
      drawPointer(ctx, centerX, centerY, radius);
    }
  }, [currentRotation, isAnimating]);

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      {/* Efecto de resplandor de fondo animado */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        animate={{
          background: [
            'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Canvas de la ruleta */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="w-full h-auto max-w-full rounded-full"
          style={{ 
            filter: isAnimating 
              ? 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)) brightness(1.1)' 
              : 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))',
            transition: 'filter 0.3s ease'
          }}
        />
        
        {/* Luces decorativas animadas mejoradas */}
        <AnimatePresence>
          {showLights && (
            <div className="absolute -inset-8">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-280px)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                    background: [
                      i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#10B981' : '#8B5CF6',
                      i % 3 === 0 ? '#FFA500' : i % 3 === 1 ? '#059669' : '#7C3AED',
                      i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#10B981' : '#8B5CF6',
                    ],
                    boxShadow: [
                      '0 0 10px currentColor',
                      '0 0 20px currentColor',
                      '0 0 10px currentColor',
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Partículas flotantes durante el giro */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              >
                {i % 3 === 0 ? (
                  <Sparkles className="h-6 w-6 text-poker-gold" />
                ) : i % 3 === 1 ? (
                  <Star className="h-5 w-5 text-poker-green" />
                ) : (
                  <Zap className="h-5 w-5 text-purple-500" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Animación del premio ganador mejorada */}
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
              className="relative"
            >
              {/* Efecto de explosión de luz */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${winningPrize.color}40 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 3, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: 2,
                }}
              />
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-poker-gold relative overflow-hidden">
                {/* Fondo animado */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{ background: winningPrize.gradient }} />
                </div>
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-7xl mb-4"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut"
                    }}
                  >
                    {winningPrize.icon}
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    ¡{winningPrize.name}!
                  </h3>
                  {winningPrize.value > 0 && (
                    <motion.p 
                      className="text-2xl text-poker-gold font-bold"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                      }}
                    >
                      Has ganado S/ {winningPrize.value}
                    </motion.p>
                  )}
                  
                  {/* Indicador de rareza */}
                  {(winningPrize.rarity === 'mythic' || winningPrize.rarity === 'legendary') && (
                    <motion.div
                      className="mt-4 flex justify-center gap-2"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-poker-gold fill-poker-gold" />
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Efecto de brillo al girar */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30 rounded-full overflow-hidden"
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