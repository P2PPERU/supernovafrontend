'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    role: 'Jugador Profesional',
    avatar: 'CM',
    rating: 5,
    content: 'SUPERNOVA ha cambiado completamente mi experiencia de juego. Los torneos son increíbles y el rakeback es el mejor del mercado. ¡100% recomendado!',
    prize: 'Ganó $15,000 en torneos',
  },
  {
    id: 2,
    name: 'Ana García',
    role: 'VIP Diamond',
    avatar: 'AG',
    rating: 5,
    content: 'El soporte es excepcional y los pagos son instantáneos. Llevo 2 años jugando aquí y cada día es mejor. El programa VIP tiene beneficios increíbles.',
    prize: 'Rakeback mensual: $2,500',
  },
  {
    id: 3,
    name: 'Roberto Silva',
    role: 'Jugador Casual',
    avatar: 'RS',
    rating: 5,
    content: 'Como jugador casual, aprecio mucho los bonos y promociones. La interfaz es muy intuitiva y puedo jugar desde mi móvil sin problemas.',
    prize: 'Bono acumulado: $3,200',
  },
  {
    id: 4,
    name: 'María López',
    role: 'Torneo Regular',
    avatar: 'ML',
    rating: 5,
    content: 'Los torneos diarios son mi pasión. La competencia es justa y los premios son reales. He mejorado mucho mi juego gracias a la comunidad.',
    prize: '47 torneos ganados',
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
            Miles de jugadores confían en nosotros cada día
          </p>
        </motion.div>

        {/* Desktop view - Grid */}
        <div className="hidden md:grid grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass p-8 h-full card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-poker-green to-poker-blue flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                  <Quote className="h-8 w-8 text-poker-green/20" />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4">{testimonial.content}</p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-poker-green/10 text-poker-green text-sm">
                  <span className="w-2 h-2 rounded-full bg-poker-green animate-pulse" />
                  {testimonial.prize}
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
                  <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
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
                {testimonials[currentIndex].prize}
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
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div>
              <div className="text-3xl font-bold text-poker-green">4.9/5</div>
              <div className="text-sm text-gray-400">Calificación promedio</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-3xl font-bold text-poker-gold">10,847</div>
              <div className="text-sm text-gray-400">Reseñas positivas</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-3xl font-bold text-poker-purple">98.7%</div>
              <div className="text-sm text-gray-400">Satisfacción</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}