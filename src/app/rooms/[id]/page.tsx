'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import { RoomDetailHero } from '@/components/rooms/room-detail-hero';
import { RoomBenefits } from '@/components/rooms/room-benefits';
import { RoomFeatures } from '@/components/rooms/room-features';
import { RoomPaymentMethods } from '@/components/rooms/room-payment-methods';
import { RoomStats } from '@/components/rooms/room-stats';
import { RoomSkeleton } from '@/components/rooms/room-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Share2, Heart, Star, MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { getRoomBySlug } from '@/data/rooms-mock';

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Por ahora usamos mock data directamente
  const room = getRoomBySlug(roomId);
  const isLoading = false; // Simular que no está cargando

  if (isLoading) {
    return <RoomSkeleton variant="detail" />;
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sala no encontrada</h2>
          <p className="text-gray-400 mb-6">
            La sala que buscas no existe o fue removida.
          </p>
          <Button asChild>
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Salas
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${room.name} - SUPERNOVA`,
        text: room.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removido de favoritos' : 'Añadido a favoritos');
  };

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" asChild>
            <Link href="/rooms" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Salas
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavorite}
              className="glass border-white/20"
            >
              <Heart className={isFavorite ? 'fill-current text-red-500' : ''} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="glass border-white/20"
            >
              <Share2 />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <RoomDetailHero room={room} />

      {/* Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-14 bg-transparent p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-poker-green rounded-none"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="benefits"
                className="data-[state=active]:border-b-2 data-[state=active]:border-poker-green rounded-none"
              >
                Beneficios
              </TabsTrigger>
              <TabsTrigger 
                value="features"
                className="data-[state=active]:border-b-2 data-[state=active]:border-poker-green rounded-none"
              >
                Características
              </TabsTrigger>
              <TabsTrigger 
                value="payments"
                className="data-[state=active]:border-b-2 data-[state=active]:border-poker-green rounded-none"
              >
                Pagos
              </TabsTrigger>
              <TabsTrigger 
                value="stats"
                className="data-[state=active]:border-b-2 data-[state=active]:border-poker-green rounded-none"
              >
                Estadísticas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-0">
              <RoomBenefits room={room} />
              <RoomFeatures room={room} />
              <RoomPaymentMethods room={room} />
              <RoomStats room={room} />
            </div>
          )}
          
          {activeTab === 'benefits' && <RoomBenefits room={room} />}
          {activeTab === 'features' && <RoomFeatures room={room} />}
          {activeTab === 'payments' && <RoomPaymentMethods room={room} />}
          {activeTab === 'stats' && <RoomStats room={room} />}
        </motion.div>
      </AnimatePresence>

      {/* Reviews Section (Placeholder) */}
      <section className="py-20 bg-gradient-to-b from-transparent via-background/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">
              <MessageCircle className="h-3 w-3 mr-1" />
              Reseñas de Usuarios
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen los <span className="gradient-text">Jugadores</span>
            </h2>
          </motion.div>

          <Card className="glass p-8 text-center">
            <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Próximamente</h3>
            <p className="text-gray-400 mb-6">
              El sistema de reseñas estará disponible pronto. Podrás compartir tu experiencia
              y leer las opiniones de otros jugadores.
            </p>
            <Button variant="outline" className="glass border-white/20">
              Notificarme cuando esté disponible
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div>
                  <Badge className="mb-4">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Oferta Exclusiva
                  </Badge>
                  <h3 className="text-3xl font-bold mb-4">
                    ¿Listo para jugar en {room.name}?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Regístrate ahora a través de SUPERNOVA y obtén beneficios exclusivos
                    que no encontrarás en ningún otro lugar.
                  </p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-poker-green">✓</span>
                      Bono de bienvenida mejorado
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-poker-green">✓</span>
                      Rakeback adicional exclusivo
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-poker-green">✓</span>
                      Soporte prioritario 24/7
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-poker-green">✓</span>
                      Acceso a torneos privados
                    </li>
                  </ul>
                </div>
                
                <div className="text-center md:text-right">
                  <div className="inline-flex flex-col gap-4">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-poker-green to-poker-blue hover:opacity-90 btn-glow text-lg px-8"
                    >
                      Registrarme Ahora
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-gray-500">
                      * Aplican términos y condiciones
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}