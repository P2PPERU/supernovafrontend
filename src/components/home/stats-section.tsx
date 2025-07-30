'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Trophy, TrendingUp, Gamepad2, Clock } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 10847,
    label: 'Jugadores Activos',
    suffix: '+',
    color: 'text-poker-green',
    increment: 23,
  },
  {
    icon: DollarSign,
    value: 523450,
    label: 'Premios Entregados',
    prefix: '$',
    color: 'text-poker-gold',
    increment: 1250,
  },
  {
    icon: Trophy,
    value: 1247,
    label: 'Torneos Completados',
    suffix: '',
    color: 'text-poker-purple',
    increment: 3,
  },
  {
    icon: Gamepad2,
    value: 98.7,
    label: 'Satisfacción',
    suffix: '%',
    color: 'text-poker-blue',
    increment: 0.1,
    decimals: 1,
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
            La confianza de miles de jugadores nos respalda
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poker-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-poker-green"></span>
              </span>
              Actividad en Vivo
            </h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {[
              { user: 'Carlos M.', action: 'ganó $250 en X-POKER', time: 'hace 2 min' },
              { user: 'Ana P.', action: 'se unió al torneo Premium', time: 'hace 5 min' },
              { user: 'Luis R.', action: 'recibió 50% rakeback', time: 'hace 7 min' },
              { user: 'María G.', action: 'ganó el Jackpot de $1,500', time: 'hace 12 min' },
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-poker-green to-poker-blue flex items-center justify-center text-sm font-bold">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-400"> {activity.action}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}