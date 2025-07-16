'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Gift, 
  Coins,
  Zap,
  Star,
  Crown,
  Diamond,
  Sparkles
} from 'lucide-react';

interface Prize {
  id: number;
  name: string;
  shortName: string;
  value: number;
  probability: number;
  icon: string;
  color: string;
  type: 'cash' | 'bonus' | 'points' | 'spin' | 'special';
}

const PREMIUM_PRIZES: Prize[] = [
  {
    id: 1,
    name: "Gran Premio S/ 200",
    shortName: "S/ 200",
    value: 200,
    probability: 3,
    icon: "🏆",
    color: "#FFD700",
    type: 'cash'
  },
  {
    id: 2,
    name: "Premio Mayor S/ 100",
    shortName: "S/ 100",
    value: 100,
    probability: 5,
    icon: "💰",
    color: "#FFA500",
    type: 'cash'
  },
  {
    id: 3,
    name: "50% Bonus",
    shortName: "50%",
    value: 0,
    probability: 15,
    icon: "🎁",
    color: "#95E1D3",
    type: 'bonus'
  },
  {
    id: 4,
    name: "Puntos Dobles",
    shortName: "x2",
    value: 0,
    probability: 25,
    icon: "⭐",
    color: "#C7CEEA",
    type: 'points'
  },
  {
    id: 5,
    name: "Giro Extra Premium",
    shortName: "SPIN+",
    value: 0,
    probability: 20,
    icon: "🎯",
    color: "#4ECDC4",
    type: 'spin'
  },
  {
    id: 6,
    name: "S/ 50 Instantáneo",
    shortName: "S/ 50",
    value: 50,
    probability: 10,
    icon: "💵",
    color: "#FF6B6B",
    type: 'cash'
  },
  {
    id: 7,
    name: "S/ 20 Rápido",
    shortName: "S/ 20",
    value: 20,
    probability: 20,
    icon: "💸",
    color: "#A8E6CF",
    type: 'cash'
  },
  {
    id: 8,
    name: "Premio Especial",
    shortName: "???",
    value: 0,
    probability: 2,
    icon: "🎌",
    color: "#DDA0DD",
    type: 'special'
  }
];

const getIconComponent = (type: string) => {
  switch (type) {
    case 'cash':
      return Coins;
    case 'bonus':
      return Gift;
    case 'points':
      return Star;
    case 'spin':
      return Zap;
    case 'special':
      return Diamond;
    default:
      return Trophy;
  }
};

const getRarityColor = (probability: number) => {
  if (probability <= 3) return 'from-yellow-400 to-orange-600'; // Legendario
  if (probability <= 5) return 'from-purple-400 to-purple-600'; // Épico
  if (probability <= 15) return 'from-blue-400 to-blue-600'; // Raro
  return 'from-gray-400 to-gray-600'; // Común
};

const getRarityLabel = (probability: number) => {
  if (probability <= 3) return 'Legendario';
  if (probability <= 5) return 'Épico';
  if (probability <= 15) return 'Raro';
  return 'Común';
};

export function PremiumPrizesDisplay() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Crown className="h-10 w-10 text-poker-gold" />
          Tabla de Premios Premium
          <Crown className="h-10 w-10 text-poker-gold" />
        </h2>
        <p className="text-gray-400 text-lg">
          Descubre todos los increíbles premios que puedes ganar
        </p>
      </motion.div>

      {/* Grid de Premios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PREMIUM_PRIZES.map((prize, index) => {
          const Icon = getIconComponent(prize.type);
          const rarityColor = getRarityColor(prize.probability);
          const rarityLabel = getRarityLabel(prize.probability);
          
          return (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Efecto de rareza */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColor}`} />
                
                {/* Badge de rareza */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge className={`bg-gradient-to-r ${rarityColor} text-white border-0 text-xs`}>
                    {rarityLabel}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  {/* Icono del premio */}
                  <div className="relative mb-4">
                    <div 
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: prize.color + '20' }}
                    >
                      {prize.icon}
                    </div>
                    {/* Efecto de brillo */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: prize.color + '30' }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Información del premio */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {prize.name}
                    </h3>
                    
                    {prize.value > 0 && (
                      <p className="text-2xl font-bold text-poker-gold mb-2">
                        S/ {prize.value}
                      </p>
                    )}
                    
                    {/* Probabilidad */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {prize.probability}% probabilidad
                      </span>
                    </div>
                  </div>
                  
                  {/* Efectos visuales adicionales para premios especiales */}
                  {prize.probability <= 5 && (
                    <div className="absolute -top-4 -right-4">
                      <Sparkles className="h-8 w-8 text-poker-gold opacity-50 animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Estadísticas generales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-poker-gold mx-auto mb-2" />
            <p className="text-sm text-gray-400">Premio Mayor</p>
            <p className="text-2xl font-bold text-white">S/ 200</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Coins className="h-8 w-8 text-poker-green mx-auto mb-2" />
            <p className="text-sm text-gray-400">Total en Premios</p>
            <p className="text-2xl font-bold text-white">S/ 370+</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Tipos de Premios</p>
            <p className="text-2xl font-bold text-white">8 Únicos</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PremiumPrizesDisplay;