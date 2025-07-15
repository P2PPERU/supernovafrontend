'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Gamepad2, Users } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function HeroSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-poker-darkGreen to-poker-green">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 text-white/10 text-9xl font-bold">♠</div>
      <div className="absolute bottom-10 right-10 text-white/10 text-9xl font-bold">♣</div>
      <div className="absolute top-1/2 left-1/3 text-white/10 text-9xl font-bold">♥</div>
      <div className="absolute top-1/3 right-1/3 text-white/10 text-9xl font-bold">♦</div>
      
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Bienvenido al mejor{' '}
            <span className="text-poker-gold">Club de Poker</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-100">
            Únete a miles de jugadores en la experiencia de poker más emocionante. 
            Torneos diarios, ruleta de premios y rankings competitivos te esperan.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/roulette">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Jugar Ruleta
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" asChild>
                  <Link href="/dashboard">
                    Mi Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-poker-gold hover:bg-poker-gold/90 text-black" asChild>
                  <Link href="/register">
                    Registrarse Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" asChild>
                  <Link href="/login">
                    Iniciar Sesión
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Estadísticas */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-poker-gold" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm text-gray-200">Jugadores Activos</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Trophy className="h-8 w-8 text-poker-gold" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">$50,000</p>
              <p className="text-sm text-gray-200">En Premios Mensuales</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Gamepad2 className="h-8 w-8 text-poker-gold" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-200">Juegos Disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}