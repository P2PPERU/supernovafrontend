import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/types/rooms.types';
import { RoomRating } from './room-rating';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Users, DollarSign, Percent, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoomCardProps {
  room: Room;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function RoomCard({ room, variant = 'default', index = 0 }: RoomCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5 }}
      >
        <Card className="group cursor-pointer hover:shadow-xl transition-all">
          <Link href={`/rooms/${room.slug}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold',
                  'bg-gradient-to-br',
                  room.gradientColors.from,
                  room.gradientColors.to,
                  'text-white'
                )}>
                  {room.logo}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-poker-green transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {room.shortDescription}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Bono ${room.bonus.welcome.amount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      {room.rakeback.percentage}% RB
                    </span>
                  </div>
                </div>
                
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-poker-green transition-colors" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10 }}
      className={cn(
        'h-full',
        variant === 'featured' && 'md:col-span-2'
      )}
    >
      <Card className="h-full flex flex-col group hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Gradient Background */}
        <div className={cn(
          'absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br',
          room.gradientColors.from,
          room.gradientColors.to
        )} />
        
        <CardHeader className="relative">
          {/* Badges */}
          <div className="flex justify-between items-start mb-4">
            <Badge className={room.badgeColor}>
              {room.badge}
            </Badge>
            {room.featured && (
              <Badge className="bg-poker-gold text-black">
                ⭐ Destacado
              </Badge>
            )}
          </div>
          
          {/* Logo */}
          <div className={cn(
            'h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold',
            'bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform',
            room.gradientColors.from,
            room.gradientColors.to,
            'text-white'
          )}>
            {room.logo}
          </div>
          
          {/* Name & Rating */}
          <h3 className="text-2xl font-bold text-center mb-2 group-hover:text-poker-green transition-colors">
            {room.name}
          </h3>
          <div className="flex justify-center mb-2">
            <RoomRating 
              rating={room.rating} 
              totalReviews={room.totalReviews}
              size="md"
            />
          </div>
          
          {/* Active Players */}
          <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{room.activePlayers} jugadores activos</span>
          </div>
        </CardHeader>
        
        <CardContent className="relative flex-1">
          {/* Bonuses */}
          <div className="space-y-3 mb-6">
            <div className="p-3 rounded-lg bg-white/5 glass">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Bono</span>
                <span className="font-bold text-poker-green">
                  ${room.bonus.welcome.amount}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 glass">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Rakeback</span>
                <span className="font-bold text-poker-gold">
                  {room.rakeback.percentage}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-2 mb-6">
            {room.features.slice(0, 3).map((feature) => (
              <div key={feature.id} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-poker-green" />
                <span className="text-gray-300">{feature.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="relative">
          <Button 
            className={cn(
              'w-full bg-gradient-to-r hover:opacity-90 transition-all btn-glow',
              room.gradientColors.from,
              room.gradientColors.to
            )}
            asChild
          >
            <Link href={`/rooms/${room.slug}`}>
              Ver Detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}