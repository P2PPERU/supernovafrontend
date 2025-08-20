'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    nick: 'PokerShark87',
    role: 'Cash Game NL200',
    avatar: 'PS',
    rating: 5,
    content: 'Llevo 8 meses en SUPERNOVA y el rakeback del 55% me ha dado mucha más libertad. Las mesas están siempre activas y el software va perfecto.',
    achievement: 'Rakeback mensual: $850',
  },
  {
    id: 2,
    nick: 'MTT_Grinder',
    role: 'Especialista en Torneos',
    avatar: 'MG',
    rating: 5,
    content: 'Los torneos aquí tienen muy buen nivel y premios decentes. He cashado en 23 de mis últimos 50 MTTs. El field no está saturado de regs.',
    achievement: 'ITM: 46% últimos 50 torneos',
  },
  {
    id: 3,
    nick: 'CashGamePro_',
    role: 'Grinder NL100',
    avatar: 'CG',
    rating: 5,
    content: 'Vine de otra sala por el rakeback y me quedé por la acción. Las mesas de NL100 son jugosas y el soporte responde rápido cuando hay algún problema.',
    achievement: 'Winrate: 4.2bb/100 últimas 15K manos',
  },
  {
    id: 4,
    nick: 'TourneyAce22',
    role: 'SNG Regular',
    avatar: 'TA',
    rating: 5,
    content: 'Los sit and go de $20-$50 tienen muy buen tráfico. Me gusta que puedo jugar 6-8 mesas sin problemas. Los pagos llegan en unos minutos.',
    achievement: '18 victorias en SNGs este mes',
  },
  {
    id: 5,
    nick: 'MicroStakes_',
    role: 'Jugador Recreativo',
    avatar: 'MS',
    rating: 5,
    content: 'Perfecto para alguien como yo que juega por diversión. Los stakes de $1-$5 son relajados y la ruleta diaria me da fichas extra para jugar más.',
    achievement: '12 giros ganados esta semana',
  },
  {
    id: 6,
    nick: 'HighRoller99',
    role: 'High Stakes Player',
    avatar: 'HR',
    rating: 5,
    content: 'Las mesas de NL500+ tienen buena acción los fines de semana. El rake es competitivo y nunca he tenido problemas con los cashouts grandes.',
    achievement: 'Sesión ganadora: $3,200',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros <span className="gradient-text">Jugadores</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experiencias reales de nuestra comunidad de poker
          </p>
        </motion.div>

        {/* Desktop view - Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass p-6 h-full card-hover">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-poker-green to-poker-blue flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-poker-green">{testimonial.nick}</h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                  <Quote className="h-6 w-6 text-poker-green/20 flex-shrink-0" />
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{testimonial.content}</p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-poker-green/10 text-poker-green text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-poker-green animate-pulse" />
                  {testimonial.achievement}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile view - Carousel */}
        <div className="md:hidden relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-poker-green to-poker-blue flex items-center justify-center text-white font-bold">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-poker-green">{testimonials[currentIndex].nick}</h4>
                  <p className="text-sm text-gray-400">{testimonials[currentIndex].role}</p>
                </div>
                <Quote className="h-8 w-8 text-poker-green/20" />
              </div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-4">{testimonials[currentIndex].content}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-poker-green/10 text-poker-green text-sm">
                <span className="w-2 h-2 rounded-full bg-poker-green animate-pulse" />
                {testimonials[currentIndex].achievement}
              </div>
            </Card>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-poker-green' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-poker-green">4.7/5</div>
                <div className="text-sm text-gray-400">Rating promedio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-poker-gold">1,200+</div>
                <div className="text-sm text-gray-400">Reviews positivas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-poker-purple">92%</div>
                <div className="text-sm text-gray-400">Satisfacción</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-poker-blue">2,000+</div>
                <div className="text-sm text-gray-400">Jugadores activos</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}