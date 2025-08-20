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
import { useRouletteStatus, useRouletteSpin } from '@/hooks/useRoulette';
import { useAuthStore } from '@/store/auth.store';
import { useDemoSpins } from '@/hooks/useDemoSpins';
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
  RefreshCw
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
  };
  message?: string;
}

// Configuración de premios demo
const DEMO_PRIZES = [
  { 
    name: "S/ 200 (Demo)",
    description: "Premio demo de S/ 200",
    prize_value: 200,
    type: "cash",
    probability: 3,
    rarity: "legendary"
  },
  { 
    name: "Giro Extra (Demo)",
    description: "Un giro adicional demo",
    prize_value: 0,
    type: "spin",
    probability: 20,
    rarity: "common"
  },
  { 
    name: "S/ 100 (Demo)",
    description: "Premio demo de S/ 100",
    prize_value: 100,
    type: "cash",
    probability: 5,
    rarity: "epic"
  },
  { 
    name: "50% Bonus (Demo)",
    description: "Bonus del 50% demo",
    prize_value: 0,
    type: "bonus",
    probability: 15,
    rarity: "rare"
  },
  { 
    name: "S/ 50 (Demo)",
    description: "Premio demo de S/ 50",
    prize_value: 50,
    type: "cash",
    probability: 10,
    rarity: "rare"
  },
  { 
    name: "Puntos x2 (Demo)",
    description: "Duplica tus puntos demo",
    prize_value: 0,
    type: "points",
    probability: 25,
    rarity: "common"
  },
  { 
    name: "S/ 500 JACKPOT (Demo)",
    description: "¡Gran premio demo!",
    prize_value: 500,
    type: "cash",
    probability: 1,
    rarity: "mythic"
  },
  { 
    name: "S/ 20 (Demo)",
    description: "Premio demo de S/ 20",
    prize_value: 20,
    type: "cash",
    probability: 21,
    rarity: "common"
  }
];

// Función para obtener un premio demo aleatorio basado en probabilidades
function getRandomDemoPrize() {
  // Crear un array con las probabilidades acumuladas
  const totalProbability = DEMO_PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
  let random = Math.random() * totalProbability;
  
  // Seleccionar premio basado en probabilidad
  for (const prize of DEMO_PRIZES) {
    random -= prize.probability;
    if (random <= 0) {
      return {
        name: prize.name,
        description: prize.description,
        prize_value: prize.prize_value,
        prize_type: prize.type,
        type: prize.type,
        value: prize.prize_value,
        rarity: prize.rarity
      };
    }
  }
  
  // Por defecto retornar el último premio
  const defaultPrize = DEMO_PRIZES[DEMO_PRIZES.length - 1];
  return {
    name: defaultPrize.name,
    description: defaultPrize.description,
    prize_value: defaultPrize.prize_value,
    prize_type: defaultPrize.type,
    type: defaultPrize.type,
    value: defaultPrize.prize_value,
    rarity: defaultPrize.rarity
  };
}

