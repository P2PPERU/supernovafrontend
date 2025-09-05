'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RouletteWheel } from '@/components/roulette/wheel';
import { CodeModal } from '@/components/roulette/code-modal';
import { PrizeModal } from '@/components/roulette/prize-modal';
import { SpinHistory } from '@/components/roulette/spin-history';
import { useRouletteStatus, useRouletteSpin, useRoulettePrizes, useRouletteConfig } from '@/hooks/useRoulette';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Gift, 
  History, 
  Trophy,
  Zap,
  Code2,
  Star,
  Crown,
  AlertCircle,
  Flame,
  Target,
  TrendingUp,
  Award,
  Gamepad2,
  Volume2,
  VolumeX,
  Coins,
  Timer,
  Shield,
  Diamond,
  Rocket,
  ChevronRight,
  Gem,
  Medal,
  CircleDollarSign,
  Ticket,
  PartyPopper,
  Info,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    color?: string;
    probability?: number;
  };
  message?: string;
}

// Helper para obtener el icono del premio
const getPrizeIcon = (prizeType: string) => {
  switch (prizeType) {
    case 'cash':
      return CircleDollarSign;
    case 'spin':
    case 'extra_spin':
      return RefreshCw;
    case 'bonus':
      return Gift;
    case 'points':
      return Star;
    case 'multiplier':
      return Zap;
    case 'nothing':
      return AlertCircle;
    default:
      return Trophy;
  }
};

// Helper para obtener el color de rareza
const getRarityColor = (probability: number) => {
  if (probability <= 1) return 'from-yellow-500 to-amber-600'; // Mítico
  if (probability <= 5) return 'from-purple-500 to-purple-700'; // Épico
  if (probability <= 15) return 'from-blue-500 to-blue-700'; // Raro
  if (probability <= 30) return 'from-green-500 to-green-700'; // Poco común
  return 'from-gray-500 to-gray-700'; // Común
};

const getRarityBadge = (probability: number) => {
  if (probability <= 1) return { text: 'MÍTICO', class: 'bg-gradient-to-r from-yellow-500 to-amber-600' };
  if (probability <= 5) return { text: 'ÉPICO', class: 'bg-gradient-to-r from-purple-500 to-purple-700' };
  if (probability <= 15) return { text: 'RARO', class: 'bg-gradient-to-r from-blue-500 to-blue-700' };
  if (probability <= 30) return { text: 'POCO COMÚN', class: 'bg-gradient-to-r from-green-500 to-green-700' };
  return { text: 'COMÚN', class: 'bg-gradient-to-r from-gray-500 to-gray-700' };
};

