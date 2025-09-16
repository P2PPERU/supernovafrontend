'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedRooms, getRakebackDisplay } from '@/data/rooms-mock';

export function FeaturedRooms() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Obtener las salas del mock
  const rooms = getFeaturedRooms();

  // Configuración responsiva - Inicializamos con un valor fijo para evitar hidratación
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);

  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    if (window.innerWidth < 1280) return 4;
    return 5;
  };

  useEffect(() => {
    // Marcamos que estamos en el cliente
    setIsClient(true);
    
    // Actualizamos el valor inicial
    setItemsPerView(getItemsPerView());

    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, rooms.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, rooms.length, itemsPerView]);

  const maxIndex = Math.max(0, rooms.length - itemsPerView);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

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
              Juega en las mejores salas con el mejor Rakeback del mercado y giros exclusivos en nuestra ruleta
            </p>
          </motion.div>
        </div>

        {/* Carousel Container - Aumentamos padding y agregamos espacio extra */}
        <div className="relative mb-12 px-8">
          {/* Navigation Buttons - Solo renderizamos si estamos en el cliente */}
          {isClient && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5 text-white group-hover:text-poker-green transition-colors" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-5 w-5 text-white group-hover:text-poker-green transition-colors" />
              </button>
            </>
          )}

          {/* Carousel - Removemos overflow hidden y agregamos padding superior */}
          <div className="relative pt-8 pb-4" ref={carouselRef}>
            <motion.div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => {
                    setHoveredRoom(room.id);
                    setIsAutoPlaying(false);
                  }}
                  onMouseLeave={() => {
                    setHoveredRoom(null);
                    setIsAutoPlaying(true);
                  }}
                >
                  <div className="relative group h-full">
                    {/* Gradient background blur */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${room.gradientColors.from} ${room.gradientColors.to} opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity`} />
                    
                    {/* Main card container - Agregamos overflow visible */}
                    <div className="relative glass rounded-xl p-4 sm:p-6 h-full card-hover overflow-visible">
                      {/* Badge - Aumentamos el z-index para que sobresalga */}
                      <div className="absolute -top-3 -right-3 z-20">
                        <Badge className={`${room.badgeColor} text-white px-2 py-1 text-xs sm:px-3 sm:text-sm shadow-lg`}>
                          {room.badge}
                        </Badge>
                      </div>

                      {/* Logo */}
                      <div className="text-5xl mb-4 font-bold flex justify-center">
                        <img 
                          src={room.images.logo} 
                          alt={`${room.name} Logo`}
                          className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                        />
                      </div>

                      {/* Room name */}
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">{room.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(room.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400">{room.rating}</span>
                        <span className="text-xs sm:text-sm text-gray-500">•</span>
                        <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="hidden sm:inline">{room.activePlayers}</span>
                          <span className="sm:hidden">{room.activePlayers.split(' ')[0]}</span>
                        </span>
                      </div>

                      {/* Rakeback y Giros */}
                      <div className="space-y-2 mb-4 sm:mb-6">
                        <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5">
                          <span className="text-xs sm:text-sm text-gray-400">Rakeback</span>
                          <span className="font-semibold text-poker-green text-sm sm:text-base">{getRakebackDisplay(room)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5">
                          <span className="text-xs sm:text-sm text-gray-400">Ruleta</span>
                          <span className="font-semibold text-poker-gold text-sm sm:text-base">
                            {room.bonus?.specialOffers?.[0]?.includes('giros') 
                              ? room.bonus.specialOffers[0].split(' ')[0] + ' Giros'
                              : 'Giros Gratis'}
                          </span>
                        </div>
                      </div>

                      {/* Features - Solo en pantallas grandes */}
                      <div className="hidden lg:block space-y-2 mb-6">
                        {room.features.slice(0, 2).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <svg className="h-4 w-4 text-poker-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="truncate">{feature.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${room.gradientColors.from} ${room.gradientColors.to} hover:opacity-90 transition-all duration-300 btn-glow text-sm sm:text-base py-2 sm:py-3`}
                        asChild
                      >
                        <Link href={`/rooms/${room.slug}`}>
                          <span className="hidden sm:inline">Jugar Ahora</span>
                          <span className="sm:hidden">Jugar</span>
                          <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${hoveredRoom === room.id ? 'translate-x-1' : ''}`} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots - Solo renderizamos si estamos en el cliente */}
          {isClient && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-poker-green scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
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