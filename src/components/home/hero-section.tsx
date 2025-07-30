'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, Star, Users, Trophy, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';

export function HeroSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentCard, setCurrentCard] = useState(0);
  
  const cards = ['♠', '♥', '♣', '♦'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center animated-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-8xl opacity-10 floating">
          {cards[currentCard]}
        </div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 floating" style={{ animationDelay: '1s' }}>
          {cards[(currentCard + 1) % cards.length]}
        </div>
        <div className="absolute top-1/2 left-1/3 text-8xl opacity-10 floating" style={{ animationDelay: '2s' }}>
          {cards[(currentCard + 2) % cards.length]}
        </div>
        <div className="absolute top-1/3 right-1/3 text-8xl opacity-10 floating" style={{ animationDelay: '3s' }}>
          {cards[(currentCard + 3) % cards.length]}
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-background" />
      
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poker-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-poker-green"></span>
            </span>
            <span className="text-sm font-medium">+500 agentes ahora</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Los mejores tratos de Poker
            <br />
            <span className="gradient-text">Para todos tus clientes</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            Únete a la élite del poker online. Torneos exclusivos, bonos increíbles y 
            la mejor experiencia de juego te esperan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {isAuthenticated ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-poker-green hover:bg-poker-darkGreen btn-glow text-lg px-8 py-6"
                  asChild
                >
                  <Link href="/roulette">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Jugar Ahora
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-poker-green/50 hover:bg-poker-green/10 text-lg px-8 py-6"
                  asChild
                >
                  <Link href="/dashboard">
                    Mi Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-poker-green to-poker-blue hover:from-poker-darkGreen hover:to-blue-600 btn-glow text-lg px-8 py-6"
                  asChild
                >
                  <Link href="/register">
                    Registro Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass border-white/20 hover:bg-white/10 text-lg px-8 py-6"
                  asChild
                >
                  <Link href="/login">
                    Iniciar Sesión
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="glass rounded-lg p-6 card-hover">
              <Users className="h-8 w-8 text-poker-green mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm text-gray-400">Jugadores Activos</div>
            </div>
            <div className="glass rounded-lg p-6 card-hover">
              <DollarSign className="h-8 w-8 text-poker-gold mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">$50K</div>
              <div className="text-sm text-gray-400">Premios Mensuales</div>
            </div>
            <div className="glass rounded-lg p-6 card-hover">
              <Trophy className="h-8 w-8 text-poker-purple mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">100+</div>
              <div className="text-sm text-gray-400">Torneos Diarios</div>
            </div>
            <div className="glass rounded-lg p-6 card-hover">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">Valoración</div>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 items-center"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-5 w-5 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Licencia Oficial
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-5 w-5 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pagos Seguros
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-5 w-5 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Retiros Rápidos
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}