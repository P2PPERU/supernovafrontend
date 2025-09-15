'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Search, 
  Users, 
  Target,
  Gamepad2,
  DollarSign,
  Crown,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import { useRankings, useRankingFilters } from '@/hooks/useRankings';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

// Type definitions
interface Player {
  id?: string;
  profile?: {
    avatar?: string;
  };
}

interface RankingEntry {
  id?: string;
  position: number;
  displayName?: string;
  player?: Player;
  external_player_name?: string;
  is_external?: boolean;
  points?: number;
  hands_played?: number;
  tournaments_played?: number;
  total_rake?: number;
  win_rate?: number;
}

interface RankingsResponse {
  rankings: RankingEntry[];
  totalPages: number;
}

interface RankingFilters {
  type: string;
  season: string;
  period: string;
  search?: string;
  page: number;
  limit: number;
}

const RANKING_TYPES = {
  points: { 
    label: 'Puntos', 
    icon: Target, 
    color: 'text-purple-500',
    description: 'Basado en puntos acumulados'
  },
  hands_played: { 
    label: 'Manos Jugadas', 
    icon: Gamepad2, 
    color: 'text-blue-500',
    description: 'Cantidad de manos jugadas'
  },
  tournaments: { 
    label: 'Torneos', 
    icon: Trophy, 
    color: 'text-yellow-500',
    description: 'Torneos ganados y participados'
  },
  rake: { 
    label: 'Rake', 
    icon: DollarSign, 
    color: 'text-green-500',
    description: 'Rake total contribuido'
  }
} as const;

type RankingType = keyof typeof RANKING_TYPES;

const SEASONS = [
  '2025-01', '2024-12', '2024-11', '2024-10', 
  '2024-09', '2024-08', '2024-07', '2024-06'
];

