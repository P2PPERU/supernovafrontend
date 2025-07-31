'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Trophy, Users, DollarSign, RefreshCw } from 'lucide-react';

interface LiveUpdate {
  id: string;
  type: 'tournament' | 'winner' | 'registration' | 'prize';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
  color: string;
}

// Simulated live updates - en producción vendría del backend
const generateMockUpdate = (): LiveUpdate => {
  const types = [
    {
      type: 'tournament' as const,
      icon: Trophy,
      color: 'text-poker-gold',
      titles: [
        'Nuevo torneo iniciado',
        'Torneo en fase final',
        'Mesa final en progreso'
      ],
      descriptions: [
        'WSOP Daily $500 - 342 jugadores registrados',
        'Main Event - Quedan 9 jugadores',
        'Sunday Million - Premio: $1.2M'
      ]
    },
    {
      type: 'winner' as const,
      icon: Zap,
      color: 'text-poker-green',
      titles: [
        'Nuevo campeón',
        'Victoria épica',
        'Ganador del torneo'
      ],
      descriptions: [
        'JohnDoe123 gana $50,000 en el Main Event',
        'MariaPoker se lleva el Sunday Special',
        'ProPlayer99 campeón del High Roller'
      ]
    },
    {
      type: 'registration' as const,
      icon: Users,
      color: 'text-blue-500',
      titles: [
        'Registros abiertos',
        'Últimos cupos',
        'Nuevo torneo disponible'
      ],
      descriptions: [
        'Turbo Tuesday - Buy-in: $100',
        'Quedan 50 lugares para el Main Event',
        'Freeroll exclusivo para VIP'
      ]
    },
    {
      type: 'prize' as const,
      icon: DollarSign,
      color: 'text-yellow-500',
      titles: [
        'Premio garantizado aumentado',
        'Jackpot acumulado',
        'Bono especial activado'
      ],
      descriptions: [
        'Main Event ahora garantiza $2M',
        'Bad Beat Jackpot: $500,000',
        '50% rakeback este fin de semana'
      ]
    }
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomTitle = randomType.titles[Math.floor(Math.random() * randomType.titles.length)];
  const randomDescription = randomType.descriptions[Math.floor(Math.random() * randomType.descriptions.length)];

  return {
    id: Date.now().toString(),
    type: randomType.type,
    title: randomTitle,
    description: randomDescription,
    timestamp: new Date(),
    icon: randomType.icon,
    color: randomType.color
  };
};

export function LiveUpdatesWidget() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Generar actualizaciones iniciales
    const initialUpdates = Array.from({ length: 3 }, () => generateMockUpdate());
    setUpdates(initialUpdates);

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      if (isLive) {
        setUpdates(prev => {
          const newUpdate = generateMockUpdate();
          return [newUpdate, ...prev].slice(0, 5); // Mantener máximo 5 actualizaciones
        });
      }
    }, 8000); // Nueva actualización cada 8 segundos

    return () => clearInterval(interval);
  }, [isLive]);

  const handleRefresh = () => {
    const newUpdates = Array.from({ length: 3 }, () => generateMockUpdate());
    setUpdates(newUpdates);
  };

  return (
    <Card className="glass border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-poker-red" />
            Actualizaciones en Vivo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isLive ? "default" : "outline"}
              className={isLive ? "bg-red-500 text-white animate-pulse" : ""}
            >
              {isLive ? 'EN VIVO' : 'PAUSADO'}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {updates.map((update, index) => {
              const Icon = update.icon;
              return (
                <motion.div
                  key={update.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg bg-white/10 ${update.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{update.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {update.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(update.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 glass border-white/20"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? 'Pausar actualizaciones' : 'Reanudar actualizaciones'}
        </Button>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 30) return 'ahora mismo';
  if (seconds < 60) return `hace ${seconds} segundos`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  return `hace ${hours} horas`;
}