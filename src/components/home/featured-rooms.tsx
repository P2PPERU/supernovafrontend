'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, DollarSign, Zap, Trophy, Gift } from 'lucide-react';
import Link from 'next/link';

const rooms = [
  {
    id: 'x-poker',
    name: 'X-POKER',
    logo: '♠',
    color: 'from-purple-600 to-purple-800',
    bonus: 'Bono $1000',
    rakeback: '50% Rakeback',
    rating: 4.8,
    players: '2.3K',
    features: ['Torneos Premium', 'Soporte 24/7', 'Pagos Instantáneos'],
    badge: 'Mejor Rakeback',
    badgeColor: 'bg-purple-500',
  },
  {
    id: 'clubgg',
    name: 'CLUBGG',
    logo: '♣',
    color: 'from-black-600 to-black-800',
    bonus: 'Bono $800',
    rakeback: '40% Rakeback',
    rating: 4.7,
    players: '3.1K',
    features: ['Más Popular', 'Gran Variedad', 'Bonos Semanales'],
    badge: 'Más Popular',
    badgeColor: 'bg-red-500',
  },
  {
    id: 'pppoker',
    name: 'PPPOKER',
    logo: '♥',
    color: 'from-green-600 to-green-800',
    bonus: 'Bono $600',
    rakeback: '50% Rakeback',
    rating: 4.6,
    players: '1.8K',
    features: ['Mejor App', 'Torneos 24/7', 'Comunidad Activa'],
    badge: 'Mejor App',
    badgeColor: 'bg-green-500',
  },
  {
    id: 'wpt',
    name: 'WPT',
    logo: '♦',
    color: 'from-blue-600 to-blue-800',
    bonus: 'Bono $1200',
    rakeback: '20% Rakeback',
    rating: 4.9,
    players: '2.7K',
    features: ['Mejor Cash Game Premium', 'Eventos Exclusivos', 'Soporte VIP'],
    badge: 'Cash Game TOP',
    badgeColor: 'bg-blue-500',
  },
];

export function FeaturedRooms() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

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
              Juega en las mejores salas con bonos exclusivos y los mejores rakebacks del mercado
            </p>
          </motion.div>
        </div>

        {/* Rooms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <div className={`absolute inset-0 bg-gradient-to-br ${room.color} opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative glass rounded-xl p-6 h-full card-hover">
                {/* Badge */}
                <div className="absolute -top-3 -right-3">
                  <Badge className={`${room.badgeColor} text-white px-3 py-1`}>
                    {room.badge}
                  </Badge>
                </div>

                {/* Logo */}
                <div className={`text-6xl mb-4 bg-gradient-to-br ${room.color} bg-clip-text text-transparent`}>
                  {room.logo}
                </div>

                {/* Room name */}
                <h3 className="text-2xl font-bold mb-2">{room.name}</h3>

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
                    {room.players}
                  </span>
                </div>

                {/* Bonuses */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-gray-400">Bono</span>
                    <span className="font-semibold text-poker-green">{room.bonus}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-gray-400">Rakeback</span>
                    <span className="font-semibold text-poker-gold">{room.rakeback}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="h-4 w-4 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${room.color} hover:opacity-90 transition-all duration-300 btn-glow`}
                  asChild
                >
                  <Link href={`/room/${room.id}`}>
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

        {/* Promo banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-poker-green via-poker-blue to-poker-purple p-[2px]">
            <div className="relative bg-background rounded-2xl p-8 md:p-12">
              <div className="absolute top-0 right-0 opacity-10">
                <Trophy className="h-64 w-64" />
              </div>
              
              <div className="relative z-10 max-w-3xl">
                <Badge className="bg-poker-gold text-black mb-4">OFERTA LIMITADA</Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Bono de Bienvenida Exclusivo
                </h3>
                <p className="text-xl text-gray-400 mb-6">
                  Registrate ahora y recibe <span className="text-poker-green font-bold">giros gratis en nuestra ruleta</span> + 
                  <span className="text-poker-gold font-bold"> 50% rakeback</span> en tu primera sala
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-poker-green hover:bg-poker-darkGreen">
                    <Gift className="mr-2 h-5 w-5" />
                    Reclamar Bono
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}