export default function RoulettePage() {
  const { user } = useAuthStore();
  const { data: status, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = useRouletteStatus();
  const spinMutation = useRouletteSpin();
  
  // Hook de control de giros demo
  const {
    demoSpinsUsed,
    demoSpinsRemaining,
    maxDemoSpins,
    useDemoSpin,
    hasDemoSpinsAvailable,
    formatTimeRemaining
  } = useDemoSpins();
  
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
  
  // Modificar getSpinType para verificar demos disponibles
  const getSpinType = () => {
    if (!statusData) return null;
    if (statusData.has_real_available) return 'real';
    if (statusData.available_bonus_spins && statusData.available_bonus_spins > 0) return 'bonus';
    // IMPORTANTE: Verificar demos disponibles localmente, no del backend
    if (hasDemoSpinsAvailable()) return 'demo';
    return null;
  };
  
  const spinType = getSpinType();
  
  // Modificar canSpin para incluir el límite de demos
  const canSpin = Boolean(
    hasDemoSpinsAvailable() || // Usar la verificación local de demos
    statusData?.has_real_available || 
    (statusData?.available_bonus_spins && statusData.available_bonus_spins > 0)
  );

  // Modificar handleSpin para verificar giros demo
  const handleSpin = async () => {
    if (isSpinning) return; // Solo verificar isSpinning, no spinMutation.isPending para demos
    
    // Verificar si es un giro demo y si hay disponibles
    const currentSpinType = getSpinType();
    
    if (!currentSpinType) {
      toast.error('No tienes giros disponibles');
      return;
    }
    
    if (currentSpinType === 'demo') {
      // Verificar si hay giros demo disponibles
      if (!hasDemoSpinsAvailable()) {
        toast.error(`Has alcanzado el límite de ${maxDemoSpins} giros demo por día`, {
          description: `Se reiniciarán en ${formatTimeRemaining()}`
        });
        return;
      }
      
      // Usar un giro demo (esto actualiza el contador local)
      const canUseDemoSpin = useDemoSpin();
      if (!canUseDemoSpin) {
        return;
      }
      
      // IMPORTANTE: Para giros demo, NO llamar al backend
      // Simular el giro localmente
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
      
      // Simular un premio demo aleatorio con probabilidades reales
      const randomPrize = getRandomDemoPrize();
      
      // Esperar a que termine la animación
      setTimeout(() => {
        setIsSpinning(false);
        setLastPrize({
          type: 'demo',
          isReal: false,
          prize: randomPrize,
          message: 'Este es un premio demo. ¡Valídate para ganar premios reales!'
        });
        setShowPrizeModal(true);
        
        // No actualizar racha para demos
        if (randomPrize.prize_value > 0) {
          toast.info('¡Premio Demo! Recuerda que debes validarte para reclamar premios reales.');
        }
      }, 5500);
      
      return; // Importante: salir aquí para no hacer la llamada al API
    }
    
    // Para giros REALES o BONUS, sí llamar al backend
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
        
        // Refrescar estado solo para giros reales/bonus
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1923] via-[#1a2332] to-[#0f1923] relative overflow-hidden">
      {/* Efectos de fondo animados mejorados */}
      <div className="absolute inset-0">
        {/* Orbes de luz animados */}
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
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
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

      {/* Símbolos de cartas flotantes mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] left-[5%] text-8xl opacity-5 text-gray-400"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >♠</motion.div>
        <motion.div 
          className="absolute top-[70%] right-[10%] text-8xl opacity-5 text-gray-400"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >♥</motion.div>
        <motion.div 
          className="absolute top-[30%] right-[15%] text-8xl opacity-5 text-gray-400"
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >♣</motion.div>
        <motion.div 
          className="absolute bottom-[20%] left-[20%] text-8xl opacity-5 text-gray-400"
          animate={{
            y: [15, -15, 15],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >♦</motion.div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header mejorado con más gamificación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Barra superior de estado del jugador */}
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
            <motion.h1 
              className="text-5xl md:text-7xl font-black mb-2 relative inline-block"
            >
              <span className="bg-gradient-to-r from-poker-gold via-poker-green to-purple-500 bg-clip-text text-transparent">
                SUPERNOVA
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-poker-gold to-poker-green bg-clip-text text-transparent ml-3">
                SPIN
              </span>
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-poker-gold" />
              </motion.div>
            </motion.h1>
            <p className="text-gray-400 text-lg">¡Gira la ruleta y gana premios increíbles!</p>
          </motion.div>
        </motion.div>

        {/* Cards de estadísticas mejoradas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 backdrop-blur-xl border-yellow-500/30 overflow-hidden group">
              <CardContent className="p-4 relative">
                <motion.div 
                  className="absolute top-0 right-0 opacity-20"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <CircleDollarSign className="h-24 w-24 text-yellow-400" />
                </motion.div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Balance</p>
                  </div>
                  <p className="text-3xl font-black text-white">S/ {user?.balance || 0}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">+12.5% hoy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card de Giros Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-xl border-blue-500/30 overflow-hidden group">
              <CardContent className="p-4 relative">
                <motion.div 
                  className="absolute top-0 right-0 opacity-20"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Gamepad2 className="h-24 w-24 text-blue-400" />
                </motion.div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Gamepad2 className="h-4 w-4 text-blue-400" />
                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Giros Demo</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-white">{demoSpinsRemaining}</p>
                    <p className="text-sm text-gray-400">/ {maxDemoSpins}</p>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={(demoSpinsUsed / maxDemoSpins) * 100} 
                      className="h-2 bg-blue-900/50"
                    />
                  </div>
                  {demoSpinsRemaining === 0 && (
                    <p className="text-xs text-blue-300 mt-1">
                      Reinicia en {formatTimeRemaining()}
                    </p>
                  )}
                </div>
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
            <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur-xl border-green-500/30 overflow-hidden group">
              <CardContent className="p-4 relative">
                <motion.div 
                  className="absolute top-0 right-0 opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Zap className="h-24 w-24 text-green-400" />
                </motion.div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-green-400" />
                    <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Estado</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {spinType === 'real' && (
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
                        <Diamond className="h-3 w-3 mr-1" />
                        REAL
                      </Badge>
                    )}
                    {spinType === 'bonus' && (
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
                        <Gift className="h-3 w-3 mr-1" />
                        BONUS x{statusData?.available_bonus_spins}
                      </Badge>
                    )}
                    {spinType === 'demo' && (
                      <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        DEMO
                      </Badge>
                    )}
                    {!spinType && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        Sin giros
                      </Badge>
                    )}
                  </div>
                  {statusData?.is_validated && (
                    <div className="flex items-center gap-1 mt-2">
                      <Shield className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">Validado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premio Demo */}
          {statusData?.demo_prize && !statusData?.is_validated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 backdrop-blur-xl border-purple-500/30 overflow-hidden group">
                <CardContent className="p-4 relative">
                  <motion.div 
                    className="absolute top-0 right-0 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Trophy className="h-24 w-24 text-purple-400" />
                  </motion.div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="h-4 w-4 text-purple-400" />
                      <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Tu Premio</p>
                    </div>
                    <p className="text-lg font-bold text-white truncate">{statusData.demo_prize.name}</p>
                    <p className="text-xs text-purple-300 mt-1">¡Valídate para reclamarlo!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Racha actual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 backdrop-blur-xl border-orange-500/30 overflow-hidden group">
              <CardContent className="p-4 relative">
                <motion.div 
                  className="absolute top-0 right-0 opacity-20"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="h-24 w-24 text-orange-400" />
                </motion.div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Racha</p>
                  </div>
                  <p className="text-3xl font-black text-white">{currentStreak}x</p>
                  <p className="text-xs text-orange-300 mt-1">
                    {currentStreak > 0 ? '¡Sigue así!' : 'Comienza a ganar'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 backdrop-blur-xl border border-white/10">
            <TabsTrigger 
              value="game" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-poker-green data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Ruleta
            </TabsTrigger>
            <TabsTrigger 
              value="prizes" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-poker-gold data-[state=active]:to-yellow-600 data-[state=active]:text-black transition-all"
            >
              <Trophy className="h-4 w-4" />
              Premios
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all"
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
                        {/* Patrón de fondo dinámico */}
                        <div className="absolute inset-0">
                          <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: `
                                repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 35px,
                                  rgba(255, 215, 0, 0.1) 35px,
                                  rgba(255, 215, 0, 0.1) 70px
                                ),
                                repeating-linear-gradient(
                                  -45deg,
                                  transparent,
                                  transparent 35px,
                                  rgba(16, 185, 129, 0.1) 35px,
                                  rgba(16, 185, 129, 0.1) 70px
                                )
                              `
                            }}
                          />
                        </div>
                        
                        <div className="relative z-10">
                          <RouletteWheel
                            isSpinning={isSpinning}
                            onSpinComplete={() => {}}
                            lastPrize={lastPrize}
                          />
                          
                          {/* Botón de giro mejorado */}
                          <div className="mt-8 text-center">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="lg"
                                onClick={handleSpin}
                                disabled={!canSpin || isSpinning}
                                className={`
                                  relative overflow-hidden min-w-[280px] h-20 text-2xl font-black rounded-2xl
                                  ${spinType === 'real' ? 'bg-gradient-to-r from-poker-gold via-yellow-500 to-poker-gold hover:from-poker-gold/90 hover:via-yellow-500/90 hover:to-poker-gold/90 text-black shadow-2xl shadow-poker-gold/50' : ''}
                                  ${spinType === 'bonus' ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 shadow-2xl shadow-purple-600/50' : ''}
                                  ${spinType === 'demo' ? 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700' : ''}
                                  ${!spinType ? 'bg-gray-700 cursor-not-allowed opacity-50' : ''}
                                  transition-all duration-300 transform
                                `}
                              >
                                {/* Efecto de brillo animado */}
                                {canSpin && !isSpinning && (
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: [-300, 300] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                  />
                                )}
                                
                                {/* Partículas animadas en el botón */}
                                {canSpin && spinType === 'real' && (
                                  <>
                                    <motion.div
                                      className="absolute top-2 left-4"
                                      animate={{ 
                                        y: [-2, -8, -2],
                                        opacity: [0.5, 1, 0.5]
                                      }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Sparkles className="h-4 w-4 text-yellow-300" />
                                    </motion.div>
                                    <motion.div
                                      className="absolute bottom-2 right-4"
                                      animate={{ 
                                        y: [2, 8, 2],
                                        opacity: [0.5, 1, 0.5]
                                      }}
                                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-300" />
                                    </motion.div>
                                  </>
                                )}
                                
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                  {isSpinning ? (
                                    <>
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      >
                                        <Zap className="h-8 w-8" />
                                      </motion.div>
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
                            
                            {/* Indicador del tipo de giro actualizado */}
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
                                      Giro demo ({demoSpinsRemaining}/{maxDemoSpins} disponibles) - Los premios no son reales
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
                                      Tienes {statusData?.available_bonus_spins} giros bonus disponibles
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

              {/* Panel lateral de información */}
              <div className="space-y-4">
                {/* Información de Giros Demo */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Gamepad2 className="h-5 w-5 text-blue-400" />
                        Giros Demo Diarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Estado actual */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Giros disponibles hoy</span>
                          <Badge 
                            variant={demoSpinsRemaining === 0 ? "outline" : "default"}
                            className={demoSpinsRemaining === 0 ? "border-red-500 text-red-400" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}
                          >
                            {demoSpinsRemaining} / {maxDemoSpins}
                          </Badge>
                        </div>
                        <Progress 
                          value={(demoSpinsUsed / maxDemoSpins) * 100} 
                          className="h-3"
                        />
                        {demoSpinsUsed > 0 && (
                          <p className="text-xs text-gray-400">
                            Has usado {demoSpinsUsed} {demoSpinsUsed === 1 ? 'giro' : 'giros'} demo hoy
                          </p>
                        )}
                      </div>

                      {/* Información sobre el reinicio */}
                      <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-300">Próximo reinicio</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {formatTimeRemaining()}
                          </span>
                          <RefreshCw className="h-4 w-4 text-gray-500" />
                        </div>
                        <p className="text-xs text-gray-500">
                          Los giros se reinician diariamente a las 00:00
                        </p>
                      </div>

                      {/* Tips y beneficios */}
                      {demoSpinsRemaining === 0 ? (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-300 mb-1">
                                Sin giros demo disponibles
                              </p>
                              <p className="text-xs text-gray-300">
                                Has alcanzado el límite diario. ¡Valídate para obtener giros reales ilimitados!
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : demoSpinsRemaining <= 3 ? (
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-yellow-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-yellow-300 mb-1">
                                Últimos giros del día
                              </p>
                              <p className="text-xs text-gray-300">
                                Te quedan solo {demoSpinsRemaining} giros. ¡Úsalos sabiamente!
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-blue-300 mb-1">
                                Modo Demo
                              </p>
                              <p className="text-xs text-gray-300">
                                Los premios en modo demo no son reales. Valídate para ganar premios de verdad.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Misiones diarias */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Target className="h-5 w-5 text-poker-gold" />
                        Objetivos del Día
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Completa 3 giros</span>
                          <Badge className="bg-poker-green/20 text-poker-green border-poker-green/30">
                            +50 XP
                          </Badge>
                        </div>
                        <Progress value={Math.min(((statusData?.total_spins || 0) % 3) * 33, 100)} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Usa un código</span>
                          <Badge className="bg-poker-gold/20 text-poker-gold border-poker-gold/30">
                            Giro Extra
                          </Badge>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Próximas recompensas */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Medal className="h-5 w-5 text-purple-400" />
                        Próxima Recompensa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 mb-3">
                          <Ticket className="h-10 w-10 text-purple-400" />
                        </div>
                        <p className="text-sm text-gray-300 mb-1">Alcanza el nivel {userLevel + 1}</p>
                        <p className="text-lg font-bold text-white">Giro Bonus Gratis</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {spinsForNextLevel} giros restantes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Tab de Premios */}
          <TabsContent value="prizes">
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-poker-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Sistema de Premios</h3>
              <p className="text-gray-400">Próximamente verás todos los premios disponibles aquí</p>
            </div>
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