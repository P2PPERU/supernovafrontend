import { Room } from '@/types/rooms.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Gift, DollarSign, Percent, Calendar, Star, Zap, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomBenefitsProps {
  room: Room;
}

export function RoomBenefits({ room }: RoomBenefitsProps) {
  const benefits = [
    {
      icon: Gift,
      title: 'Bono de Bienvenida',
      value: `$${room.bonus.welcome.amount}`,
      description: room.bonus.welcome.description,
      color: 'from-poker-green to-green-600',
      featured: true,
    },
    {
      icon: Percent,
      title: 'Rakeback',
      value: `${room.rakeback.percentage}%`,
      description: room.rakeback.description,
      color: 'from-poker-gold to-yellow-600',
      featured: true,
    },
    {
      icon: DollarSign,
      title: 'Bono de Depósito',
      value: room.bonus.deposit ? `${room.bonus.deposit.percentage}%` : 'N/A',
      description: room.bonus.deposit 
        ? `Hasta $${room.bonus.deposit.maxAmount} en tu depósito`
        : 'No disponible',
      color: 'from-poker-blue to-blue-600',
    },
    {
      icon: Calendar,
      title: 'Bono de Recarga',
      value: room.bonus.reload ? `${room.bonus.reload.percentage}%` : 'N/A',
      description: room.bonus.reload 
        ? `Frecuencia: ${room.bonus.reload.frequency}`
        : 'No disponible',
      color: 'from-poker-purple to-purple-600',
    },
  ];

  if (room.bonus.noDeposit) {
    benefits.push({
      icon: Star,
      title: 'Bono Sin Depósito',
      value: `$${room.bonus.noDeposit.amount}`,
      description: room.bonus.noDeposit.description,
      color: 'from-poker-red to-red-600',
      featured: true,
    });
  }

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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">
            <Award className="h-3 w-3 mr-1" />
            Beneficios Exclusivos
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Maximiza tus <span className="gradient-text">Ganancias</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Aprovecha todos los beneficios que {room.name} tiene para ti
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className={cn(
                  'relative',
                  benefit.featured && 'md:col-span-1',
                  index === 0 && 'lg:col-span-1'
                )}
              >
                <Card className={cn(
                  'h-full overflow-hidden group hover:shadow-2xl transition-all',
                  benefit.featured && 'ring-2 ring-poker-gold'
                )}>
                  {benefit.featured && (
                    <div className="absolute top-0 right-0 bg-poker-gold text-black px-3 py-1 text-xs font-bold rounded-bl-lg">
                      DESTACADO
                    </div>
                  )}
                  
                  <div className={cn(
                    'absolute inset-0 opacity-10 bg-gradient-to-br',
                    benefit.color
                  )} />
                  
                  <CardHeader className="relative">
                    <div className={cn(
                      'inline-flex p-3 rounded-xl bg-gradient-to-br mb-4',
                      benefit.color
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="text-3xl font-bold mb-3">
                      {benefit.value}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Special Offers */}
        {room.bonus.specialOffers && room.bonus.specialOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-poker-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-poker-gold" />
                  Ofertas Especiales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {room.bonus.specialOffers.map((offer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-poker-gold/20 flex items-center justify-center flex-shrink-0">
                          <Star className="h-4 w-4 text-poker-gold" />
                        </div>
                        <p className="text-sm">{offer}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Rakeback Tiers */}
        {room.rakeback.tiers && room.rakeback.tiers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-poker-green" />
                  Sistema de Rakeback Progresivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {room.rakeback.tiers.map((tier, index) => (
                    <div
                      key={tier.level}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'h-12 w-12 rounded-full flex items-center justify-center font-bold',
                          'bg-gradient-to-br',
                          index === 0 && 'from-amber-600 to-amber-700',
                          index === 1 && 'from-gray-400 to-gray-500',
                          index === 2 && 'from-yellow-500 to-yellow-600',
                          index === 3 && 'from-purple-500 to-purple-600'
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{tier.level}</h4>
                          <p className="text-sm text-gray-400">{tier.requirements}</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-poker-green">
                        {tier.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}