export default function RankingsPage() {
  const [activeType, setActiveType] = useState<string>('points');
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('2025-01');
  const [period, setPeriod] = useState('all_time');
  const [page, setPage] = useState(1);

  const filters: RankingFilters = {
    type: activeType,
    season,
    period,
    search: search || undefined,
    page,
    limit: 50
  };

  const { data, isLoading } = useRankings(filters) as {
    data: RankingsResponse | undefined;
    isLoading: boolean;
  };
  
  const rankings = data?.rankings || [];
  const totalPages = data?.totalPages || 1;

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

  const getMainStat = (ranking: RankingEntry, type: string): number => {
    switch (type) {
      case 'points':
        return ranking.points || 0;
      case 'hands_played':
        return ranking.hands_played || 0;
      case 'tournaments':
        return ranking.tournaments_played || 0;
      case 'rake':
        return ranking.total_rake || 0;
      default:
        return ranking.points || 0;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923]">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-[5%] text-[120px] opacity-10 text-gray-400 floating">
            🏆
          </div>
          <div className="absolute bottom-16 right-[10%] text-[100px] opacity-10 text-gray-400 floating" style={{ animationDelay: '1s' }}>
            👑
          </div>
          <div className="absolute top-1/2 left-[15%] text-[90px] opacity-10 text-gray-400 floating" style={{ animationDelay: '2s' }}>
            🎯
          </div>
          <div className="absolute top-1/3 right-[20%] text-[110px] opacity-10 text-gray-400 floating" style={{ animationDelay: '3s' }}>
            🏅
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 backdrop-blur-sm bg-white/5 border border-white/10">
              <Trophy className="h-4 w-4 text-poker-gold" />
              <span className="text-sm font-medium">Clasificaciones</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rankings de <span className="gradient-text">Jugadores</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Compite con los mejores jugadores y escala posiciones en nuestro sistema de rankings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="container mx-auto px-4 pb-20 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Filtros */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="glass border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Temporada</label>
                    <Select value={season} onValueChange={setSeason}>
                      <SelectTrigger className="glass border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEASONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Período</label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className="glass border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_time">Todo el tiempo</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Buscar jugador</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nombre del jugador..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10 glass border-white/20 bg-white/5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs de tipos de ranking */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeType} onValueChange={(value) => {
              setActiveType(value);
              setPage(1);
            }}>
              <TabsList className="grid grid-cols-4 w-full bg-gray-900/50 backdrop-blur-lg p-1 rounded-xl mb-8">
                {Object.entries(RANKING_TYPES).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsTrigger 
                      key={key}
                      value={key}
                      className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(RANKING_TYPES).map(([key, config]) => (
                <TabsContent key={key} value={key}>
                  <Card className="glass border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-white/10", config.color)}>
                            <config.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle>Ranking por {config.label}</CardTitle>
                            <p className="text-sm text-gray-400">{config.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white/10 border-white/20">
                          {rankings.length} jugadores
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
                            <p className="text-gray-400">Cargando rankings...</p>
                          </div>
                        </div>
                      ) : rankings.length === 0 ? (
                        <div className="text-center py-12">
                          <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-xl text-gray-400 mb-2">No hay rankings disponibles</p>
                          <p className="text-gray-500">
                            {search ? `No se encontraron resultados para "${search}"` : 'Aún no hay datos para esta categoría'}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Top 3 especial */}
                          {page === 1 && rankings.length >= 3 && (
                            <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-500" />
                                Podio
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rankings.slice(0, 3).map((ranking: RankingEntry, index: number) => (
                                  <motion.div
                                    key={ranking.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                      "relative p-6 rounded-xl text-center",
                                      index === 0 && "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30",
                                      index === 1 && "bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30",
                                      index === 2 && "bg-gradient-to-br from-amber-600/20 to-amber-700/20 border border-amber-600/30"
                                    )}
                                  >
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                      {getPositionBadge(ranking.position)}
                                    </div>
                                    
                                    <Avatar className="h-16 w-16 mx-auto mb-4 border-2 border-white/20">
                                      <AvatarImage src={ranking.player?.profile?.avatar} />
                                      <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white">
                                        {ranking.displayName?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <h4 className="font-bold text-lg mb-1">{ranking.displayName}</h4>
                                    <div className="text-2xl font-bold mb-2">
                                      {formatStatValue(key, getMainStat(ranking, key))}
                                    </div>
                                    
                                    <div className="text-sm text-gray-400 space-y-1">
                                      <div>Win Rate: {ranking.win_rate}%</div>
                                      <div>Manos: {ranking.hands_played?.toLocaleString()}</div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tabla completa */}
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-white/10">
                                  <TableHead className="text-gray-300">Posición</TableHead>
                                  <TableHead className="text-gray-300">Jugador</TableHead>
                                  <TableHead className="text-gray-300">{config.label}</TableHead>
                                  <TableHead className="text-gray-300">Manos</TableHead>
                                  <TableHead className="text-gray-300">Torneos</TableHead>
                                  <TableHead className="text-gray-300">Win Rate</TableHead>
                                  <TableHead className="text-gray-300">Rake</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rankings.map((ranking: RankingEntry, index: number) => (
                                  <motion.tr
                                    key={ranking.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-white/10 hover:bg-white/5 transition-colors"
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {getPositionBadge(ranking.position)}
                                        <span className="font-semibold">#{ranking.position}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage src={ranking.player?.profile?.avatar} />
                                          <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white">
                                            {ranking.displayName?.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <Link 
                                            href={`/rankings/player/${ranking.player?.id || ranking.external_player_name}`}
                                            className="font-medium hover:text-poker-green transition-colors"
                                          >
                                            {ranking.displayName}
                                          </Link>
                                          {ranking.is_external && (
                                            <Badge variant="outline" className="ml-2 text-xs">
                                              Externo
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className="font-semibold text-lg">
                                        {formatStatValue(key, getMainStat(ranking, key))}
                                      </span>
                                    </TableCell>
                                    <TableCell>{ranking.hands_played?.toLocaleString() || 0}</TableCell>
                                    <TableCell>{ranking.tournaments_played || 0}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <span>{ranking.win_rate}%</span>
                                        {(ranking.win_rate ?? 0) >= 60 && (
                                          <TrendingUp className="h-4 w-4 text-green-500" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(ranking.total_rake || 0)}</TableCell>
                                  </motion.tr>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Paginación */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="border-white/20 hover:bg-white/10"
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                              </Button>
                              
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  const pageNum = i + 1;
                                  return (
                                    <Button
                                      key={pageNum}
                                      variant={page === pageNum ? 'default' : 'ghost'}
                                      size="sm"
                                      onClick={() => setPage(pageNum)}
                                      className={page === pageNum ? 'bg-purple-600' : 'hover:bg-white/10'}
                                    >
                                      {pageNum}
                                    </Button>
                                  );
                                })}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="border-white/20 hover:bg-white/10"
                              >
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}