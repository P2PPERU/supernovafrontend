'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Gamepad2, Gift, Shield, Users, Zap, DollarSign, Headphones } from 'lucide-react';

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
    description: 'Gira la ruleta diaria y gana premios instantáneos, bonos y mucho más.',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-600',
    highlight: 'Giros gratis diarios',
  },
  {
    title: 'Bonos VIP',
    description: 'Sistema de recompensas exclusivo con bonos personalizados y rakeback.',
    icon: Gift,
    color: 'from-purple-500 to-pink-600',
    highlight: 'Hasta 60% rakeback',
  },
  {
    title: 'Seguridad Total',
    description: 'Plataforma certificada con encriptación de última generación.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-600',
    highlight: 'SSL 256-bit',
  },
  {
    title: 'Comunidad Activa',
    description: 'Únete a miles de jugadores y participa en eventos exclusivos.',
    icon: Users,
    color: 'from-indigo-500 to-purple-600',
    highlight: '10K+ jugadores activos',
  },
  {
    title: 'Pagos Instantáneos',
    description: 'Retira tus ganancias al instante con múltiples métodos de pago.',
    icon: DollarSign,
    color: 'from-green-500 to-teal-600',
    highlight: 'Retiros en < 5 min',
  },
  {
    title: 'Soporte 24/7',
    description: 'Equipo de soporte dedicado disponible las 24 horas del día.',
    icon: Headphones,
    color: 'from-red-500 to-rose-600',
    highlight: 'Respuesta < 2 min',
  },
  {
    title: 'Multi-plataforma',
    description: 'Juega desde cualquier dispositivo: PC, móvil o tablet.',
    icon: Zap,
    color: 'from-yellow-500 to-amber-600',
    highlight: 'Apps nativas disponibles',
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
            Todo lo que necesitas para llevar tu juego al siguiente nivel
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

        {/* Feature showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Sistema de <span className="gradient-text">Recompensas VIP</span>
                </h3>
                <p className="text-lg text-gray-400 mb-6">
                  Nuestro programa VIP exclusivo te recompensa por cada partida. 
                  Acumula puntos, sube de nivel y desbloquea beneficios increíbles.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { level: 'Bronce', rakeback: '20%', bonus: '$100' },
                    { level: 'Plata', rakeback: '35%', bonus: '$500' },
                    { level: 'Oro', rakeback: '50%', bonus: '$1,000' },
                    { level: 'Diamante', rakeback: '60%', bonus: '$2,500' },
                  ].map((tier) => (
                    <div key={tier.level} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="font-medium">{tier.level}</span>
                      <div className="flex gap-6">
                        <span className="text-sm text-gray-400">Rakeback: <span className="text-poker-green font-semibold">{tier.rakeback}</span></span>
                        <span className="text-sm text-gray-400">Bonus: <span className="text-poker-gold font-semibold">{tier.bonus}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="bg-gradient-to-r from-poker-green to-poker-blue text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Ver Programa VIP Completo
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-poker-green to-poker-purple opacity-20 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="glass rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <Trophy className="h-12 w-12 text-poker-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold">127</div>
                      <div className="text-sm text-gray-400">Torneos Ganados</div>
                    </div>
                    <div className="glass rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <Gift className="h-12 w-12 text-poker-purple mx-auto mb-2" />
                      <div className="text-2xl font-bold">$2,847</div>
                      <div className="text-sm text-gray-400">Bonos Reclamados</div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="glass rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <Users className="h-12 w-12 text-poker-green mx-auto mb-2" />
                      <div className="text-2xl font-bold">1,243</div>
                      <div className="text-sm text-gray-400">Amigos Referidos</div>
                    </div>
                    <div className="glass rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">$18,450</div>
                      <div className="text-sm text-gray-400">Ganancias Totales</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}