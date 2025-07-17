'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RouletteWheel } from '@/components/roulette/wheel';
import { CodeModal } from '@/components/roulette/code-modal';
import { PrizeModal } from '@/components/roulette/prize-modal';
import { SpinHistory } from '@/components/roulette/spin-history';
import { useRouletteStatus, useRouletteSpin } from '@/hooks/useRoulette';
import { useAuthStore } from '@/store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  History, 
  Info, 
  Coins,
  Trophy,
  Zap,
  Code2,
  Star,
  TrendingUp,
  Clock,
  Crown,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

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

export default function RoulettePage() {
  const { user } = useAuthStore();
  const { data: status, isLoading: statusLoading, error: statusError } = useRouletteStatus();
  const spinMutation = useRouletteSpin();
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [activeTab, setActiveTab] = useState('wheel');

  const handleSpin = async () => {
    if (isSpinning || spinMutation.isPending) return;
    
    setIsSpinning(true);
    
    try {
      const result = await spinMutation.mutateAsync();
      
      // Esperar a que termine la animación (5.5 segundos para la nueva animación)
      setTimeout(() => {
        setIsSpinning(false);
        setLastPrize(result.spin);
        setShowPrizeModal(true);
      }, 5500);
    } catch (error) {
      setIsSpinning(false);
    }
  };

  // Mejorar la lógica de disponibilidad con validaciones más claras
  const statusData = status?.status;
  
  const canSpin = Boolean(
    statusData?.has_demo_available || 
    statusData?.has_real_available || 
    (statusData?.available_bonus_spins && statusData.available_bonus_spins > 0)
  );
  
  const getSpinType = () => {
    if (!statusData) return null;
    
    // Prioridad: real > bonus > demo
    if (statusData.has_real_available) return 'real';
    if (statusData.available_bonus_spins && statusData.available_bonus_spins > 0) return 'bonus';
    if (statusData.has_demo_available) return 'demo';
    
    return null;
  };
  
  // Debug info
  useEffect(() => {
    if (statusData) {
      console.log('🎮 Roulette Status Update:', {
        canSpin,
        spinType: getSpinType(),
        demoAvailable: statusData.has_demo_available,
        realAvailable: statusData.has_real_available,
        bonusSpins: statusData.available_bonus_spins,
        demoSpinDone: statusData.demo_spin_done,
        isValidated: statusData.is_validated
      });
    }
  }, [statusData, canSpin]);

  const spinType = getSpinType();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header con efecto de brillo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-poker-gold/20 via-transparent to-poker-gold/20 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-10 w-10 text-poker-gold" />
                </motion.div>
                Ruleta de Premios
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                ¡Gira la ruleta y gana premios increíbles!
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowCodeModal(true)}
              className="bg-poker-gold/10 border-poker-gold text-poker-gold hover:bg-poker-gold/20"
            >
              <Code2 className="mr-2 h-4 w-4" />
              Ingresar Código
            </Button>
          </div>
        </motion.div>

        {/* Mensaje de error si falla la carga */}
        {statusError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Error al cargar el estado de la ruleta</p>
                </div>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  Por favor, recarga la página o intenta más tarde.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Status Cards con diseño premium */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-poker-gold/10 to-transparent" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-3xl font-bold text-white">S/ {user?.balance || 0}</p>
                    <p className="text-xs text-poker-gold mt-1">+12.5% este mes</p>
                  </div>
                  <div className="relative">
                    <Coins className="h-12 w-12 text-poker-gold" />
                    <motion.div
                      className="absolute inset-0 bg-poker-gold/30 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-poker-green/10 to-transparent" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Giros Disponibles</p>
                    <div className="flex items-center gap-2 mt-2">
                      {status?.status?.has_demo_available && (
                        <Badge className="bg-gray-600 text-white">Demo</Badge>
                      )}
                      {status?.status?.has_real_available && (
                        <Badge className="bg-poker-green text-white">Real</Badge>
                      )}
                      {(status?.status?.available_bonus_spins ?? 0) > 0 && (
                        <Badge className="bg-purple-600 text-white">
                          Bonus x{status?.status?.available_bonus_spins ?? 0}
                        </Badge>
                      )}
                      {!canSpin && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400">Sin giros</Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Gift className="h-12 w-12 text-poker-green" />
                    <motion.div
                      className="absolute inset-0 bg-poker-green/30 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-poker-red/10 to-transparent" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total de Giros</p>
                    <p className="text-3xl font-bold text-white">{status?.status?.total_spins || 0}</p>
                    <p className="text-xs text-poker-red mt-1">Ranking #127</p>
                  </div>
                  <div className="relative">
                    <Trophy className="h-12 w-12 text-poker-red" />
                    <motion.div
                      className="absolute inset-0 bg-poker-red/30 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs con nuevo diseño */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger 
              value="wheel" 
              className="flex items-center gap-2 data-[state=active]:bg-poker-gold data-[state=active]:text-black"
            >
              <Sparkles className="h-4 w-4" />
              Ruleta
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 data-[state=active]:bg-poker-gold data-[state=active]:text-black"
            >
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Ruleta Tab */}
          <TabsContent value="wheel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ruleta Principal */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                      {/* Patrón de fondo */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 35px,
                            rgba(255, 255, 255, 0.05) 35px,
                            rgba(255, 255, 255, 0.05) 70px
                          )`
                        }} />
                      </div>
                      
                      <div className="relative z-10">
                        <RouletteWheel
                          isSpinning={isSpinning}
                          onSpinComplete={() => {}}
                          lastPrize={lastPrize}
                        />
                        
                        {/* Spin Button mejorado */}
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
                                relative overflow-hidden min-w-[250px] h-16 text-xl font-bold
                                ${spinType === 'real' ? 'bg-gradient-to-r from-poker-gold to-yellow-600 hover:from-poker-gold/90 hover:to-yellow-600/90 text-black shadow-lg shadow-poker-gold/50' : ''}
                                ${spinType === 'bonus' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-600/50' : ''}
                                ${spinType === 'demo' ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' : ''}
                                ${!spinType ? 'bg-gray-700 cursor-not-allowed' : ''}
                                transition-all duration-300
                              `}
                            >
                              {/* Efecto de brillo animado */}
                              {canSpin && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                  animate={{ x: [-200, 200] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                />
                              )}
                              
                              {isSpinning ? (
                                <>
                                  <Zap className="mr-2 h-6 w-6 animate-pulse inline" />
                                  Girando...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-6 w-6 inline" />
                                  {spinType === 'demo' && 'Girar (Demo)'}
                                  {spinType === 'real' && 'Girar (Real)'}
                                  {spinType === 'bonus' && 'Girar (Bonus)'}
                                  {!spinType && 'Sin Giros'}
                                </>
                              )}
                            </Button>
                          </motion.div>
                          
                          <AnimatePresence>
                            {canSpin && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-sm text-gray-400 mt-3"
                              >
                                {spinType === 'demo' && '🎮 Este es un giro de demostración'}
                                {spinType === 'real' && '💰 ¡Giro real con premios reales!'}
                                {spinType === 'bonus' && `🎁 Tienes ${status?.status?.available_bonus_spins ?? 0} giros bonus`}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar mejorado */}
              <div className="space-y-4">
                {/* Premio Demo */}
                <AnimatePresence>
                  {status?.status?.demo_prize && !status?.status?.is_validated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card className="border-poker-gold bg-gradient-to-br from-poker-gold/20 to-poker-gold/10 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-white">
                            <Crown className="h-5 w-5 text-poker-gold" />
                            Tu Premio Demo
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-poker-gold mb-2">
                              {status?.status?.demo_prize?.name}
                            </p>
                            <p className="text-sm text-gray-300">
                              ¡Completa la validación para obtener tu giro real!
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instrucciones con diseño moderno */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <Info className="h-5 w-5" />
                      Cómo Jugar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { number: 1, title: "Giro Demo Gratis", desc: "Todos los usuarios nuevos tienen un giro demo", icon: Star },
                      { number: 2, title: "Validación", desc: "Completa tu perfil para obtener un giro real", icon: Clock },
                      { number: 3, title: "Códigos Bonus", desc: "Usa códigos promocionales para más giros", icon: Gift }
                    ].map((step) => (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: step.number * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-poker-green to-poker-darkGreen flex items-center justify-center text-white font-bold">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white flex items-center gap-2">
                            {step.title}
                            <step.icon className="h-4 w-4 text-poker-gold" />
                          </p>
                          <p className="text-sm text-gray-400">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Premios Destacados con nuevo diseño */}
                <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-poker-gold" />
                      Premios Destacados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { icon: "💰", name: "S/ 100 Cash", prob: "5%", color: "from-yellow-500 to-yellow-600" },
                        { icon: "🎁", name: "50% Bonus", prob: "15%", color: "from-purple-500 to-purple-600" },
                        { icon: "⭐", name: "Giro Extra", prob: "20%", color: "from-blue-500 to-blue-600" },
                        { icon: "🎯", name: "Puntos x2", prob: "25%", color: "from-green-500 to-green-600" }
                      ].map((prize, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 backdrop-blur-sm hover:bg-gray-700/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{prize.icon}</span>
                            <span className="text-sm font-medium text-white">{prize.name}</span>
                          </div>
                          <Badge className={`bg-gradient-to-r ${prize.color} text-white border-0`}>
                            {prize.prob}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Historial Tab */}
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
          onClose={() => setShowPrizeModal(false)}
          prize={lastPrize}
        />
      </div>

      {/* Debug Panel - Eliminar en producción */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-50"
        >
          <h3 className="font-bold mb-2">🐛 Debug Panel</h3>
          <div className="text-xs space-y-1">
            <p>Loading: {statusLoading ? '✅' : '❌'}</p>
            <p>Has Status: {status?.status ? '✅' : '❌'}</p>
            <p>Demo Available: {status?.status?.has_demo_available ? '✅' : '❌'}</p>
            <p>Real Available: {status?.status?.has_real_available ? '✅' : '❌'}</p>
            <p>Bonus Spins: {status?.status?.available_bonus_spins || 0}</p>
            <p>Can Spin: {canSpin ? '✅' : '❌'}</p>
            <p>Spin Type: {getSpinType() || 'none'}</p>
            <p>Is Validated: {status?.status?.is_validated ? '✅' : '❌'}</p>
            <p>Demo Done: {status?.status?.demo_spin_done ? '✅' : '❌'}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}