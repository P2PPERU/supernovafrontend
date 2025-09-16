'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Star, Sparkles, Crown, Trophy, DollarSign, Users, MessageCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!user) return null;

  const handleWhatsApp = () => {
    window.open('https://wa.me/51913828147', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header con efectos */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-poker-gold animate-bounce" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-poker-gold via-yellow-400 to-poker-gold bg-clip-text text-transparent">
                Bienvenido {user.profile?.firstName || user.username}
              </h1>
              <Crown className="w-8 h-8 text-poker-gold animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <div className="relative">
              <Sparkles className="absolute -top-4 -left-4 w-6 h-6 text-poker-gold animate-spin" />
              <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-poker-gold animate-spin" style={{ animationDelay: '1s' }} />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                🌟 SUPERNOVA 🌟
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-poker-gold to-yellow-400 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Mensaje principal con card */}
          <div className="bg-black/40 backdrop-blur-lg border border-poker-gold/20 rounded-2xl p-8 mb-12 shadow-2xl">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-poker-gold fill-current mx-1" />
              ))}
            </div>
            
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6">
              Te traemos los <span className="text-poker-gold font-bold">mejores acuerdos de Poker</span>
            </p>
            
            <p className="text-lg text-gray-300 mb-8">
              Con nosotros obtendrás <span className="text-poker-green font-semibold">beneficios exclusivos</span> 
              y experiencias únicas en el mundo del poker profesional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-poker-green/10 border border-poker-green/30 rounded-lg p-4">
                <Trophy className="w-8 h-8 text-poker-green mx-auto mb-2" />
                <h3 className="font-bold text-poker-green mb-1">Torneos VIP</h3>
                <p className="text-sm text-gray-400">Acceso exclusivo</p>
              </div>
              
              <div className="bg-poker-gold/10 border border-poker-gold/30 rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-poker-gold mx-auto mb-2" />
                <h3 className="font-bold text-poker-gold mb-1">Bonos Premium</h3>
                <p className="text-sm text-gray-400">Recompensas especiales</p>
              </div>
              
              <div className="bg-poker-red/10 border border-poker-red/30 rounded-lg p-4">
                <Users className="w-8 h-8 text-poker-red mx-auto mb-2" />
                <h3 className="font-bold text-poker-red mb-1">Soporte 24/7</h3>
                <p className="text-sm text-gray-400">Atención personalizada</p>
              </div>
            </div>
          </div>

          {/* Botón de WhatsApp mejorado */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <button
              onClick={handleWhatsApp}
              className="relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25"
            >
              <div className="relative">
                <MessageCircle className="w-8 h-8 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
              </div>
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-normal text-green-100">Contáctanos ahora</span>
                <span className="text-xl font-bold">Contáctanos ahora</span>
              </div>
              
              <div className="ml-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mt-1" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mt-1" style={{ animationDelay: '1s' }}></div>
              </div>
            </button>
          </div>

          {/* Mensaje adicional */}
          <p className="mt-8 text-gray-400 text-sm">
            Únete a la élite del poker profesional
          </p>
        </div>
      </div>
    </div>
  );
}