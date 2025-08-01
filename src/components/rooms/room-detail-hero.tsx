import { Room } from '@/types/rooms.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomRating } from './room-rating';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Trophy, Gift, Shield, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface RoomDetailHeroProps {
  room: Room;
}

export function RoomDetailHero({ room }: RoomDetailHeroProps) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden">
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-20',
        room.gradientColors.from,
        room.gradientColors.to
      )} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/poker-pattern.svg')] opacity-5" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={room.badgeColor}>
                {room.badge}
              </Badge>
              {room.featured && (
                <Badge className="bg-poker-gold text-black">
                  ⭐ Sala Destacada
                </Badge>
              )}
              <Badge variant="outline" className="glass border-white/20">
                <Users className="h-3 w-3 mr-1" />
                {room.activePlayers} jugadores activos
              </Badge>
            </div>
            
            {/* Logo & Title */}
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className={cn(
                  'h-24 w-24 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl',
                  'bg-gradient-to-br',
                  room.gradientColors.from,
                  room.gradientColors.to,
                  'text-white'
                )}
              >
                {room.logo}
              </motion.div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {room.name}
                </h1>
                <RoomRating 
                  rating={room.rating} 
                  totalReviews={room.totalReviews}
                  size="lg"
                />
              </div>
            </div>
            
            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed">
              {room.description}
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-poker-green mb-1">
                  ${room.bonus.welcome.amount}
                </div>
                <div className="text-sm text-gray-400">Bono de Bienvenida</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-poker-gold mb-1">
                  {room.rakeback.percentage}%
                </div>
                <div className="text-sm text-gray-400">Rakeback</div>
              </motion.div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg"
                className={cn(
                  'bg-gradient-to-r hover:opacity-90 btn-glow',
                  room.gradientColors.from,
                  room.gradientColors.to
                )}
              >
                Jugar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="glass border-white/20"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Visitar Sitio Web
              </Button>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              {room.images.hero ? (
                <Image
                  src={room.images.hero}
                  alt={room.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className={cn(
                  'h-full flex items-center justify-center bg-gradient-to-br',
                  room.gradientColors.from,
                  room.gradientColors.to
                )}>
                  <div className="text-white/20 text-[200px] font-bold">
                    {room.logo}
                  </div>
                </div>
              )}
              
              {/* Floating badges */}
              <div className="absolute top-4 right-4 space-y-2">
                <Badge className="glass backdrop-blur-sm bg-black/50 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top Rated
                </Badge>
                <Badge className="glass backdrop-blur-sm bg-black/50 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Licencia Verificada
                </Badge>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-poker-gold/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-poker-green/20 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}