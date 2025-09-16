'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, Users, Star, ArrowRight, Crown, Zap, Trophy, Gift, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFeaturedRooms, getRakebackDisplay } from '@/data/rooms-mock';
import Link from 'next/link';

export default function RoomsPage() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  
  // Array de símbolos de cartas
  const cards = ['♠', '♥', '♣', '♦'];
  
  // Efecto para rotar los símbolos de cartas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Obtener las salas directamente del mock (sin hooks complejos)
  const rooms = getFeaturedRooms();

  // Stats calculadas dinámicamente
  const totalPlayers = rooms.reduce((acc, room) => {
    const players = parseInt(room.activePlayers.replace(/[^0-9.]/g, '')) * (room.activePlayers.includes('K') ? 1000 : 1);
    return acc + players;
  }, 0);

  // Calculamos el rakeback máximo considerando los casos especiales
  const maxRakeback = Math.max(...rooms.map(room => {
    if (room.rakeback && room.rakeback.percentage > 0) {
      return room.rakeback.percentage;
    }
    return 0;
  }));

  const stats = [
    {
      icon: Gamepad2,
      label: 'Salas Premium',
      value: rooms.length,
      color: 'text-poker-green',
    },
    {
      icon: Users,
      label: 'Jugadores Online',
      value: `${Math.round(totalPlayers / 1000 * 10) / 10}K`,
      color: 'text-poker-blue',
    },
    {
      icon: Trophy,
      label: 'Rakeback Máximo',
      value: maxRakeback > 0 ? `${maxRakeback}%` : 'TRATO VIP',
      color: 'text-poker-gold',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1923] via-[#1a2332] to-[#0f1923]">
      {/* Hero Section con Fondo Animado de Cartas */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-[#1a2332] to-[#0f1923]">
        {/* Elementos de fondo animados - SÍMBOLOS DE CARTAS MONOCROMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Carta superior izquierda - responsiva */}
          <div className="absolute top-5 sm:top-10 left-[5%] text-[60px] sm:text-[80px] md:text-[120px] opacity-10 text-gray-400 floating">
            {cards[currentCard]}
          </div>
          
          {/* Carta inferior derecha - responsiva */}
          <div className="absolute bottom-8 sm:bottom-16 right-[10%] text-[50px] sm:text-[70px] md:text-[100px] opacity-10 text-gray-400 floating" style={{ animationDelay: '1s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          {/* Carta centro izquierda - oculta en móvil */}
          <div className="hidden sm:block absolute top-1/2 left-[15%] text-[60px] md:text-[90px] opacity-10 text-gray-400 floating" style={{ animationDelay: '2s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
          
          {/* Carta centro derecha - oculta en móvil */}
          <div className="hidden sm:block absolute top-1/3 right-[20%] text-[70px] md:text-[110px] opacity-10 text-gray-400 floating" style={{ animationDelay: '3s' }}>
            {cards[(currentCard + 3) % cards.length]}
          </div>
          
          {/* Cartas adicionales para más densidad - solo desktop */}
          <div className="hidden md:block absolute top-[70%] left-[40%] text-[80px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '1.5s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
          
          <div className="hidden md:block absolute top-[20%] right-[35%] text-[95px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '2.5s' }}>
            {cards[(currentCard + 2) % cards.length]}
          </div>
        </div>

        {/* Gradiente overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-blue-900/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4 sm:mb-6 bg-poker-green/20 text-poker-green border-poker-green/30 text-xs sm:text-sm">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              SALAS PREMIUM EXCLUSIVAS
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Las <span className="gradient-text">Mejores Salas</span> de Poker
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Acceso directo a las {rooms.length} salas más exclusivas con rakeback de hasta <span className="text-poker-green font-semibold">{maxRakeback > 0 ? `${maxRakeback}%` : 'TRATO VIP'}</span>, 
              giros diarios garantizados y beneficios VIP únicos.
            </p>

            {/* Stats responsivas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="glass p-4 sm:p-6 card-hover border border-white/10">
                      <Icon className={cn('h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3', stat.color)} />
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rooms Section con fondo sutil de cartas */}
      <section className="py-12 sm:py-16 relative bg-gradient-to-b from-[#0f1923] to-[#1a2332]">
        {/* Fondo sutil de cartas para la sección de salas - responsivo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hidden lg:block absolute top-[10%] left-[80%] text-[200px] opacity-[0.05] text-gray-500 rotating-slow">♠</div>
          <div className="hidden lg:block absolute bottom-[20%] left-[10%] text-[180px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '2s' }}>♥</div>
          <div className="hidden lg:block absolute top-[60%] right-[15%] text-[160px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '4s' }}>♣</div>
          <div className="hidden lg:block absolute top-[30%] left-[50%] text-[190px] opacity-[0.05] text-gray-500 rotating-slow" style={{ animationDelay: '6s' }}>♦</div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header responsivo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Elige tu sala <span className="gradient-text">perfecta</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Cada sala tiene características únicas. Acceso directo sin filtros innecesarios.
            </p>
          </motion.div>

          {/* Grid de salas responsivo - 1 columna móvil, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                className="relative group w-full max-w-md mx-auto md:max-w-none"
              >
                {/* Indicador popular - responsivo */}
                {room.order <= 1 && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-poker-green to-poker-blue text-white px-2 py-1 sm:px-3 sm:py-1 shadow-lg text-xs sm:text-sm">
                      <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      POPULAR
                    </Badge>
                  </div>
                )}

                {/* Efecto glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${room.gradientColors.from} ${room.gradientColors.to} opacity-0 group-hover:opacity-20 rounded-xl sm:rounded-2xl blur-xl transition-opacity duration-500`} />
                
                <div className="relative glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full card-hover border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  {/* Badge responsivo */}
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                    <Badge className={`${room.badgeColor} text-white px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium shadow-lg`}>
                      {room.badge}
                    </Badge>
                  </div>

                  {/* Logo y header responsivos */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 font-bold flex justify-center">
                      <img 
                        src={room.images.logo} 
                        alt={`${room.name} Logo`}
                        className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{room.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 px-2">{room.shortDescription}</p>
                  </div>

                  {/* Rating y jugadores responsivos */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(room.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-400">{room.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{room.activePlayers}</span>
                    </div>
                  </div>

                  {/* Beneficios destacados responsivos */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-poker-green/20 to-poker-green/10 border border-poker-green/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-poker-green">Rakeback</span>
                        <span className="font-bold text-poker-green text-sm sm:text-base lg:text-lg">{getRakebackDisplay(room)}</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-poker-gold/20 to-poker-gold/10 border border-poker-gold/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-poker-gold">Ruleta</span>
                        <span className="font-bold text-poker-gold text-sm sm:text-base">
                          {room.bonus?.specialOffers?.[0]?.includes('giros') 
                            ? room.bonus.specialOffers[0].split(' ')[0] + ' Giros'
                            : 'Giros Gratis'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-poker-purple/20 to-poker-purple/10 border border-poker-purple/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-poker-purple">Bono</span>
                        <span className="font-bold text-poker-purple text-sm sm:text-base">
                          {room.bonus?.welcome?.currency || 'S/'}1,000
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features principales responsivos */}
                  <div className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
                    {room.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-poker-green flex-shrink-0"></div>
                        <span className="truncate">{feature.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button responsivo */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${room.gradientColors.from} ${room.gradientColors.to} hover:opacity-90 transition-all duration-300 btn-glow text-sm sm:text-base lg:text-lg py-2 sm:py-3 h-auto shadow-lg`}
                    asChild
                  >
                    <Link href={`/rooms/${room.slug}`}>
                      <span className="hidden sm:inline">Acceder Ahora</span>
                      <span className="sm:hidden">Acceder</span>
                      <ArrowRight className={`ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform ${hoveredRoom === room.id ? 'translate-x-1' : ''}`} />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section responsivo */}
      <section className="py-12 sm:py-16 md:py-20 relative bg-gradient-to-b from-[#1a2332] to-[#0f1923]">
        {/* Fondo animado de cartas para CTA - responsivo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hidden sm:block absolute top-[5%] right-[10%] text-[60px] sm:text-[80px] md:text-[100px] opacity-[0.08] text-gray-400 floating">
            {cards[(currentCard + 3) % cards.length]}
          </div>
          <div className="hidden sm:block absolute bottom-[10%] left-[5%] text-[50px] sm:text-[70px] md:text-[90px] opacity-[0.08] text-gray-400 floating" style={{ animationDelay: '1.5s' }}>
            {cards[currentCard]}
          </div>
          <div className="hidden md:block absolute top-[50%] right-[45%] text-[80px] opacity-[0.06] text-gray-400 floating" style={{ animationDelay: '2.5s' }}>
            {cards[(currentCard + 1) % cards.length]}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass max-w-6xl mx-auto p-6 sm:p-8 md:p-12 border border-white/10">
              <div className="text-center mb-8 sm:mb-12">
                <Badge className="bg-poker-purple/20 text-poker-purple border-poker-purple/30 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  BENEFICIOS EXCLUSIVOS SUPERNOVA
                </Badge>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Acceso <span className="gradient-text">VIP</span> garantizado
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 px-4">
                  Como miembro de SUPERNOVA, disfrutas beneficios exclusivos en todas nuestras {rooms.length} salas premium.
                </p>
              </div>
              
              {/* Grid responsivo para beneficios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-4 sm:p-6 rounded-xl bg-white/5 text-center">
                  <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-poker-gold mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Rakeback Garantizado</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Hasta {maxRakeback > 0 ? `${maxRakeback}%` : 'TRATO VIP'} en todas las salas</p>
                </div>
                <div className="p-4 sm:p-6 rounded-xl bg-white/5 text-center">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-poker-green mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Soporte VIP</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Atención prioritaria 24/7</p>
                </div>
                <div className="p-4 sm:p-6 rounded-xl bg-white/5 text-center">
                  <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-poker-blue mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Acceso Inmediato</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Sin esperas ni restricciones</p>
                </div>
                <div className="p-4 sm:p-6 rounded-xl bg-white/5 text-center">
                  <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-poker-purple mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Bonos Máximos</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Hasta S/1,000 en cada sala</p>
                </div>
              </div>
              
              {/* Botones responsivos */}
              <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-poker-green to-poker-blue hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                    Registrarse Gratis
                  </Button>
                  <Button size="lg" variant="outline" className="border-poker-green/50 hover:bg-poker-green/10 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                    Comparar Salas
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4 px-4">Sin depósito mínimo • Rakeback desde el primer día • Soporte 24/7</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}