export default function RoulettePage() {
  const { user } = useAuthStore();
  const { data: status, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = useRouletteStatus();
  const { data: configData, isLoading: configLoading } = useRouletteConfig();
  const { data: prizesData, isLoading: prizesLoading } = useRoulettePrizes();
  const spinMutation = useRouletteSpin();
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [activeTab, setActiveTab] = useState('game');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStreak, setShowStreak] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  // Crear partículas aleatorias
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        if (newParticles.length < 5) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: 110
          });
        }
        return newParticles.filter(p => p.y > -10).map(p => ({...p, y: p.y - 0.5}));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const statusData = status?.status;
  const config = configData?.config;
  const prizes = prizesData?.prizes || [];
  const activePrizes = prizes.filter((prize: any) => prize.is_active);
  
  // Determinar tipo de giro disponible
  const getSpinType = () => {
    if (!statusData) return null;
  
  // Prioridad 1: Giros reales
    if (statusData.has_real_available) return 'real';
  
  // Prioridad 2: Giros bonus (NO mostrar demo si hay bonus)
   if (statusData.available_bonus_spins && statusData.available_bonus_spins > 0) {
    return 'bonus';
    }
  
  // Prioridad 3: Giros demo (SOLO si NO hay bonus y NO está validado)
   if (
    statusData.available_demo_spins && 
    statusData.available_demo_spins > 0 && 
    !statusData.is_validated && 
    (!statusData.available_bonus_spins || statusData.available_bonus_spins === 0)
    ) {
      return 'demo';
    }
  
    return null;
   };
  
  const spinType = getSpinType();
  
  // Verificar si puede girar
  const canSpin = Boolean(
    statusData?.has_real_available || 
    (statusData?.available_bonus_spins && statusData.available_bonus_spins > 0) ||
    (statusData?.available_demo_spins && statusData.available_demo_spins > 0)
  );

  // Manejar giro
  const handleSpin = async () => {
    if (isSpinning || spinMutation.isPending) return;
    
    if (!canSpin) {
      toast.error('No tienes giros disponibles');
      return;
    }
    
    setIsSpinning(true);
    
    // Efectos visuales al iniciar
    if (soundEnabled) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FFD700', '#10B981', '#8B5CF6']
      });
    }
    
    try {
      const result = await spinMutation.mutateAsync();
      
      // Esperar a que termine la animación
      setTimeout(() => {
        setIsSpinning(false);
        setLastPrize(result.spin);
        setShowPrizeModal(true);
        
        // Actualizar racha si ganó algo valioso
        if (result.spin.prize?.prize_value && result.spin.prize.prize_value > 0) {
          setCurrentStreak(prev => prev + 1);
          setShowStreak(true);
          setTimeout(() => setShowStreak(false), 3000);
          
          // Confetti para premios grandes
          if (result.spin.prize.prize_value >= 50) {
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
              return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
              const timeLeft = animationEnd - Date.now();
              if (timeLeft <= 0) return clearInterval(interval);
              
              const particleCount = 50 * (timeLeft / duration);
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
              });
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
              });
            }, 250);
          }
        }
        
        // Refrescar estado
        refetchStatus();
      }, 5500);
    } catch (error) {
      setIsSpinning(false);
      setCurrentStreak(0);
      toast.error('Error al girar la ruleta. Por favor intenta de nuevo.');
    }
  };

  // Calcular nivel basado en total de giros
  const calculateLevel = (totalSpins: number) => {
    return Math.floor(totalSpins / 10) + 1;
  };

  const userLevel = calculateLevel(statusData?.total_spins || 0);
  const spinsForNextLevel = (userLevel * 10) - (statusData?.total_spins || 0);
  const levelProgress = ((statusData?.total_spins || 0) % 10) * 10;

  // Loading state
  if (statusLoading || configLoading || prizesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1923] via-[#1a2332] to-[#0f1923] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-poker-gold animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando ruleta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1923] via-[#1a2332] to-[#0f1923] relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-poker-green/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-poker-gold/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-poker-gold rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header con stats del jugador */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Barra superior de estado */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Perfil y nivel */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border-2 border-purple-400">
                    <span className="text-2xl font-bold text-white">{userLevel}</span>
                  </div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-poker-gold rounded-full p-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="h-4 w-4 text-black" />
                  </motion.div>
                </motion.div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-lg">{user?.username}</span>
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
                      Nivel {userLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={levelProgress} className="w-32 h-2" />
                    <span className="text-xs text-gray-400">{spinsForNextLevel} giros para nivel {userLevel + 1}</span>
                  </div>
                </div>
              </div>

              {/* Stats rápidos */}
              <div className="flex items-center gap-3">
                {/* Total de giros */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Total Giros</p>
                      <p className="text-lg font-bold text-white">{statusData?.total_spins || 0}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Giros bonus disponibles */}
                {(statusData?.available_bonus_spins || 0) > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-purple-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-purple-300">Giros Bonus</p>
                        <p className="text-lg font-bold text-white">{statusData?.available_bonus_spins}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Giros demo disponibles */}
                {(statusData?.available_demo_spins || 0) > 0 && (
                  <motion.div 
                    className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-300">Giros Demo</p>
                        <p className="text-lg font-bold text-white">{statusData?.available_demo_spins}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Controles */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-white" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => setShowCodeModal(true)}
                      className="bg-gradient-to-r from-poker-gold to-yellow-600 hover:from-poker-gold/90 hover:to-yellow-600/90 text-black font-bold shadow-lg shadow-poker-gold/30"
                    >
                      <Code2 className="mr-2 h-4 w-4" />
                      Código Bonus
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Título animado */}
          <motion.div 
            className="text-center mb-6"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-2">
              <span className="bg-gradient-to-r from-poker-gold via-poker-green to-purple-500 bg-clip-text text-transparent">
                SUPERNOVA
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-poker-gold to-poker-green bg-clip-text text-transparent ml-3">
                SPIN
              </span>
            </h1>
            <p className="text-gray-400 text-lg">¡Gira la ruleta y gana premios increíbles!</p>
          </motion.div>
        </motion.div>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 backdrop-blur-xl border-yellow-500/30 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <p className="text-xs text-yellow-400 font-semibold uppercase">Balance</p>
                </div>
                <p className="text-2xl font-bold text-white">S/ {user?.balance || 0}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estado de Giros */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur-xl border-green-500/30 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-green-400" />
                  <p className="text-xs text-green-400 font-semibold uppercase">Estado</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {spinType === 'real' && (
                    <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
                      REAL
                    </Badge>
                  )}
                  {spinType === 'bonus' && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
                      BONUS
                    </Badge>
                  )}
                  {spinType === 'demo' && (
                    <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0">
                      DEMO
                    </Badge>
                  )}
                  {!spinType && (
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      Sin giros
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estadísticas de la ruleta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-xl border-blue-500/30 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-blue-400" />
                  <p className="text-xs text-blue-400 font-semibold uppercase">Ganadores Hoy</p>
                </div>
                <p className="text-2xl font-bold text-white">{config?.stats?.winners_today || 0}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total repartido */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-xl border-purple-500/30 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CircleDollarSign className="h-4 w-4 text-purple-400" />
                  <p className="text-xs text-purple-400 font-semibold uppercase">Repartido Hoy</p>
                </div>
                <p className="text-2xl font-bold text-white">S/ {config?.stats?.total_awarded_today || 0}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 backdrop-blur-xl border border-white/10">
            <TabsTrigger 
              value="game" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-poker-green data-[state=active]:to-green-600 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4" />
              Ruleta
            </TabsTrigger>
            <TabsTrigger 
              value="prizes" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-poker-gold data-[state=active]:to-yellow-600 data-[state=active]:text-black"
            >
              <Trophy className="h-4 w-4" />
              Premios
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
            >
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Tab de Ruleta */}
          <TabsContent value="game" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ruleta Principal */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10">
                    <CardContent className="p-0">
                      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                        <div className="relative z-10">
                          <RouletteWheel
                            isSpinning={isSpinning}
                            onSpinComplete={() => {}}
                            lastPrize={lastPrize}
                            prizes={activePrizes}
                          />
                          
                          {/* Botón de giro */}
                          <div className="mt-8 text-center">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="lg"
                                onClick={handleSpin}
                                disabled={!canSpin || isSpinning || spinMutation.isPending}
                                className={`
                                  relative overflow-hidden min-w-[280px] h-20 text-2xl font-black rounded-2xl
                                  ${spinType === 'real' ? 'bg-gradient-to-r from-poker-gold via-yellow-500 to-poker-gold hover:from-poker-gold/90 hover:via-yellow-500/90 hover:to-poker-gold/90 text-black shadow-2xl shadow-poker-gold/50' : ''}
                                  ${spinType === 'bonus' ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 shadow-2xl shadow-purple-600/50' : ''}
                                  ${spinType === 'demo' ? 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700' : ''}
                                  ${!spinType ? 'bg-gray-700 cursor-not-allowed opacity-50' : ''}
                                  transition-all duration-300
                                `}
                              >
                                {/* Efecto de brillo */}
                                {canSpin && !isSpinning && (
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: [-300, 300] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                  />
                                )}
                                
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                  {isSpinning || spinMutation.isPending ? (
                                    <>
                                      <Loader2 className="h-8 w-8 animate-spin" />
                                      <span>GIRANDO...</span>
                                    </>
                                  ) : (
                                    <>
                                      {spinType === 'demo' && (
                                        <>
                                          <Gamepad2 className="h-8 w-8" />
                                          <span>GIRAR DEMO</span>
                                        </>
                                      )}
                                      {spinType === 'real' && (
                                        <>
                                          <Diamond className="h-8 w-8" />
                                          <span>GIRAR REAL</span>
                                        </>
                                      )}
                                      {spinType === 'bonus' && (
                                        <>
                                          <Gift className="h-8 w-8" />
                                          <span>GIRAR BONUS</span>
                                        </>
                                      )}
                                      {!spinType && 'SIN GIROS'}
                                    </>
                                  )}
                                </span>
                              </Button>
                            </motion.div>
                            
                            {/* Indicador del tipo de giro */}
                            <AnimatePresence>
                              {canSpin && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="mt-4 flex items-center justify-center gap-2"
                                >
                                  {spinType === 'demo' && (
                                    <Badge className="bg-gray-900/50 backdrop-blur text-gray-300 border border-gray-600">
                                      <Info className="h-3 w-3 mr-1" />
                                      Giro demo - Los premios requieren validación
                                    </Badge>
                                  )}
                                  {spinType === 'real' && (
                                    <Badge className="bg-gradient-to-r from-green-900/50 to-green-800/50 backdrop-blur text-green-300 border border-green-500/50">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      ¡Giro real con premios reales!
                                    </Badge>
                                  )}
                                  {spinType === 'bonus' && (
                                    <Badge className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 backdrop-blur text-purple-300 border border-purple-500/50">
                                      <Gift className="h-3 w-3 mr-1" />
                                      Tienes {statusData?.available_bonus_spins} giros bonus
                                    </Badge>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Panel lateral */}
              <div className="space-y-4">
                {/* Info del usuario */}
                {!statusData?.is_validated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 backdrop-blur-xl border-yellow-500/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                          Cuenta No Validada
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 mb-3">
                          Valida tu cuenta para acceder a giros reales y reclamar premios.
                        </p>
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800">
                          Validar Ahora
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Premio pendiente */}
                {statusData?.demo_prize && !statusData?.is_validated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-xl border-purple-500/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-white">
                          <Trophy className="h-5 w-5 text-purple-400" />
                          Premio Pendiente
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-2">
                          <p className="text-xl font-bold text-white mb-2">
                            {statusData.demo_prize.name}
                          </p>
                          <p className="text-sm text-gray-400 mb-3">
                            Valídate para reclamar este premio
                          </p>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            Valor: S/ {statusData.demo_prize.prize_value}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Estadísticas del día */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <TrendingUp className="h-5 w-5 text-poker-green" />
                        Estadísticas del Día
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Giros totales</span>
                        <span className="text-sm font-bold text-white">{config?.stats?.spins_today || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Ganadores</span>
                        <span className="text-sm font-bold text-white">{config?.stats?.winners_today || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Premio mayor</span>
                        <span className="text-sm font-bold text-poker-gold">
                          S/ {config?.stats?.biggest_prize_today || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Tab de Premios */}
          <TabsContent value="prizes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePrizes.map((prize: any, index: number) => {
                const Icon = getPrizeIcon(prize.prize_type);
                const rarity = getRarityBadge(prize.probability);
                
                return (
                  <motion.div
                    key={prize.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10 overflow-hidden">
                      <div 
                        className={`h-2 bg-gradient-to-r ${getRarityColor(prize.probability)}`}
                      />
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: prize.color + '20' }}
                          >
                            <Icon className="h-6 w-6" style={{ color: prize.color }} />
                          </div>
                          <Badge className={`${rarity.class} text-white border-0`}>
                            {rarity.text}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2">{prize.name}</h3>
                        
                        {prize.prize_type === 'cash' && (
                          <p className="text-2xl font-bold text-poker-gold mb-2">
                            S/ {prize.prize_value}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Probabilidad</span>
                          <span className="text-white font-semibold">{prize.probability}%</span>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: prize.color }}
                            />
                            <span className="text-xs text-gray-400">
                              Posición #{prize.position}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            
            {activePrizes.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No hay premios activos</h3>
                <p className="text-gray-400">Los premios se cargarán pronto</p>
              </div>
            )}
          </TabsContent>

          {/* Tab de Historial */}
          <TabsContent value="history">
            <SpinHistory />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CodeModal 
          open={showCodeModal} 
          onClose={() => setShowCodeModal(false)} 
        />
        
        <PrizeModal
          open={showPrizeModal}
          onClose={() => {
            setShowPrizeModal(false);
            refetchStatus();
          }}
          prize={lastPrize}
        />

        {/* Notificación de racha */}
        <AnimatePresence>
          {showStreak && currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                <Flame className="h-6 w-6" />
                <span className="font-bold">¡Racha de {currentStreak}!</span>
                <PartyPopper className="h-6 w-6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}