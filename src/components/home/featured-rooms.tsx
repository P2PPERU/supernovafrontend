'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, Crown, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedRooms } from '@/data/rooms-mock';

export function FeaturedRooms() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  
  // Obtener las salas del mock
  const rooms = getFeaturedRooms();

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Salas de Poker <span className="gradient-text">Destacadas</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Juega en las mejores salas con los mejores rakebacks del mercado y giros exclusivos en nuestra ruleta
            </p>
          </motion.div>
        </div>

        {/* Rooms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${room.gradientColors.from} ${room.gradientColors.to} opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative glass rounded-xl p-6 h-full card-hover">
                {/* Badge */}
                <div className="absolute -top-3 -right-3">
                  <Badge className={`${room.badgeColor} text-white px-3 py-1`}>
                    {room.badge}
                  </Badge>
                </div>

                {/* Logo */}
                <div className="text-5xl mb-4 font-bold flex justify-center">
                  <img 
                    src={room.images.logo} 
                    alt={`${room.name} Logo`}
                    className="h-16 w-16 object-contain"
                  />
                </div>

                {/* Room name */}
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(room.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{room.rating}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {room.activePlayers}
                  </span>
                </div>

                {/* Rakeback y Giros */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-gray-400">Rakeback</span>
                    <span className="font-semibold text-poker-green">{room.rakeback.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-gray-400">Ruleta</span>
                    <span className="font-semibold text-poker-gold">
                      {room.bonus?.specialOffers?.[0]?.includes('giros') 
                        ? room.bonus.specialOffers[0].split(' ')[0] + ' Giros'
                        : '5 Giros'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {room.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="h-4 w-4 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.title}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${room.gradientColors.from} ${room.gradientColors.to} hover:opacity-90 transition-all duration-300 btn-glow`}
                  asChild
                >
                  <Link href={`/rooms/${room.slug}`}>
                    Jugar Ahora
                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${hoveredRoom === room.id ? 'translate-x-1' : ''}`} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" className="glass border-poker-green/50 hover:bg-poker-green/10" asChild>
            <Link href="/rooms">
              Ver Todas las Salas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}