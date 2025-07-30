'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, Clock, ArrowRight, Sparkles, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';

const promos = [
  {
    id: 1,
    title: 'Bono de Bienvenida',
    subtitle: 'Nuevo Jugador',
    description: 'Obtén hasta $2,000 en tu primer depósito + 50 giros gratis',
    gradient: 'from-amber-500 to-orange-600',
    icon: Gift,
    badge: 'NUEVO',
    badgeColor: 'bg-amber-500',
    cta: 'Reclamar Ahora',
  },
  {
    id: 2,
    title: 'Torneo Semanal',
    subtitle: 'Todos los Viernes',
    description: 'Premio garantizado de $10,000 + entradas gratis para VIP',
    gradient: 'from-purple-500 to-pink-600',
    icon: Crown,
    badge: 'POPULAR',
    badgeColor: 'bg-purple-500',
    cta: 'Inscribirse',
  },
  {
    id: 3,
    title: 'Rakeback Boost',
    subtitle: 'Oferta Limitada',
    description: 'Aumenta tu rakeback al 60% durante todo el fin de semana',
    gradient: 'from-green-500 to-emerald-600',
    icon: Rocket,
    badge: 'HOT',
    badgeColor: 'bg-red-500',
    cta: 'Activar Boost',
  },
];

export function PromoSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-poker-green/20 to-poker-purple/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="h-4 w-4 text-poker-gold" />
            <span className="text-sm font-medium">Promociones Activas</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ofertas <span className="gradient-text">Exclusivas</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Aprovecha nuestras promociones especiales y maximiza tus ganancias
          </p>
        </motion.div>

        {/* Promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative glass rounded-2xl p-8 h-full card-hover">
                    {/* Badge */}
                    <Badge className={`${promo.badgeColor} text-white absolute top-6 right-6`}>
                      {promo.badge}
                    </Badge>
                    
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${promo.gradient} mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-1">{promo.subtitle}</p>
                      <h3 className="text-2xl font-bold mb-3">{promo.title}</h3>
                      <p className="text-gray-400">{promo.description}</p>
                    </div>
                    
                    {/* CTA */}
                    <Button 
                      className={`w-full bg-gradient-to-r ${promo.gradient} hover:opacity-90 btn-glow`}
                    >
                      {promo.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Special promo banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-poker-purple via-poker-blue to-poker-green opacity-80" />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Animated background shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative p-12 md:p-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="inline-flex p-4 rounded-full bg-white/20 mb-6"
              >
                <Calendar className="h-12 w-12 text-white" />
              </motion.div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Evento Especial de Navidad
              </h3>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Del 20 al 25 de diciembre participa en nuestro mega torneo con 
                <span className="font-bold text-poker-gold"> $50,000 garantizados</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Termina en: 5 días 12:34:56</span>
                </div>
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  Ver Detalles del Evento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}