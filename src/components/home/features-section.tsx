'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Gamepad2, Percent, Shield, Users, Zap, DollarSign, Headphones, TrendingUp, Clock, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const features = [
  {
    title: 'Torneos GTD',
    description: 'Torneos con premios garantizados desde S/500 hasta S/1M. Stack inicial de 20K chips.',
    icon: Trophy,
    color: 'from-amber-500 to-orange-600',
    highlight: 'Garantizados 24/7',
    stats: 'S/8M+ en premios mensuales',
    pokerTerm: 'GTD Tournament',
  },
  {
    title: 'Ruleta Supernova',
    description: 'Ruleta de premios por tu depositos.',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-600',
    highlight: 'Giros diarios',
    stats: 'Gana premios extras',
    pokerTerm: 'Ruleta regalona',
  },
  {
    title: 'Rakeback VIP',
    description: 'El rakeback más alto del Perú. Pago automático cada lunes directo a tu bankroll.',
    icon: Percent,
    color: 'from-purple-500 to-pink-600',
    highlight: 'Trato vip de rakeback',
    stats: 'Pago cada lunes',
    pokerTerm: 'VIP Program',
  },
  {
    title: 'RNG Certificado',
    description: 'Generador certificado por iTech Labs. Protección anti-bots y manos auditadas 24/7.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-600',
    highlight: 'iTech Labs Certified',
    stats: '0% bots detectados',
    pokerTerm: 'Fair Play Guarantee',
  },
  {
    title: 'Fish Ecosystem',
    description: 'Si eres un regular tenemos las mesas con mas recreacionales del mercado.',
    icon: Users,
    color: 'from-indigo-500 to-purple-600',
    highlight: '3K+ fish online',
    stats: '60% jugadores recreativos',
    pokerTerm: 'Table Selection',
  },
  {
    title: 'Cashout Express',
    description: 'Retiros instantáneos 24/7. BCP, Interbank, Yape, Plin y criptomonedas disponibles.',
    icon: DollarSign,
    color: 'from-green-500 to-teal-600',
    highlight: 'Retiros < 5 minutos',
    stats: 'S/50K límite diario',
    pokerTerm: 'Instant Withdrawal',
  },
  {
    title: 'Soporte Pro',
    description: 'Team de soporte especializado en poker. Resuelven dudas de hand history y reglas.',
    icon: Headphones,
    color: 'from-red-500 to-rose-600',
    highlight: 'Respuesta < 2 min',
    stats: '24/7 chat en vivo',
    pokerTerm: 'Poker Support',
  },
  {
    title: 'HUD VIP',
    description: 'Te damos las mejores herramientas para que puedas ganar en las mesas.',
    icon: Zap,
    color: 'from-yellow-500 to-amber-600',
    highlight: 'HUD permitido',
    stats: 'VIP HUD',
    pokerTerm: 'Tracking Software',
  },
];

const stats = [
  {
    icon: Trophy,
    value: '500+',
    label: 'Torneos Mensuales',
    color: 'text-poker-gold',
    subText: 'GTD desde S/500',
  },
  {
    icon: Users,
    value: '8K+',
    label: 'Jugadores Activos',
    color: 'text-poker-green',
    subText: '2,500 simultáneos',
  },
  {
    icon: DollarSign,
    value: 'S/8M+',
    label: 'Premios Mensuales',
    color: 'text-green-500',
    subText: 'Récord: S/12M en Dic',
  },
  {
    icon: Percent,
    value: 'Acuerdo VIP en privado',
    label: 'Rakeback Máximo',
    color: 'text-poker-purple',
    subText: 'Pago semanal',
  },
];

const badges = [
  { text: 'No Bots', color: 'bg-green-500' },
  { text: 'Fair RNG', color: 'bg-blue-500' },
  { text: 'HUD OK', color: 'bg-purple-500' },
  { text: '24/7 Support', color: 'bg-orange-500' },
];

