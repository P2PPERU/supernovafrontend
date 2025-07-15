'use client';

import { useState } from 'react';
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
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  History, 
  Info, 
  Coins,
  Trophy,
  Zap,
  Code2
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
  const { data: status, isLoading: statusLoading } = useRouletteStatus();
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
      
      // Esperar a que termine la animación (5 segundos)
      setTimeout(() => {
        setIsSpinning(false);
        setLastPrize(result.spin);
        setShowPrizeModal(true);
      }, 5000);
    } catch (error) {
      setIsSpinning(false);
    }
  };

  const canSpin = status?.status?.hasDemoAvailable || status?.status?.hasRealAvailable || ((status?.status?.availableBonusSpins ?? 0) > 0);
  
  const getSpinType = () => {
    if (status?.status?.hasRealAvailable) return 'real';
    if (status?.status?.hasDemoAvailable) return 'demo';
    if ((status?.status?.availableBonusSpins ?? 0) > 0) return 'bonus';
    return null;
  };

  const spinType = getSpinType();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-poker-gold" />
              Ruleta de Premios
            </h1>
            <p className="text-muted-foreground mt-2">
              ¡Gira la ruleta y gana premios increíbles!
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowCodeModal(true)}
          >
            <Code2 className="mr-2 h-4 w-4" />
            Ingresar Código
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold">S/ {user?.balance || 0}</p>
                </div>
                <Coins className="h-8 w-8 text-poker-gold opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Giros Disponibles</p>
                  <div className="flex items-center gap-2 mt-1">
                    {status?.status?.hasDemoAvailable && (
                      <Badge variant="secondary">Demo</Badge>
                    )}
                    {status?.status?.hasRealAvailable && (
                      <Badge className="bg-poker-green">Real</Badge>
                    )}
                    {(status?.status?.availableBonusSpins ?? 0) > 0 && (
                      <Badge className="bg-poker-gold text-black">
                        Bonus x{status?.status?.availableBonusSpins ?? 0}
                      </Badge>
                    )}
                    {!canSpin && (
                      <Badge variant="outline">Sin giros</Badge>
                    )}
                  </div>
                </div>
                <Gift className="h-8 w-8 text-poker-green opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Giros</p>
                  <p className="text-2xl font-bold">{status?.status?.totalSpins || 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-poker-red opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wheel" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Ruleta
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Ruleta Tab */}
        <TabsContent value="wheel" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ruleta */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-poker-darkGreen to-poker-green p-8">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                      <RouletteWheel
                        isSpinning={isSpinning}
                        onSpinComplete={() => {}}
                        lastPrize={lastPrize}
                      />
                      
                      {/* Spin Button */}
                      <div className="mt-8 text-center">
                        <Button
                          size="lg"
                          onClick={handleSpin}
                          disabled={!canSpin || isSpinning || spinMutation.isPending}
                          className={`
                            min-w-[200px] h-14 text-lg font-bold
                            ${spinType === 'real' ? 'bg-poker-gold hover:bg-poker-gold/90 text-black' : ''}
                            ${spinType === 'bonus' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                          `}
                        >
                          {isSpinning ? (
                            <>
                              <Zap className="mr-2 h-5 w-5 animate-pulse" />
                              Girando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-5 w-5" />
                              {spinType === 'demo' && 'Girar (Demo)'}
                              {spinType === 'real' && 'Girar (Real)'}
                              {spinType === 'bonus' && 'Girar (Bonus)'}
                              {!spinType && 'Sin Giros'}
                            </>
                          )}
                        </Button>
                        
                        {canSpin && (
                          <p className="text-sm text-white/80 mt-2">
                            {spinType === 'demo' && 'Este es un giro de demostración'}
                            {spinType === 'real' && '¡Giro real con premios reales!'}
                            {spinType === 'bonus' && `Tienes ${status?.status?.availableBonusSpins ?? 0} giros bonus`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Premio Demo */}
              {status?.status?.demoPrize && !status?.status?.isValidated && (
                <Card className="border-poker-gold">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-poker-gold" />
                      Tu Premio Demo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-poker-gold">
                        {status?.status?.demoPrize?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        ¡Completa la validación para obtener tu giro real!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Instrucciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Cómo Jugar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poker-green/20 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Giro Demo Gratis</p>
                      <p className="text-sm text-muted-foreground">
                        Todos los usuarios nuevos tienen un giro demo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poker-green/20 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Validación</p>
                      <p className="text-sm text-muted-foreground">
                        Completa tu perfil para obtener un giro real
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poker-green/20 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Códigos Bonus</p>
                      <p className="text-sm text-muted-foreground">
                        Usa códigos promocionales para más giros
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premios Destacados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Premios Destacados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 S/ 100 Cash</span>
                      <Badge variant="outline">5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🎁 50% Bonus</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">⭐ Giro Extra</span>
                      <Badge variant="outline">20%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">🎯 Puntos x2</span>
                      <Badge variant="outline">25%</Badge>
                    </div>
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
  );
}