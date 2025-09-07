// components/roulette/spinning-wheel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Prize {
  id: string;
  name: string;
  description: string;
  prize_type: string;
  prize_value: number;
  probability: number;
  color: string;
  position: number;
  is_active: boolean;
}

interface SpinResult {
  spin: {
    id: string;
    type: string;
    is_real: boolean;
    prize: Prize;
  };
  message: string;
}

export function SpinningWheel() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPrizes();
    fetchUserStatus();
  }, []);

  const fetchPrizes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/roulette/prizes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo premios activos y ordenar por posición
        const activePrizes = (data.prizes || [])
          .filter((p: Prize) => p.is_active)
          .sort((a: Prize, b: Prize) => a.position - b.position);
        setPrizes(activePrizes);
      }
    } catch (error) {
      console.error('Error fetching prizes:', error);
      toast.error('Error al cargar los premios');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/roulette/my-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserStatus(data);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (!userStatus?.has_demo_available && !userStatus?.has_real_available) {
      toast.error('No tienes giros disponibles');
      return;
    }

    setIsSpinning(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/roulette/spin`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result: SpinResult = await response.json();
        
        // Encontrar la posición del premio ganador
        const winningPrizeIndex = prizes.findIndex(p => p.id === result.spin.prize.id);
        
        if (winningPrizeIndex !== -1) {
          // Calcular el ángulo de rotación
          const prizeAngle = 360 / prizes.length;
          const targetAngle = 360 - (winningPrizeIndex * prizeAngle);
          const spins = 5; // Número de vueltas completas
          const finalRotation = rotation + (360 * spins) + targetAngle;
          
          setRotation(finalRotation);
          
          // Mostrar el resultado después de la animación
          setTimeout(() => {
            toast.success(`¡Ganaste ${result.spin.prize.name}!`);
            if (result.spin.prize.prize_value > 0) {
              toast.success(`Valor: $${result.spin.prize.prize_value}`);
            }
            setIsSpinning(false);
            fetchUserStatus(); // Actualizar estado del usuario
          }, 4000);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al girar la ruleta');
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Error de conexión');
      setIsSpinning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (prizes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No hay premios configurados</p>
      </div>
    );
  }

  const prizeAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Estado del usuario */}
      {userStatus && (
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-white mb-4">Tu Estado</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Giro Demo:</span>
              <span className={userStatus.has_demo_available ? 'text-green-400' : 'text-red-400'}>
                {userStatus.has_demo_available ? 'Disponible' : 'Usado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Giro Real:</span>
              <span className={userStatus.has_real_available ? 'text-green-400' : 'text-red-400'}>
                {userStatus.has_real_available ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de giros:</span>
              <span className="text-white">{userStatus.total_spins || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de la ruleta */}
      <div className="relative">
        {/* Indicador */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-500"></div>
        </div>

        {/* Ruleta */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          <motion.div
            ref={wheelRef}
            className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: "easeOut" }}
          >
            {/* Generar secciones de la ruleta */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {prizes.map((prize, index) => {
                const startAngle = (index * prizeAngle * Math.PI) / 180;
                const endAngle = ((index + 1) * prizeAngle * Math.PI) / 180;
                const largeArcFlag = prizeAngle > 180 ? 1 : 0;

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                return (
                  <g key={prize.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#1f2937"
                      strokeWidth="0.5"
                    />
                    <text
                      x={50 + 30 * Math.cos((startAngle + endAngle) / 2)}
                      y={50 + 30 * Math.sin((startAngle + endAngle) / 2)}
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${(index + 0.5) * prizeAngle}, ${50 + 30 * Math.cos((startAngle + endAngle) / 2)}, ${50 + 30 * Math.sin((startAngle + endAngle) / 2)})`}
                    >
                      {prize.name.length > 10 ? prize.name.substring(0, 10) + '...' : prize.name}
                    </text>
                  </g>
                );
              })}
              {/* Centro de la ruleta */}
              <circle cx="50" cy="50" r="10" fill="#1f2937" />
              <circle cx="50" cy="50" r="8" fill="#374151" />
            </svg>
          </motion.div>
        </div>

        {/* Botón de girar */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || (!userStatus?.has_demo_available && !userStatus?.has_real_available)}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 rounded-full font-bold text-white transition-all ${
            isSpinning || (!userStatus?.has_demo_available && !userStatus?.has_real_available)
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 hover:scale-110'
          }`}
        >
          {isSpinning ? 'GIRANDO...' : 'GIRAR'}
        </button>
      </div>

      {/* Lista de premios */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Premios Disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: prize.color }}
              />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{prize.name}</p>
                {prize.prize_value > 0 && (
                  <p className="text-xs text-green-400">${prize.prize_value}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">{prize.probability}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}