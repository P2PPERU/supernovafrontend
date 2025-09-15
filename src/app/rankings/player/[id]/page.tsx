'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Trophy, 
  Target,
  Gamepad2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Crown,
  Medal,
  Award,
  ArrowUp,
  ArrowDown,
  Star,
  Activity,
  BarChart3,
  Clock
} from 'lucide-react';
import { usePlayerRanking } from '@/hooks/useRankings';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

// Type definitions
interface HistoryEntry {
  date: string;
  position: number;
  points: number;
}

interface Ranking {
  type: string;
  season: string;
  position: number;
  points?: number;
  handsPlayed?: number;
  tournamentsPlayed?: number;
  totalRake?: number;
  winRate?: number;
  history?: HistoryEntry[];
}

interface Player {
  username?: string;
  name?: string;
  isExternal?: boolean;
  profile?: {
    avatar?: string;
  };
}

interface PlayerRankingData {
  player: Player;
  rankings: Ranking[];
}

interface ChartDataPoint {
  date: string;
  position: number;
  points: number;
  value: number;
}

interface ChartData {
  type: string;
  history: ChartDataPoint[];
}

interface StatsData {
  type: string;
  value: number;
  position: number;
  color: string;
}

const RANKING_TYPES = {
  points: { 
    label: 'Puntos', 
    icon: Target, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  hands_played: { 
    label: 'Manos Jugadas', 
    icon: Gamepad2, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  tournaments: { 
    label: 'Torneos', 
    icon: Trophy, 
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  rake: { 
    label: 'Rake', 
    icon: DollarSign, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  }
} as const;

type RankingType = keyof typeof RANKING_TYPES;

const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];

export default function PlayerRankingPage() {
  const params = useParams();
  const playerId = params.id as string;
  const [selectedSeason, setSelectedSeason] = useState('2025-01');

  const { data, isLoading, error } = usePlayerRanking(playerId) as {
    data: PlayerRankingData | undefined;
    isLoading: boolean;
    error: any;
  };
  
  const player = data?.player;
  const rankings = data?.rankings || [];

  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
    } else if (position === 2) {
      return <Medal className="h-5 w-5 text-gray-400 fill-gray-400" />;
    } else if (position === 3) {
      return <Award className="h-5 w-5 text-amber-600 fill-amber-600" />;
    }
    return null;
  };

  const getPositionChange = (history: HistoryEntry[]): number | null => {
    if (!history || history.length < 2) return null;
    
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    
    const change = previous.position - current.position;
    return change;
  };

  const formatStatValue = (type: string, value: number): string => {
    switch (type) {
      case 'rake':
        return formatCurrency(value);
      case 'points':
        return value.toLocaleString();
      case 'hands_played':
        return value.toLocaleString();
      case 'tournaments':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const getMainStat = (ranking: Ranking, type: string): number => {
    switch (type) {
      case 'points':
        return ranking.points || 0;
      case 'hands_played':
        return ranking.handsPlayed || 0;
      case 'tournaments':
        return ranking.tournamentsPlayed || 0;
      case 'rake':
        return ranking.totalRake || 0;
      default:
        return ranking.points || 0;
    }
  };

  // Preparar datos para gráficos
  const chartData: ChartData[] = rankings
    .filter((r: Ranking) => r.history && r.history.length > 0)
    .map((ranking: Ranking) => ({
      type: ranking.type,
      history: (ranking.history || []).map((h: HistoryEntry) => ({
        date: new Date(h.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        position: h.position,
        points: h.points,
        value: getMainStat(ranking, ranking.type)
      }))
    }));

  const statsData: StatsData[] = rankings.map((ranking: Ranking) => ({
    type: RANKING_TYPES[ranking.type as RankingType]?.label || ranking.type,
    value: getMainStat(ranking, ranking.type),
    position: ranking.position,
    color: RANKING_TYPES[ranking.type as RankingType]?.color.replace('text-', '') || 'purple-500'
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Cargando perfil del jugador...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">Jugador no encontrado</p>
          <p className="text-gray-500">El jugador no existe o no tiene datos de rankings</p>
          <Link 
            href="/rankings"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Volver a Rankings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923]">
      {/* Header del perfil */}
      <section className="relative py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Avatar y nombre */}
            <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-purple-500/50">
              <AvatarImage src={player.profile?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white text-3xl">
                {(player.username || player.name)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {player.username || player.name}
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              {player.isExternal ? (
                <Badge variant="outline" className="bg-white/10 border-white/20">
                  Jugador Externo
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/10 border-white/20">
                  Usuario Registrado
                </Badge>
              )}
              
              {/* Mejor posición */}
              {rankings.length > 0 && (
                <div className="flex items-center gap-2">
                  {getPositionBadge(Math.min(...rankings.map((r: Ranking) => r.position)))}
                  <span className="text-lg font-semibold">
                    Mejor posición: #{Math.min(...rankings.map((r: Ranking) => r.position))}
                  </span>
                </div>
              )}
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 glass rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {rankings.reduce((sum: number, r: Ranking) => sum + (r.points || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Puntos Totales</div>
              </div>
              <div className="text-center p-4 glass rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {rankings.reduce((sum: number, r: Ranking) => sum + (r.handsPlayed || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Manos Jugadas</div>
              </div>
              <div className="text-center p-4 glass rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {rankings.reduce((sum: number, r: Ranking) => sum + (r.tournamentsPlayed || 0), 0)}
                </div>
                <div className="text-sm text-gray-400">Torneos</div>
              </div>
              <div className="text-center p-4 glass rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {((rankings.reduce((sum: number, r: Ranking) => sum + (r.winRate || 0), 0) / rankings.length) || 0).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Win Rate Promedio</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="rankings" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-gray-900/50 backdrop-blur-lg p-1 rounded-xl">
            <TabsTrigger value="rankings" className="data-[state=active]:bg-purple-600">
              Rankings
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
              Historial
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* Tab Rankings */}
          <TabsContent value="rankings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Filtro de temporada */}
              <Card className="glass border-white/10 bg-white/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Rankings por Categoría</CardTitle>
                    <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                      <SelectTrigger className="w-40 glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-01">2025-01</SelectItem>
                        <SelectItem value="2024-12">2024-12</SelectItem>
                        <SelectItem value="2024-11">2024-11</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rankings
                      .filter((ranking: Ranking) => ranking.season === selectedSeason)
                      .map((ranking: Ranking, index: number) => {
                        const config = RANKING_TYPES[ranking.type as RankingType];
                        if (!config) return null;
                        
                        const Icon = config.icon;
                        const positionChange = getPositionChange(ranking.history || []);
                        
                        return (
                          <motion.div
                            key={ranking.type}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className={cn(
                              "relative overflow-hidden border",
                              config.bgColor,
                              config.borderColor
                            )}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon className={cn("h-5 w-5", config.color)} />
                                    <span className="font-semibold">{config.label}</span>
                                  </div>
                                  {getPositionBadge(ranking.position)}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {/* Posición actual */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold">#{ranking.position}</span>
                                    {positionChange !== null && (
                                      <div className={cn(
                                        "flex items-center gap-1 text-sm font-medium",
                                        positionChange > 0 ? "text-green-500" : positionChange < 0 ? "text-red-500" : "text-gray-500"
                                      )}>
                                        {positionChange > 0 ? (
                                          <ArrowUp className="h-3 w-3" />
                                        ) : positionChange < 0 ? (
                                          <ArrowDown className="h-3 w-3" />
                                        ) : null}
                                        {positionChange !== 0 && Math.abs(positionChange)}
                                      </div>
                                    )}
                                  </div>

                                  {/* Estadística principal */}
                                  <div>
                                    <div className="text-2xl font-bold">
                                      {formatStatValue(ranking.type, getMainStat(ranking, ranking.type))}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {config.label}
                                    </div>
                                  </div>

                                  {/* Estadísticas adicionales */}
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <div className="font-semibold">{ranking.winRate}%</div>
                                      <div className="text-gray-400">Win Rate</div>
                                    </div>
                                    <div>
                                      <div className="font-semibold">
                                        {ranking.handsPlayed?.toLocaleString() || 0}
                                      </div>
                                      <div className="text-gray-400">Manos</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </div>

                  {rankings.filter((r: Ranking) => r.season === selectedSeason).length === 0 && (
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-xl text-gray-400">No hay rankings para esta temporada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="glass border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Progreso de Posiciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData[0]?.history || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            fontSize={12}
                            reversed={true}
                            domain={['dataMin - 1', 'dataMax + 1']}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(17, 24, 39, 0.8)',
                              border: '1px solid rgba(75, 85, 99, 0.3)',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            labelFormatter={(label) => `Fecha: ${label}`}
                            formatter={(value: any, name: string) => [`#${value}`, 'Posición']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="position" 
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            dot={{ fill: '#8b5cf6', r: 4 }}
                            activeDot={{ r: 6, fill: '#a855f7' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-xl text-gray-400">No hay historial disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tab Estadísticas */}
          <TabsContent value="stats">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución por categorías */}
                <Card className="glass border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle>Distribución por Categorías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statsData}
                              dataKey="value"
                              nameKey="type"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                            >
                              {statsData.map((entry: StatsData, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                border: '1px solid rgba(75, 85, 99, 0.3)',
                                borderRadius: '8px',
                                color: 'white'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No hay datos para mostrar</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Resumen de rendimiento */}
                <Card className="glass border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle>Resumen de Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rankings.map((ranking: Ranking, index: number) => {
                        const config = RANKING_TYPES[ranking.type as RankingType];
                        if (!config) return null;
                        
                        const Icon = config.icon;
                        
                        return (
                          <div key={ranking.type} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <Icon className={cn("h-5 w-5", config.color)} />
                              <div>
                                <div className="font-medium">{config.label}</div>
                                <div className="text-sm text-gray-400">
                                  Temporada {ranking.season}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">#{ranking.position}</div>
                              <div className="text-sm text-gray-400">
                                {formatStatValue(ranking.type, getMainStat(ranking, ranking.type))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}