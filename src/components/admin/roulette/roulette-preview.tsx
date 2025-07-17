'use client';

import React, { useRef, useEffect } from 'react';
import { RoulettePrize } from '@/services/admin/roulette.service';
import { motion } from 'framer-motion';

interface RoulettePreviewProps {
  prizes: RoulettePrize[];
}

export function RoulettePreview({ prizes }: RoulettePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    if (prizes.length === 0) return;

    const segmentAngle = (2 * Math.PI) / prizes.length;

    // Ordenar premios por posición
    const sortedPrizes = [...prizes].sort((a, b) => a.position - b.position);

    // Dibujar cada segmento
    sortedPrizes.forEach((prize, index) => {
      const startAngle = index * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      // Dibujar segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Color de fondo
      ctx.fillStyle = prize.color || '#cccccc';
      ctx.fill();

      // Borde
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dibujar texto y contenido
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);

      // Icono o emoji
      if (prize.icon) {
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize.icon, radius * 0.7, 0);
      }

      // Nombre del premio (más pequeño)
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Truncar texto si es muy largo
      const maxLength = 10;
      const displayName = prize.name.length > maxLength 
        ? prize.name.substring(0, maxLength) + '...' 
        : prize.name;
      
      ctx.fillText(displayName, radius * 0.5, 0);

      // Probabilidad
      ctx.font = '10px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(`${prize.probability}%`, radius * 0.85, 0);

      ctx.restore();
    });

    // Círculo central
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.15);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(0.7, '#FFA500');
    centerGradient.addColorStop(1, '#FF8C00');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Texto central
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PREVIEW', centerX, centerY);
  };

  const drawPointer = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const pointerSize = 30;
    const pointerY = centerY - radius - 20;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    // Triángulo
    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + pointerSize);
    ctx.lineTo(centerX - pointerSize / 2, pointerY);
    ctx.lineTo(centerX + pointerSize / 2, pointerY);
    ctx.closePath();

    const pointerGradient = ctx.createLinearGradient(
      centerX - pointerSize / 2, pointerY,
      centerX + pointerSize / 2, pointerY + pointerSize
    );
    pointerGradient.addColorStop(0, '#E74C3C');
    pointerGradient.addColorStop(0.5, '#C0392B');
    pointerGradient.addColorStop(1, '#E74C3C');

    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamaño del canvas
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;

    // Limpiar canvas
    ctx.clearRect(0, 0, size, size);

    if (prizes.length === 0) {
      // Mostrar mensaje si no hay premios
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No hay premios activos', centerX, centerY);
      return;
    }

    // Dibujar la ruleta
    drawWheel(ctx, centerX, centerY, radius);
    drawPointer(ctx, centerX, centerY, radius);
  }, [prizes]);

  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  const isValidConfig = Math.abs(totalProbability - 100) < 0.01;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          {!isValidConfig && prizes.length > 0 && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center">
                <p className="font-semibold">Configuración Inválida</p>
                <p className="text-sm">Suma de probabilidades: {totalProbability.toFixed(2)}%</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Leyenda de premios */}
      {prizes.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium mb-3">Leyenda de Premios</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {prizes.map((prize) => (
              <div key={prize.id} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: prize.color }}
                />
                <span className="truncate">{prize.name}</span>
                <span className="text-muted-foreground">({prize.probability}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}