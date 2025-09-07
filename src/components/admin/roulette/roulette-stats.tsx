// components/admin/roulette/roulette-stats.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Gift, DollarSign, Calendar, Award, 
  BarChart3, Download, RefreshCw, PieChart, Activity 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';

interface Stats {
  spinsByType: Array<{
    type: string;
    count: number;
  }>;
  topPrizes: Array<{
    prize: {
      name: string;
      prize_type: string;
      prize_value: number;
      color: string;
    };
    count: number;
  }>;
  topSpinners: Array<{
    user: string;
    spins: number;
    totalWon: number;
  }>;
  pendingValidations: number;
  totalValueAwarded: number;
  dailySpins: Array<{
    date: string;
    demo: number;
    real: number;
    bonus: number;
    code: number;
  }>;
  conversionRate: {
    demoToReal: number;
    registeredToSpinner: number;
  };
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function RouletteStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/roulette/stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        toast.error('Error al cargar estadísticas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const exportStats = () => {
    if (!stats) return;

    const csvContent = [
      ['Estadísticas de Ruleta', `${dateRange.startDate} - ${dateRange.endDate}`],
      [],
      ['Métricas Generales'],
      ['Total de Giros', totalSpins],
      ['Valor Total Otorgado', `$${stats.totalValueAwarded}`],
      ['Jugadores Activos', stats.topSpinners.length],
      ['Validaciones Pendientes', stats.pendingValidations],
      [],
      ['Giros por Tipo'],
      ...stats.spinsByType.map(item => [item.type, item.count]),
      [],
      ['Top Premios'],
      ...stats.topPrizes.map(item => [item.prize.name, item.count, `$${item.prize.prize_value}`]),
      [],
      ['Top Jugadores'],
      ...stats.topSpinners.map(item => [item.user, item.spins, `$${item.totalWon}`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estadisticas-ruleta-${dateRange.startDate}-${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Estadísticas exportadas');
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const totalSpins = stats.spinsByType.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Estadísticas de la Ruleta</h2>
            <p className="text-gray-400 mt-1">Análisis detallado del rendimiento</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <button
              onClick={fetchStats}
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportStats}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{totalSpins}</span>
          </div>
          <h3 className="text-gray-400">Total de Giros</h3>
          <p className="text-xs text-gray-500 mt-2">
            {stats.conversionRate?.demoToReal ? 
              `${(stats.conversionRate.demoToReal * 100).toFixed(1)}% conversión` : 
              'Calculando...'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">${stats.totalValueAwarded.toFixed(2)}</span>
          </div>
          <h3 className="text-gray-400">Valor Total Otorgado</h3>
          <p className="text-xs text-gray-500 mt-2">
            Promedio: ${totalSpins > 0 ? (stats.totalValueAwarded / totalSpins).toFixed(2) : '0'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{stats.topSpinners.length}</span>
          </div>
          <h3 className="text-gray-400">Jugadores Activos</h3>
          <p className="text-xs text-gray-500 mt-2">
            {stats.conversionRate?.registeredToSpinner ? 
              `${(stats.conversionRate.registeredToSpinner * 100).toFixed(1)}% participación` : 
              'Calculando...'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.pendingValidations}</span>
          </div>
          <h3 className="text-gray-400">Validaciones Pendientes</h3>
          <p className="text-xs text-gray-500 mt-2">Requieren atención</p>
        </motion.div>
      </div>

      {/* Daily Spins Chart */}
      {stats.dailySpins && stats.dailySpins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Actividad Diaria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.dailySpins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Area type="monotone" dataKey="demo" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Demo" />
              <Area type="monotone" dataKey="real" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Real" />
              <Area type="monotone" dataKey="bonus" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Bonus" />
              <Area type="monotone" dataKey="code" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Código" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spins by Type Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Distribución de Giros
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={stats.spinsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent || 0).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.spinsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                formatter={(value) => {
                  const typeNames: Record<string, string> = {
                    demo: 'Demostración',
                    welcome_real: 'Bienvenida Real',
                    bonus: 'Bonus',
                    code: 'Código'
                  };
                  return typeNames[value] || value;
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Prizes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-400" />
            Premios Más Ganados
          </h3>
          <div className="space-y-3">
            {stats.topPrizes.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: item.prize?.color || COLORS[index] }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.prize?.name}</p>
                    {item.prize?.prize_value > 0 && (
                      <p className="text-green-400 text-sm">${item.prize.prize_value}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-semibold">{item.count}x</span>
                  <p className="text-xs text-gray-500">
                    {((item.count / totalSpins) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Top Jugadores
          </h3>
          <div className="space-y-3">
            {stats.topSpinners.slice(0, 5).map((player, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{player.user}</p>
                    <p className="text-green-400 text-sm">${player.totalWon.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-semibold">{player.spins}</span>
                  <p className="text-xs text-gray-500">giros</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Métricas de Conversión</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Demo → Real</span>
                <span className="text-white font-medium">
                  {stats.conversionRate?.demoToReal ? 
                    `${(stats.conversionRate.demoToReal * 100).toFixed(1)}%` : 
                    'N/A'}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.conversionRate?.demoToReal || 0) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Registrados → Jugadores</span>
                <span className="text-white font-medium">
                  {stats.conversionRate?.registeredToSpinner ? 
                    `${(stats.conversionRate.registeredToSpinner * 100).toFixed(1)}%` : 
                    'N/A'}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.conversionRate?.registeredToSpinner || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Resumen del Período</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Promedio diario</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(totalSpins / Math.max(1, stats.dailySpins?.length || 1))}
              </p>
              <p className="text-xs text-gray-500">giros/día</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Premio promedio</p>
              <p className="text-2xl font-bold text-green-400">
                ${totalSpins > 0 ? (stats.totalValueAwarded / totalSpins).toFixed(2) : '0'}
              </p>
              <p className="text-xs text-gray-500">por giro</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tasa de éxito</p>
              <p className="text-2xl font-bold text-purple-400">
                {stats.topPrizes.length > 0 ? 
                  `${((stats.topPrizes.filter(p => p.prize.prize_value > 0).reduce((sum, p) => sum + p.count, 0) / totalSpins) * 100).toFixed(1)}%` : 
                  '0%'}
              </p>
              <p className="text-xs text-gray-500">con premio</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">ROI estimado</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.totalValueAwarded > 0 ? '+' : ''}{((totalSpins * 10 - stats.totalValueAwarded) / Math.max(1, stats.totalValueAwarded) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">retorno</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}