export function FeaturesSection() {
  const [currentCard, setCurrentCard] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  
  const cards = ['♠', '♥', '♣', '♦'];
  const pokerCards = ['A♠', 'K♥', 'Q♣', 'J♦', '10♠', '9♥'];
  const totalSlides = Math.ceil(features.length / itemsPerSlide);

  // Configurar items por slide según el tamaño de pantalla
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1280) setItemsPerSlide(4); // xl
      else if (window.innerWidth >= 1024) setItemsPerSlide(3); // lg
      else if (window.innerWidth >= 640) setItemsPerSlide(2); // sm
      else setItemsPerSlide(1); // mobile
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    setIsClient(true);
    
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  // Animación de cartas de poker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide (pausado durante interacción)
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(features.length / itemsPerSlide));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isDragging, itemsPerSlide]);

  // Funciones de navegación
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(features.length / itemsPerSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(features.length / itemsPerSlide)) % Math.ceil(features.length / itemsPerSlide));
  };

  // Manejo táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    
    setIsDragging(false);
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 relative animated-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl opacity-5 floating text-poker-green">
          {cards[currentCard]}
        </div>
        <div className="absolute bottom-16 right-2 text-3xl sm:text-5xl md:text-6xl lg:text-7xl opacity-5 floating text-poker-purple" style={{ animationDelay: '1s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        <div className="absolute top-1/4 left-1/4 text-xl sm:text-3xl md:text-4xl lg:text-5xl opacity-5 floating text-poker-gold" style={{ animationDelay: '2s' }}>
          {cards[(currentCard + 2) % cards.length]}
        </div>
        <div className="absolute top-2/3 right-1/4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl opacity-5 floating text-poker-blue" style={{ animationDelay: '3s' }}>
          {cards[(currentCard + 3) % cards.length]}
        </div>
        
        <div className="absolute bottom-8 left-1/4 text-xl sm:text-3xl md:text-4xl lg:text-5xl opacity-5 floating text-green-500" style={{ animationDelay: '0.5s' }}>
          {pokerCards[currentCard]}
        </div>
        <div className="absolute top-12 right-1/5 text-2xl sm:text-4xl md:text-5xl lg:text-6xl opacity-5 floating text-yellow-500" style={{ animationDelay: '2.5s' }}>
          {pokerCards[(currentCard + 1) % pokerCards.length]}
        </div>
        
        <div className="absolute top-1/4 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-poker-green/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-28 h-28 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-poker-purple/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-poker-gold/5 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
        >
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {isClient && badges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${badge.color} text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg`}
              >
                {badge.text}
              </motion.div>
            ))}
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
            ¿Por qué elegir <span className="gradient-text">SUPERNOVA</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed px-2">
            La sala de poker online #1 del Perú. Diseñada por jugadores profesionales para maximizar tus ganancias.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative mb-8 sm:mb-12 lg:mb-20">
          {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300 backdrop-blur-sm"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300 backdrop-blur-sm"
            disabled={currentSlide === Math.ceil(features.length / itemsPerSlide) - 1}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Carousel Content */}
          <div className="relative overflow-hidden">
            <div 
              className="touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="flex"
                animate={{
                  x: `-${currentSlide * (100 / Math.ceil(features.length / itemsPerSlide))}%`
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={{ 
                  width: `${Math.ceil(features.length / itemsPerSlide) * 100}%`,
                  minHeight: '400px'
                }}
              >
                {Array.from({ length: Math.ceil(features.length / itemsPerSlide) }).map((_, slideIndex) => (
                  <div 
                    key={slideIndex}
                    className="flex-shrink-0 px-2 sm:px-4"
                    style={{ 
                      width: `${100 / Math.ceil(features.length / itemsPerSlide)}%`,
                      minHeight: '400px'
                    }}
                  >
                    <div className={`grid gap-3 sm:gap-4 md:gap-6 h-full ${
                      itemsPerSlide === 1 ? 'grid-cols-1' :
                      itemsPerSlide === 2 ? 'grid-cols-2' :
                      itemsPerSlide === 3 ? 'grid-cols-3' : 'grid-cols-4'
                    }`}>
                      {features.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={`${slideIndex}-${feature.title}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className="group h-full"
                          >
                            <Card className="glass h-full p-3 sm:p-4 md:p-6 card-hover border-0 relative overflow-hidden bg-white/5 backdrop-blur-sm">
                              <div className="absolute top-2 right-2 opacity-20 hidden xs:block">
                                <span className="text-xs text-gray-500">{feature.pokerTerm}</span>
                              </div>
                              
                              <div className="mb-3 sm:mb-4">
                                <div className={`inline-flex p-2 sm:p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 group-hover:scale-110 transition-all duration-300`}>
                                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                                </div>
                              </div>
                              
                              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white leading-tight">{feature.title}</h3>
                              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{feature.description}</p>
                              
                              <div className="space-y-1.5 sm:space-y-2">
                                <div className={`inline-flex items-center gap-1.5 sm:gap-2 text-xs font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current text-yellow-400" />
                                  {feature.highlight}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {feature.stats}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {Array.from({ length: Math.ceil(features.length / itemsPerSlide) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-poker-green scale-125'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Showcase - No changes here since it's already well optimized */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 lg:mt-20"
        >
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl opacity-10 text-poker-green">
              {cards[(currentCard + 2) % cards.length]}
            </div>
            <div className="absolute bottom-2 left-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl opacity-10 text-poker-purple">
              AA
            </div>
            <div className="absolute top-1/2 right-4 text-sm sm:text-xl opacity-5 text-poker-gold transform -rotate-12 hidden sm:block">
              ROYAL FLUSH
            </div>
            
            <div className="text-center mb-6 sm:mb-8 md:mb-12 relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                Los números que nos <span className="gradient-text">respaldan</span>
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-2">
                Cientos de jugadores peruanos confían en SUPERNOVA para maximizar su ROI y bankroll.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12 relative z-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:scale-105 transition-transform duration-300">
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${stat.color} mx-auto mb-2 sm:mb-3`} />
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mb-1 leading-tight">{stat.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{stat.subText}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 relative z-10 mb-6 sm:mb-8 md:mb-12">
              <div className="text-center p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-poker-green mb-2">Bankroll Booster</div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">Con rakeback del 70%, tu winrate aumenta automáticamente. Perfecto para grinders profesionales.</p>
                <div className="text-xs text-gray-500 mt-2 font-mono">EV+ Garantizado</div>
              </div>
              
              <div className="text-center p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-poker-purple mb-2">Action Garantizado</div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">500+ torneos GTD mensuales. Nunca te quedarás sin mesas activas para jugar.</p>
                <div className="text-xs text-gray-500 mt-2 font-mono">24/7 Traffic</div>
              </div>
              
              <div className="text-center p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors md:col-span-2 lg:col-span-1">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-poker-gold mb-2">Cashout Express</div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">Retiros en menos de 5 minutos. Tu dinero disponible cuando lo necesites.</p>
                <div className="text-xs text-gray-500 mt-2 font-mono">Instant Withdrawal</div>
              </div>
            </div>

            <div className="text-center relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-poker-green to-poker-blue text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg lg:text-xl hover:opacity-90 transition-opacity shadow-2xl btn-glow w-full sm:w-auto"
              >
                Empezar a Ganar Ahora
              </motion.button>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3 md:mt-4 px-2">
                Registro gratuito • Rakeback desde el primer día • Soporte 24/7
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500 px-2">
                <span>✓ No deposit required</span>
                <span>✓ HUD permitido</span>
                <span>✓ Sin bots</span>
                <span>✓ RNG certificado</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}