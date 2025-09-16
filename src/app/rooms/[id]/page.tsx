'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Star, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getRoomBySlug } from '@/data/rooms-mock';

export default function RoomDetailPage() {
  const params = useParams();
  const roomSlug = params.id as string;
  
  // Usar datos del mock directamente
  const room = getRoomBySlug(roomSlug);
  const isLoading = false;

  // Número de WhatsApp
  const whatsappNumber = "+51913828147";
  const whatsappMessage = `Hola! Estoy interesado en obtener más información sobre ${room?.name || 'las salas de poker'}. ¿Podrían ayudarme?`;

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-poker-green"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass p-6 md:p-8 text-center max-w-md w-full">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Sala no encontrada</h2>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            La sala que buscas no existe o fue removida.
          </p>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Salas
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <Button variant="ghost" asChild size="sm">
            <Link href="/rooms" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver a Salas</span>
              <span className="sm:hidden">Volver</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative py-8 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-poker-green/10 via-transparent to-poker-purple/10 opacity-50" />
        <div className={`absolute inset-0 bg-gradient-to-br ${room.gradientColors?.from || 'from-poker-green/5'} ${room.gradientColors?.to || 'to-poker-purple/5'} opacity-5`} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className={`${room.badgeColor || 'bg-poker-green'} text-white mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm`}>
              {room.badge}
            </Badge>
            
            <div className="mb-4 md:mb-6 flex justify-center">
              {room.images?.logo && (
                <img 
                  src={room.images.logo} 
                  alt={`${room.name} Logo`}
                  className="h-16 w-16 md:h-24 md:w-24 object-contain"
                  loading="eager"
                />
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              {room.name}
            </h1>
            <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8 px-4">
              {room.shortDescription}
            </p>
            
            {/* Stats rápidas */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-12 flex-wrap text-sm md:text-base">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.floor(room.rating || 4) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{room.rating || '4.5'}</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-poker-green" />
                <span className="text-poker-green font-semibold">{room.activePlayers || '500+'}</span>
                <span className="text-gray-400 hidden sm:inline">jugadores</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <span className="text-blue-500 font-semibold">{room.rakeback?.percentage || '25'}%</span>
                <span className="text-gray-400 hidden sm:inline">rakeback</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Información General */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass overflow-hidden">
              <CardContent className="p-4 md:p-8 lg:p-12">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                    Sobre <span className="gradient-text">{room.name}</span>
                  </h2>
                  <p className="text-sm md:text-lg text-gray-300 leading-relaxed">
                    {room.description || `${room.name} es una de las salas de poker online más reconocidas, ofreciendo una experiencia de juego excepcional con beneficios exclusivos para jugadores latinos.`}
                  </p>
                </div>

                {/* Highlights principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="text-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-poker-green/10 to-transparent border border-poker-green/20">
                    <div className="text-xl md:text-2xl font-bold text-poker-green mb-1 md:mb-2">
                      {room.rakeback?.percentage || '25'}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">Rakeback Exclusivo</div>
                  </div>
                  
                  <div className="text-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="text-xl md:text-2xl font-bold text-blue-500 mb-1 md:mb-2">
                      {room.bonus?.welcome?.currency || 'S/'}{room.bonus?.welcome?.maxBonus?.toLocaleString() || '1000'}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">Bono de Bienvenida</div>
                  </div>
                  
                  <div className="text-center p-4 md:p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <div className="text-xl md:text-2xl font-bold text-purple-500 mb-1 md:mb-2">24/7</div>
                    <div className="text-xs md:text-sm text-gray-400">Soporte VIP</div>
                  </div>
                </div>

                {/* Características destacadas */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center">Características Destacadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {(room.features || [
                      { title: "Rakeback exclusivo del 25%" },
                      { title: "Torneos diarios garantizados" },
                      { title: "Soporte 24/7 en español" },
                      { title: "Depósitos y retiros rápidos" }
                    ]).slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-white/5">
                        <span className="text-poker-green text-base md:text-lg flex-shrink-0">✓</span>
                        <span className="text-gray-300 text-sm md:text-base">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Principal - WhatsApp */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-transparent via-background/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="glass overflow-hidden border-poker-green/20">
              <CardContent className="p-6 md:p-8 lg:p-12 text-center">
                <div className="mb-6">
                  <MessageCircle className="h-12 w-12 md:h-16 md:w-16 text-poker-green mx-auto mb-3 md:mb-4" />
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                    ¿Interesado en <span className="gradient-text">{room.name}</span>?
                  </h3>
                  <p className="text-sm md:text-lg text-gray-400 mb-6 md:mb-8">
                    Contáctanos por WhatsApp para obtener información detallada, 
                    beneficios exclusivos y comenzar tu registro de manera personalizada.
                  </p>
                </div>

                <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
                    <span className="text-poker-green">✓</span>
                    Asesoría personalizada gratuita
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
                    <span className="text-poker-green">✓</span>
                    Beneficios exclusivos de SUPERNOVA
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
                    <span className="text-poker-green">✓</span>
                    Soporte durante todo el proceso
                  </div>
                </div>

                <Button 
                  size="lg"
                  onClick={handleWhatsAppRedirect}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 btn-glow text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 transition-all duration-300 w-full sm:w-auto"
                >
                  <MessageCircle className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                  Contactar por WhatsApp
                </Button>
                
                <p className="text-xs text-gray-500 mt-3 md:mt-4">
                  Respuesta inmediata • {whatsappNumber}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Información adicional rápida */}
      <section className="py-8 md:py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
              ¿Tienes dudas sobre el proceso de registro o los beneficios?
            </p>
            <Button 
              variant="outline" 
              onClick={handleWhatsAppRedirect}
              className="glass border-white/20 hover:border-poker-green/50 text-sm md:text-base px-4 md:px-6"
            >
              Hablar con un experto
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}