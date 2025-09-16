'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calendar,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  Flame,
  Shield,
  Swords,
  Gem,
  Rocket,
  Bolt,
  ChevronUp,
  Eye,
  Clock,
  Activity
} from 'lucide-react';
import { useRankingGroups, useRankingGroup } from '@/hooks/useRankings';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

// Type definitions
interface Player {
  id?: string;
  profile_data?: {
    avatar?: string;
  };
}

interface RankingEntry {
  id?: string;
  position: number;
  displayName?: string;
  displayEmail?: string;
  player?: Player;
  external_player_name?: string;
  is_external?: boolean;
  points?: number;
  hands_played?: number;
  tournaments_played?: number;
  total_rake?: number;
  win_rate?: number;
}

interface RankingGroup {
  id: string;
  name: string;
  description?: string;
  ranking_type: string;
  start_date: string;
  end_date: string;
  status: string;
  playerCount: number;
  isActive: boolean;
}

// Sistema de rangos con colores poker
const PLAYER_RANKS = {
  ROOKIE: { 
    name: 'Novato', 
    min: 0, 
    max: 99, 
    icon: Target, 
    color: 'text-gray-400',
    bgColor: 'from-gray-500/20 to-gray-600/20',
    borderColor: 'border-gray-500/50',
    badge: '🎯'
  },
  BRONZE: { 
    name: 'Bronce', 
    min: 100, 
    max: 249, 
    icon: Shield, 
    color: 'text-amber-600',
    bgColor: 'from-amber-600/20 to-amber-700/20',
    borderColor: 'border-amber-600/50',
    badge: '🥉'
  },
  SILVER: { 
    name: 'Plata', 
    min: 250, 
    max: 499, 
    icon: Star, 
    color: 'text-gray-300',
    bgColor: 'from-gray-400/20 to-gray-500/20',
    borderColor: 'border-gray-400/50',
    badge: '🥈'
  },
  GOLD: { 
    name: 'Oro', 
    min: 500, 
    max: 999, 
    icon: Crown, 
    color: 'text-poker-gold',
    bgColor: 'from-poker-gold/20 to-poker-gold/30',
    borderColor: 'border-poker-gold/50',
    badge: '🥇'
  },
  PLATINUM: { 
    name: 'Platino', 
    min: 1000, 
    max: 1999, 
    icon: Gem, 
    color: 'text-poker-blue',
    bgColor: 'from-poker-blue/20 to-poker-blue/30',
    borderColor: 'border-poker-blue/50',
    badge: '💎'
  },
  DIAMOND: { 
    name: 'Diamante', 
    min: 2000, 
    max: 4999, 
    icon: Sparkles, 
    color: 'text-blue-400',
    bgColor: 'from-blue-400/20 to-blue-500/20',
    borderColor: 'border-blue-400/50',
    badge: '💠'
  },
  MASTER: { 
    name: 'Maestro', 
    min: 5000, 
    max: 9999, 
    icon: Bolt,
    color: 'text-poker-purple',
    bgColor: 'from-poker-purple/20 to-poker-purple/30',
    borderColor: 'border-poker-purple/50',
    badge: '⚡'
  },
  LEGEND: { 
    name: 'Leyenda', 
    min: 10000, 
    max: Infinity, 
    icon: Flame, 
    color: 'text-poker-green',
    bgColor: 'from-poker-green/20 to-poker-green/30',
    borderColor: 'border-poker-green/50',
    badge: '🔥'
  }
};

const RANKING_TYPES = {
  points: { 
    label: 'Puntos', 
    icon: Target, 
    color: 'text-poker-purple',
    bgColor: 'from-poker-purple/20 to-poker-purple/30',
    borderColor: 'border-poker-purple/30',
    description: 'Basado en puntos acumulados'
  },
  hands_played: { 
    label: 'Manos Jugadas', 
    icon: Gamepad2, 
    color: 'text-poker-blue',
    bgColor: 'from-poker-blue/20 to-poker-blue/30',
    borderColor: 'border-poker-blue/30',
    description: 'Cantidad de manos jugadas'
  },
  tournaments: { 
    label: 'Torneos', 
    icon: Trophy, 
    color: 'text-poker-gold',
    bgColor: 'from-poker-gold/20 to-poker-gold/30',
    borderColor: 'border-poker-gold/30',
    description: 'Torneos ganados y participados'
  },
  rake: { 
    label: 'Rake', 
    icon: DollarSign, 
    color: 'text-poker-green',
    bgColor: 'from-poker-green/20 to-poker-green/30',
    borderColor: 'border-poker-green/30',
    description: 'Rake total contribuido'
  }
} as const;

