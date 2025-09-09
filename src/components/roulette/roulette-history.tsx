// components/roulette/roulette-history.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Award } from 'lucide-react';

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
      return <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">Demo</span>;
    }
    
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-600',
      validated: 'bg-green-600',
      claimed: 'bg-blue-600'
    };
    
    return (
      <span className={`px-2 py-1 ${statusColors[status] || 'bg-gray-600'} text-white text-xs rounded-full`}>
        {status === 'pending' && 'Pendiente'}
        {status === 'validated' && 'Validado'}
        {status === 'claimed' && 'Reclamado'}
      </span>
    );
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Historial de Giros
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No has girado la ruleta aún</p>
          <p className="text-sm text-gray-500 mt-2">¡Haz tu primer giro ahora!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((spin) => (
            <div
              key={spin.id}
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: spin.prize.color }}
                  />
                  <span className="text-white font-medium">
                    {spin.prize.name}
                  </span>
                </div>
                {getStatusBadge(spin.prize_status, spin.is_real_prize)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {getTypeLabel(spin.spin_type)}
                </span>
                {spin.prize.prize_value > 0 && (
                  <span className="text-green-400 font-semibold">
                    ${spin.prize.prize_value}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                {new Date(spin.spin_date).toLocaleString('es', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Resumen
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Total Giros</p>
            <p className="text-xl font-bold text-white">{history.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Ganancia Total</p>
            <p className="text-xl font-bold text-green-400">
              ${history.reduce((sum, spin) => sum + (spin.prize.prize_value || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}