'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Gamepad2, Percent, Shield, Users, Zap, DollarSign, Headphones } from 'lucide-react';

const features = [
  {
    title: 'Torneos Exclusivos',
    description: 'Participa en torneos premium con premios garantizados todos los días.',
    icon: Trophy,
    color: 'from-amber-500 to-orange-600',
    highlight: 'Nuevos torneos cada hora',
  },
  {
    title: 'Ruleta de Premios',
    description: 'Gira la ruleta diaria y gana premios instantáneos, fichas y mucho más.',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-600',
    highlight: 'Giros gratis diarios',
  },
  {
    title: 'Mejor Rakeback',
    description: 'Hasta 60% de rakeback en todas las salas - el más alto del mercado.',
    icon: Percent,
    color: 'from-purple-500 to-pink-600',
    highlight: 'Hasta 60% rakeback',
  },
  {
    title: 'Seguridad Total',
    description: 'Plataforma certificada con encriptación de última generación y fair play.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-600',
    highlight: 'SSL 256-bit',
  },
  {
    title: 'Comunidad Activa',
    description: 'Únete a miles de jugadores en salas activas las 24 horas del día.',
    icon: Users,
    color: 'from-indigo-500 to-purple-600',
    highlight: '5K+ jugadores online',
  },
  {
    title: 'Pagos Instantáneos',
    description: 'Retira tus ganancias al instante con múltiples métodos de pago seguros.',
    icon: DollarSign,
    color: 'from-green-500 to-teal-600',
    highlight: 'Retiros en < 10 min',
  },
  {
    title: 'Soporte 24/7',
    description: 'Equipo de soporte especializado en poker disponible siempre.',
    icon: Headphones,
    color: 'from-red-500 to-rose-600',
    highlight: 'Respuesta < 5 min',
  },
  {
    title: 'Multi-plataforma',
    description: 'Juega desde cualquier dispositivo con nuestras apps optimizadas.',
    icon: Zap,
    color: 'from-yellow-500 to-amber-600',
    highlight: 'Apps nativas disponibles',
  },
];

const stats = [
  {
    icon: Trophy,
    value: '500+',
    label: 'Torneos Mensuales',
    color: 'text-poker-gold',
  },
  {
    icon: Users,
    value: '15K+',
    label: 'Jugadores Registrados',
    color: 'text-poker-green',
  },
  {
    icon: DollarSign,
    value: '$2M+',
    label: 'Premios Repartidos',
    color: 'text-green-500',
  },
  {
    icon: Percent,
    value: '60%',
    label: 'Rakeback Máximo',
    color: 'text-poker-purple',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Por qué elegir <span className="gradient-text">SUPERNOVA</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            La plataforma líder con las mejores condiciones para jugadores serios de poker
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="glass h-full p-6 card-hover border-0">
                  <div className="mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  
                  <div className={`inline-flex items-center gap-1 text-xs font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    <span className="w-1 h-1 rounded-full bg-current" />
                    {feature.highlight}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Los números que nos <span className="gradient-text">respaldan</span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Miles de jugadores confían en SUPERNOVA para maximizar sus ganancias y disfrutar la mejor experiencia de poker online.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
                    <div className="glass rounded-xl p-6 hover:scale-105 transition-transform">
                      <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-poker-green mb-2">Ganancias Maximizadas</div>
                <p className="text-gray-400">Con nuestro rakeback del 60%, mantienes más dinero en tu bankroll para seguir jugando.</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-poker-purple mb-2">Torneos Garantizados</div>
                <p className="text-gray-400">Más de 500 torneos mensuales con premios garantizados - siempre hay acción esperándote.</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-poker-gold mb-2">Confianza Total</div>
                <p className="text-gray-400">Pagos rápidos, soporte experto y la mejor seguridad para que solo te enfoques en ganar.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-poker-green to-poker-blue text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity shadow-lg">
                Comenzar a Ganar Ahora
              </button>
              <p className="text-sm text-gray-400 mt-3">Registro gratuito • Sin depósito mínimo • Rakeback desde el primer día</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}