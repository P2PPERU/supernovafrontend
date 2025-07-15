import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Gamepad2, Gift, Shield, Users, Zap } from 'lucide-react';

const features = [
  {
    title: 'Torneos Diarios',
    description: 'Participa en torneos emocionantes con premios garantizados todos los días.',
    icon: Trophy,
    color: 'text-poker-gold',
  },
  {
    title: 'Ruleta de Premios',
    description: 'Gira la ruleta y gana premios instantáneos, bonos y mucho más.',
    icon: Gamepad2,
    color: 'text-poker-green',
  },
  {
    title: 'Bonos Exclusivos',
    description: 'Recibe bonos de bienvenida y promociones especiales cada semana.',
    icon: Gift,
    color: 'text-poker-red',
  },
  {
    title: 'Juego Seguro',
    description: 'Plataforma 100% segura con encriptación de última generación.',
    icon: Shield,
    color: 'text-blue-500',
  },
  {
    title: 'Comunidad Activa',
    description: 'Únete a una comunidad de miles de jugadores apasionados.',
    icon: Users,
    color: 'text-purple-500',
  },
  {
    title: 'Retiros Rápidos',
    description: 'Procesa tus ganancias de forma rápida y segura.',
    icon: Zap,
    color: 'text-orange-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre todo lo que hace de nuestro club la mejor opción para los amantes del poker
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}