type RankingType = keyof typeof RANKING_TYPES;

export default function RankingsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [currentCard, setCurrentCard] = useState(0);
  
  // Array de símbolos de cartas
  const cards = ['♠', '♥', '♣', '♦'];
  
  // Efecto para rotar los símbolos de cartas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Obtener grupos disponibles
  const { data: groupsData, isLoading: groupsLoading } = useRankingGroups({
    active: true,
    page: 1,
    limit: 100
  });

  // Obtener rankings del grupo seleccionado
  const { data: rankingsData, isLoading: rankingsLoading } = useRankingGroup(
    selectedGroupId, 
    { page, limit: 50 }
  );

  const groups = groupsData?.groups || [];
  const selectedGroup = rankingsData?.group;
  const allRankings = rankingsData?.rankings || [];
  const totalPages = rankingsData?.totalPages || 1;

  // Usar todos los rankings (internos y externos)
  const rankings = allRankings;

  // Auto-seleccionar primer grupo activo
  if (!selectedGroupId && groups.length > 0) {
    const activeGroup = groups.find((g: RankingGroup) => g.status === 'active') || groups[0];
    setSelectedGroupId(activeGroup.id);
  }

  // Filtrar rankings por búsqueda
  const filteredRankings = rankings.filter((ranking: RankingEntry) => {
    if (!search) return true;
    const name = ranking.displayName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const getPlayerRank = (stat: number) => {
    return Object.values(PLAYER_RANKS).find(rank => 
      stat >= rank.min && stat <= rank.max
    ) || PLAYER_RANKS.ROOKIE;
  };

  const getRankProgress = (stat: number, rank: any) => {
    if (rank.max === Infinity) return 100;
    const progress = ((stat - rank.min) / (rank.max - rank.min)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) {
      return <Crown className="h-6 w-6 text-poker-gold fill-poker-gold drop-shadow-lg animate-pulse" />;
    } else if (position === 2) {
      return <Medal className="h-6 w-6 text-gray-300 fill-gray-300 drop-shadow-lg" />;
    } else if (position === 3) {
      return <Award className="h-6 w-6 text-amber-600 fill-amber-600 drop-shadow-lg" />;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-poker-green/20 text-poker-green border-poker-green/30 font-medium animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            En Vivo
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-poker-blue/20 text-poker-blue border-poker-blue/30 font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Próximo
          </Badge>
        );
      case 'finished':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 font-medium">
            <Eye className="h-3 w-3 mr-1" />
            Finalizado
          </Badge>
        );
      default:
        return null;
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
      {/* Hero Section con Fondo Animado de Cartas */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#1a2332] to-[#0f1923]">
        {/* Elementos de fondo animados - SÍMBOLOS DE CARTAS MONOCROMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Carta superior izquierda */}
          <div className="absolute top-10 left-[5%] text-[120px] opacity-10 text-gray-400 floating">
            {cards[currentCard]}
          </div>
          
          {/* Carta inferior derecha */}
          <div className="absolute bottom-16 right-[10%] text-[100px] opacity-10 text-gray-400 floating" style={{ animationDelay: '1s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          {/* Carta centro izquierda */}
          <div className="absolute top-1/2 left-[15%] text-[90px] opacity-10 text-gray-400 floating" style={{ animationDelay: '2s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
          
          {/* Carta centro derecha */}
          <div className="absolute top-1/3 right-[20%] text-[110px] opacity-10 text-gray-400 floating" style={{ animationDelay: '3s' }}>
            {cards[(currentCard + 3) % cards.length]}
          </div>
          
          {/* Cartas adicionales para más densidad */}
          <div className="absolute top-[70%] left-[40%] text-[80px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '1.5s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          <div className="absolute top-[20%] right-[35%] text-[95px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '2.5s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
        </div>

        {/* Gradiente overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-blue-900/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 md:mb-8"
          >
            <Badge className="mb-6 bg-poker-green/20 text-poker-green border-poker-green/30">
              <Trophy className="h-4 w-4 mr-1" />
              RANKINGS DE POKER
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              TOPS<span className="gradient-text">JUGADORES</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Los mejores jugadores compiten por la gloria eterna en nuestras mesas de poker
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenido Principal Responsive */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {/* Fondo sutil de cartas para la sección de rankings */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[80%] text-[200px] opacity-[0.05] text-gray-500 rotating-slow">♠</div>
          <div className="absolute bottom-[20%] left-[10%] text-[180px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '2s' }}>♥</div>
          <div className="absolute top-[60%] right-[15%] text-[160px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '4s' }}>♣</div>
          <div className="absolute top-[30%] left-[50%] text-[190px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '6s' }}>♦</div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8 relative z-10"
        >
          {/* Selector de grupo y filtros responsive */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 glass shadow-2xl border border-white/10">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-lg md:text-2xl text-white">
                  <div className="p-2 md:p-3 rounded-xl bg-poker-purple/20">
                    <Filter className="h-4 w-4 md:h-6 md:w-6 text-poker-purple" />
                  </div>
                  Seleccionar Torneo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Selector de grupo */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300">Torneo Activo</label>
                    {groupsLoading ? (
                      <div className="h-12 md:h-14 bg-white/10 rounded-xl animate-pulse border border-white/10" />
                    ) : (
                      <Select 
                        value={selectedGroupId} 
                        onValueChange={(value) => {
                          setSelectedGroupId(value);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-12 md:h-14 border-0 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all border border-white/10">
                          <SelectValue placeholder="Selecciona un torneo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-white/10">
                          {groups.map((group: RankingGroup) => {
                            const config = RANKING_TYPES[group.ranking_type as RankingType];
                            const Icon = config?.icon || Trophy;
                            
                            return (
                              <SelectItem key={group.id} value={group.id} className="focus:bg-white/10 text-white">
                                <div className="flex items-center gap-3 py-2">
                                  <Icon className={cn("h-4 w-4 md:h-5 md:w-5", config?.color)} />
                                  <span className="font-semibold text-sm md:text-base">{group.name}</span>
                                  {getStatusBadge(group.status)}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Buscador */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300">Buscar Jugador</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                      <Input
                        placeholder="Nombre del jugador..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 md:h-14 pl-10 md:pl-12 border-0 bg-white/10 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all placeholder:text-slate-400 text-white border border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información del grupo seleccionado responsive */}
          {selectedGroup && (
            <motion.div variants={itemVariants}>
              <Card className="border-0 glass shadow-2xl border border-white/10">
                <CardContent className="p-4 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className={cn("p-3 md:p-5 rounded-2xl", `bg-gradient-to-br ${RANKING_TYPES[selectedGroup.ranking_type as RankingType]?.bgColor} border ${RANKING_TYPES[selectedGroup.ranking_type as RankingType]?.borderColor}`)}>
                        {(() => {
                          const config = RANKING_TYPES[selectedGroup.ranking_type as RankingType];
                          const Icon = config?.icon || Trophy;
                          return <Icon className={cn("h-6 w-6 md:h-10 md:w-10", config?.color)} />;
                        })()}
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <h2 className="text-xl md:text-3xl font-bold text-white">{selectedGroup.name}</h2>
                        <p className="text-sm md:text-lg text-slate-300">{selectedGroup.description}</p>
                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-slate-400 text-xs md:text-base">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 md:h-5 md:w-5" />
                            <span className="font-medium">{formatDate(selectedGroup.start_date)} - {formatDate(selectedGroup.end_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 md:h-5 md:w-5" />
                            <span className="font-medium">{rankings.length} jugadores activos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:ml-auto">
                      {getStatusBadge(selectedGroup.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Rankings responsive */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 glass shadow-2xl overflow-hidden border border-white/10">
              <CardContent className="p-0">
                {rankingsLoading ? (
                  <div className="flex items-center justify-center py-16 md:py-24">
                    <div className="text-center space-y-4 md:space-y-6">
                      <div className="h-12 w-12 md:h-16 md:w-16 animate-spin rounded-full border-4 border-poker-purple border-t-transparent mx-auto" />
                      <p className="text-slate-300 text-lg md:text-xl font-medium">Cargando rankings...</p>
                    </div>
                  </div>
                ) : !selectedGroup ? (
                  <div className="text-center py-16 md:py-24 space-y-4 md:space-y-6 px-4">
                    <Trophy className="h-16 w-16 md:h-24 md:w-24 text-slate-600 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-2xl md:text-3xl text-slate-300 font-bold">Selecciona un torneo</p>
                      <p className="text-slate-500 text-base md:text-lg">Elige un torneo para ver las clasificaciones</p>
                    </div>
                  </div>
                ) : filteredRankings.length === 0 ? (
                  <div className="text-center py-16 md:py-24 space-y-4 md:space-y-6 px-4">
                    <Trophy className="h-16 w-16 md:h-24 md:w-24 text-slate-600 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-2xl md:text-3xl text-slate-300 font-bold">No hay jugadores</p>
                      <p className="text-slate-500 text-base md:text-lg">
                        {search ? `No se encontraron resultados para "${search}"` : 'Aún no hay datos para este torneo'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Top 3 Podio responsive */}
                    {!search && page === 1 && filteredRankings.length >= 3 && (
                      <div className="p-4 md:p-8 lg:p-12 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-2 md:gap-4 text-white justify-center">
                          <Crown className="h-6 w-6 md:h-8 md:w-8 text-poker-gold animate-pulse" />
                          Podio de Campeones
                          <Crown className="h-6 w-6 md:h-8 md:w-8 text-poker-gold animate-pulse" />
                        </h3>
                        
                        {/* Diseño responsive del podio */}
                        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 md:gap-8 mb-6 md:mb-8">
                          {/* Mobile: Stack verticalmente */}
                          <div className="flex flex-col md:hidden space-y-4 w-full max-w-sm">
                            {filteredRankings.slice(0, 3).map((ranking: RankingEntry, index: number) => {
                              const stat = getMainStat(ranking, selectedGroup.ranking_type);
                              const rank = getPlayerRank(stat);
                              const progress = getRankProgress(stat, rank);
                              const RankIcon = rank.icon;
                              
                              return (
                                <motion.div
                                  key={ranking.id || index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={cn(
                                    "relative glass border-2 rounded-2xl p-4 backdrop-blur-sm shadow-xl",
                                    index === 0 && "from-poker-gold/40 to-poker-gold/20 border-poker-gold/60",
                                    index === 1 && "from-gray-400/30 to-gray-600/30 border-gray-400/50",
                                    index === 2 && "from-amber-500/30 to-amber-700/30 border-amber-500/50"
                                  )}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <Avatar className="h-16 w-16 border-4 border-white/30 shadow-xl">
                                        <AvatarImage src={ranking.player?.profile_data?.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-poker-purple to-poker-blue text-white text-xl font-bold">
                                          {ranking.displayName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border-2 border-poker-gold">
                                        {getPositionIcon(ranking.position) || (
                                          <span className="text-poker-gold font-bold text-sm">#{ranking.position}</span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <h4 className="font-bold text-lg text-white mb-1">{ranking.displayName}</h4>
                                      <div className="text-2xl font-bold text-white mb-2">
                                        {formatStatValue(selectedGroup.ranking_type, stat)}
                                      </div>
                                      
                                      {/* Rango y progreso */}
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <RankIcon className={cn("h-4 w-4", rank.color)} />
                                          <span className={cn("text-sm font-bold", rank.color)}>{rank.name}</span>
                                          <span className="text-xs text-white/60">{rank.badge}</span>
                                        </div>
                                        <div className="space-y-1">
                                          <Progress value={progress} className="h-2" />
                                          <div className="text-xs text-white/60">
                                            {rank.max !== Infinity ? `${stat}/${rank.max}` : `${stat} pts`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Desktop: Podio tradicional */}
                          <div className="hidden md:flex items-end justify-center gap-8">
                            {/* 2do lugar */}
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="relative"
                            >
                              {(() => {
                                const ranking = filteredRankings[1];
                                const stat = getMainStat(ranking, selectedGroup.ranking_type);
                                const rank = getPlayerRank(stat);
                                const progress = getRankProgress(stat, rank);
                                const RankIcon = rank.icon;
                                
                                return (
                                  <div className="relative glass border-2 border-gray-400/50 rounded-3xl p-6 text-center backdrop-blur-sm shadow-2xl w-64 h-80">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 rounded-full p-3 border-2 border-gray-400">
                                      <span className="text-2xl font-bold text-gray-300">2</span>
                                    </div>
                                    
                                    <Avatar className="h-24 w-24 mx-auto mb-4 mt-4 border-4 border-gray-400/50 shadow-xl">
                                      <AvatarImage src={ranking?.player?.profile_data?.avatar} />
                                      <AvatarFallback className="bg-gradient-to-br from-poker-purple to-poker-blue text-white text-2xl font-bold">
                                        {ranking?.displayName?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <h4 className="font-bold text-xl mb-3 text-white">{ranking?.displayName}</h4>
                                    <div className="text-4xl font-bold mb-2 text-gray-300">
                                      {formatStatValue(selectedGroup.ranking_type, stat)}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <RankIcon className={cn("h-5 w-5", rank.color)} />
                                        <span className={cn("text-sm font-bold", rank.color)}>{rank.name}</span>
                                      </div>
                                      <Progress value={progress} className="h-2" />
                                    </div>
                                  </div>
                                );
                              })()}
                            </motion.div>

                            {/* 1er lugar */}
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="relative"
                            >
                              {(() => {
                                const ranking = filteredRankings[0];
                                const stat = getMainStat(ranking, selectedGroup.ranking_type);
                                const rank = getPlayerRank(stat);
                                const progress = getRankProgress(stat, rank);
                                const RankIcon = rank.icon;
                                
                                return (
                                  <div className="relative glass border-2 border-poker-gold/60 rounded-3xl p-8 text-center backdrop-blur-sm shadow-2xl w-72 h-96">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-poker-gold to-poker-gold/80 rounded-full p-4 border-4 border-poker-gold shadow-xl">
                                      <Crown className="h-8 w-8 text-white" />
                                    </div>
                                    
                                    <Avatar className="h-28 w-28 mx-auto mb-6 mt-6 border-4 border-poker-gold/70 shadow-2xl">
                                      <AvatarImage src={ranking?.player?.profile_data?.avatar} />
                                      <AvatarFallback className="bg-gradient-to-br from-poker-purple to-poker-blue text-white text-3xl font-bold">
                                        {ranking?.displayName?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <h4 className="font-bold text-2xl mb-4 text-white">{ranking?.displayName}</h4>
                                    <div className="text-5xl font-bold mb-4 gradient-text">
                                      {formatStatValue(selectedGroup.ranking_type, stat)}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <RankIcon className={cn("h-6 w-6", rank.color)} />
                                        <span className={cn("text-lg font-bold", rank.color)}>{rank.name}</span>
                                      </div>
                                      <Progress value={progress} className="h-2" />
                                    </div>
                                  </div>
                                );
                              })()}
                            </motion.div>

                            {/* 3er lugar */}
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="relative"
                            >
                              {(() => {
                                const ranking = filteredRankings[2];
                                const stat = getMainStat(ranking, selectedGroup.ranking_type);
                                const rank = getPlayerRank(stat);
                                const progress = getRankProgress(stat, rank);
                                const RankIcon = rank.icon;
                                
                                return (
                                  <div className="relative glass border-2 border-amber-500/50 rounded-3xl p-6 text-center backdrop-blur-sm shadow-2xl w-64 h-80">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 rounded-full p-3 border-2 border-amber-500">
                                      <span className="text-2xl font-bold text-amber-400">3</span>
                                    </div>
                                    
                                    <Avatar className="h-24 w-24 mx-auto mb-4 mt-4 border-4 border-amber-500/50 shadow-xl">
                                      <AvatarImage src={ranking?.player?.profile_data?.avatar} />
                                      <AvatarFallback className="bg-gradient-to-br from-poker-purple to-poker-blue text-white text-2xl font-bold">
                                        {ranking?.displayName?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <h4 className="font-bold text-xl mb-3 text-white">{ranking?.displayName}</h4>
                                    <div className="text-4xl font-bold mb-2 text-amber-300">
                                      {formatStatValue(selectedGroup.ranking_type, stat)}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <RankIcon className={cn("h-5 w-5", rank.color)} />
                                        <span className={cn("text-sm font-bold", rank.color)}>{rank.name}</span>
                                      </div>
                                      <Progress value={progress} className="h-2" />
                                    </div>
                                  </div>
                                );
                              })()}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lista completa responsive */}
                    <div className="p-4 md:p-8">
                      <div className="space-y-3 md:space-y-4">
                        {filteredRankings.map((ranking: RankingEntry, index: number) => {
                          const stat = getMainStat(ranking, selectedGroup.ranking_type);
                          const rank = getPlayerRank(stat);
                          const progress = getRankProgress(stat, rank);
                          const RankIcon = rank.icon;
                          
                          return (
                            <motion.div
                              key={ranking.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(
                                "flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group space-y-4 sm:space-y-0",
                                ranking.position <= 3 
                                  ? "glass border-poker-gold/40 hover:border-poker-gold/60" 
                                  : "glass border-white/10 hover:border-poker-purple/40"
                              )}
                            >
                              <div className="flex items-center gap-3 md:gap-6">
                                {/* Posición */}
                                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-white/20 flex-shrink-0">
                                  {getPositionIcon(ranking.position) || (
                                    <span className="text-lg md:text-2xl font-bold text-white">#{ranking.position}</span>
                                  )}
                                </div>

                                {/* Avatar y nombre */}
                                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                  <Avatar className="h-12 w-12 md:h-16 md:w-16 border-3 border-white/30 shadow-lg flex-shrink-0">
                                    <AvatarImage src={ranking.player?.profile_data?.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-poker-purple to-poker-blue text-white text-lg md:text-xl font-bold">
                                      {ranking.displayName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="min-w-0 flex-1">
                                    <Link 
                                      href={`/rankings/player/${ranking.player?.id}`}
                                      className="text-lg md:text-xl font-bold text-white hover:text-poker-purple transition-colors group-hover:text-poker-purple block truncate"
                                    >
                                      {ranking.displayName}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                      <RankIcon className={cn("h-3 w-3 md:h-4 md:w-4", rank.color)} />
                                      <span className={cn("text-xs md:text-sm font-semibold", rank.color)}>{rank.name}</span>
                                      <span className="text-xs">{rank.badge}</span>
                                    </div>
                                    {/* Progress bar responsive */}
                                    <div className="mt-2 space-y-1">
                                      <Progress value={progress} className="h-1.5 md:h-2" />
                                      <div className="text-xs text-slate-400">
                                        {rank.max !== Infinity ? `${stat}/${rank.max}` : `${stat} pts`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Estadística */}
                              <div className="text-center sm:text-right flex-shrink-0">
                                <div className="text-2xl md:text-3xl font-bold gradient-text">
                                  {formatStatValue(selectedGroup.ranking_type, stat)}
                                </div>
                                <div className="text-xs md:text-sm text-slate-400 font-medium">
                                  {RANKING_TYPES[selectedGroup.ranking_type as RankingType]?.label}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Paginación responsive */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-12">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 w-full sm:w-auto"
                          >
                            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                            Anterior
                          </Button>
                          
                          <div className="flex items-center gap-2 order-first sm:order-none">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={page === pageNum ? 'default' : 'ghost'}
                                  size="lg"
                                  onClick={() => setPage(pageNum)}
                                  className={cn(
                                    "font-bold w-10 h-10 md:w-12 md:h-12",
                                    page === pageNum 
                                      ? 'bg-gradient-to-r from-poker-purple to-poker-blue text-white shadow-lg' 
                                      : 'text-slate-300 hover:bg-white/10'
                                  )}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 w-full sm:w-auto"
                          >
                            Siguiente
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}