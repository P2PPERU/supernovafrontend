'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Award, Calendar, DollarSign } from 'lucide-react';

interface SpinHistory {
  id: string;
  spin_type: string;
  is_real_prize: boolean;
  spin_date: string;
  prize_status: string;
  prize: {
    name: string;
    prize_type: string;
    prize_value: number;
    color: string;
  };
}

export function RouletteHistory() {
  const [history, setHistory] = useState<SpinHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roulette/my-history?limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.spins || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      demo: 'Demo',
      welcome_real: 'Bienvenida',
      code: 'Código',
      bonus: 'Bonus'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string, isReal: boolean) => {
    if (!isReal) {
      return <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-600 text-white text-[10px] md:text-xs rounded-full">Demo</span>;
    }
    
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-600',
      validated: 'bg-green-600',
      claimed: 'bg-blue-600'
    };
    
    return (
      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 ${statusColors[status] || 'bg-gray-600'} text-white text-[10px] md:text-xs rounded-full whitespace-nowrap`}>
        {status === 'pending' && 'Pendiente'}
        {status === 'validated' && 'Validado'}
        {status === 'claimed' && 'Reclamado'}
      </span>
    );
  };

  // Fondo de póker responsive
  const PokerBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-gray-900 to-green-900/20" />
      
      <motion.div
        className="absolute top-3 right-3 md:top-5 md:right-5 text-2xl md:text-3xl lg:text-5xl text-white/5"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        ♠
      </motion.div>
      <motion.div
        className="absolute bottom-3 left-3 md:bottom-5 md:left-5 text-2xl md:text-3xl lg:text-5xl text-red-500/5"
        animate={{ rotate: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
      >
        ♥
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-6 md:right-10 text-2xl md:text-3xl lg:text-5xl text-white/5"
        animate={{ y: [0, 20, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      >
        ♦
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-6 md:left-10 text-2xl md:text-3xl lg:text-5xl text-red-500/5"
        animate={{ y: [0, -15, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, delay: 3 }}
      >
        ♣
      </motion.div>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-gray-900/95 via-green-900/20 to-gray-900/95 backdrop-blur-lg rounded-xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-gray-700/50 h-fit">
      <PokerBackground />
      
      <div className="relative z-10">
        {/* Header responsive */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
          <span className="flex-1">Historial de Giros</span>
          <span className="text-yellow-400 text-sm md:text-base lg:text-xl">♠♥♦♣</span>
        </h2>

{loading ? (
          <div className="flex justify-center py-6 md:py-8">
            <motion.div 
              className="w-6 h-6 md:w-8 md:h-8 border-t-2 border-b-2 border-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-6 md:py-8 lg:py-12">
            <Award className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-600 mx-auto mb-2 md:mb-3 lg:mb-4" />
            <p className="text-gray-400 text-sm md:text-base">No has girado la ruleta aún</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">¡Haz tu primer giro ahora!</p>
          </div>
        ) : (
          <>
            {/* Contenedor con scroll para el historial */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2 md:space-y-3 pr-1">
              {history.map((spin) => (
                <motion.div
                  key={spin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/50 rounded-lg p-2.5 md:p-3 lg:p-4 hover:bg-gray-800/70 transition-all border border-gray-700/30"
                >
                  {/* Primera fila: Premio y Estado */}
                  <div className="flex items-start justify-between mb-1 md:mb-1.5 lg:mb-2 gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: spin.prize.color }}
                      />
                      <span className="text-white font-medium text-xs md:text-sm lg:text-base truncate">
                        {spin.prize.name}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(spin.prize_status, spin.is_real_prize)}
                    </div>
                  </div>
                  
                  {/* Segunda fila: Tipo y Valor */}
                  <div className="flex items-center justify-between text-xs md:text-sm gap-2">
                    <span className="text-gray-400 flex items-center gap-1 flex-1 min-w-0">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="truncate">{getTypeLabel(spin.spin_type)}</span>
                    </span>
                    {spin.prize.prize_value > 0 && (
                      <span className="text-green-400 font-semibold flex items-center gap-1 flex-shrink-0">
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">{spin.prize.prize_value}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Tercera fila: Fecha */}
                  <div className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-1.5 lg:mt-2">
                    {new Date(spin.spin_date).toLocaleString('es', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Resumen simplificado - solo total de giros */}
            <div className="mt-3 md:mt-4 lg:mt-6 pt-3 md:pt-4 lg:pt-6 border-t border-gray-700">
              <h3 className="text-xs md:text-sm font-semibold text-gray-400 mb-2 md:mb-3 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                Resumen
              </h3>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-lg p-2 md:p-2.5 lg:p-3 border border-gray-700/30 text-center"
              >
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">Total de Giros</p>
                <p className="text-base md:text-lg lg:text-xl font-bold text-white">{history.length}</p>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}