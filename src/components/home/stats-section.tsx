'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Trophy, TrendingUp, Gamepad2, Clock, Star, Award, Percent } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 2000,
    label: 'Jugadores Activos',
    suffix: '+',
    color: 'text-poker-green',
    increment: 15,
  },
  {
    icon: DollarSign,
    value: 890000,
    label: 'Premios Entregados',
    prefix: '$',
    color: 'text-poker-gold',
    increment: 2500,
  },
  {
    icon: Trophy,
    value: 2500,
    label: 'Torneos Completados',
    suffix: '+',
    color: 'text-poker-purple',
    increment: 8,
  },
  {
    icon: Percent,
    value: 60,
    label: 'Rakeback Máximo',
    suffix: '%',
    color: 'text-poker-blue',
    increment: null,
    decimals: 0,
  },
];

const highlights = [
  {
    icon: Award,
    title: 'Plataforma Certificada',
    description: 'Licenciada y auditada para garantizar fair play',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento Constante',
    description: 'Más de 50 nuevos jugadores se unen cada semana',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Star,
    title: 'Satisfacción 95%+',
    description: 'Calificación promedio de 4.8/5 estrellas',
    color: 'from-yellow-500 to-yellow-600',
  },
];

function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0 }: any) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span>
      {prefix}{count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative bg-gradient-to-b from-background via-background/95 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Números que <span className="gradient-text">Hablan</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            La confianza de miles de jugadores nos respalda cada día
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="glass rounded-xl p-6 text-center card-hover">
                  <div className={`inline-flex p-3 rounded-lg bg-white/5 mb-4 ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                  
                  {stat.increment && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-poker-green text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>+{stat.increment} hoy</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Lo que nos hace <span className="gradient-text">diferentes</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Beneficios reales que marcan la diferencia en tu experiencia de juego
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative glass rounded-xl p-6 text-center card-hover">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${highlight.color} bg-opacity-10 mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-semibold mb-2">{highlight.title}</h4>
                    <p className="text-gray-400 text-sm">{highlight.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para <span className="gradient-text">maximizar</span> tus ganancias?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Únete a más de 2,000 jugadores que ya disfrutan del mejor rakeback y los mejores torneos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-poker-green to-poker-blue text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity shadow-lg">
                Registrarse Gratis
              </button>
              <button className="border border-poker-green/50 text-poker-green px-8 py-4 rounded-lg font-medium text-lg hover:bg-poker-green/10 transition-colors">
                Ver Salas Disponibles
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sin depósito mínimo
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Rakeback desde el primer día
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-poker-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Soporte 24/7
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}