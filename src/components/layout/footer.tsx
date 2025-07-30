import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const footerLinks = {
  juego: [
    { name: 'Cómo Jugar', href: '/how-to-play' },
    { name: 'Reglas', href: '/rules' },
    { name: 'Estrategias', href: '/strategies' },
    { name: 'Torneos', href: '/tournaments' },
    { name: 'Rankings', href: '/rankings' },
  ],
  club: [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Afiliados', href: '/affiliates' },
    { name: 'Prensa', href: '/press' },
  ],
  soporte: [
    { name: 'Centro de Ayuda', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Soporte 24/7', href: '/support' },
    { name: 'Guías', href: '/guides' },
    { name: 'API Docs', href: '/api' },
  ],
  legal: [
    { name: 'Términos y Condiciones', href: '/terms' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Juego Responsable', href: '/responsible-gaming' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licencias', href: '/licenses' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', followers: '45K' },
  { name: 'Twitter', icon: Twitter, href: '#', followers: '32K' },
  { name: 'Instagram', icon: Instagram, href: '#', followers: '28K' },
  { name: 'YouTube', icon: Youtube, href: '#', followers: '15K' },
];

const paymentMethods = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'PayPal', icon: '💰' },
  { name: 'Bitcoin', icon: '₿' },
  { name: 'Ethereum', icon: 'Ξ' },
];

export function Footer() {
  return (
    <footer className="relative bg-black/50 backdrop-blur-xl border-t border-white/10">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Únete a Nuestra Comunidad</h3>
            <p className="text-gray-400 mb-6">
              Recibe bonos exclusivos, invitaciones a torneos VIP y las últimas noticias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="glass border-white/20 bg-white/5"
              />
              <Button className="bg-gradient-to-r from-poker-green to-poker-blue hover:opacity-90">
                Suscribirse
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Al suscribirte aceptas recibir comunicaciones promocionales. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-poker-green to-poker-darkGreen flex items-center justify-center">
                <span className="text-white font-bold text-xl">♠</span>
              </div>
              <span className="font-bold text-2xl gradient-text">SUPERNOVA</span>
            </div>
            <p className="text-gray-400">
              La plataforma líder de poker online en Latinoamérica. Juega con confianza 
              en el club más prestigioso y seguro.
            </p>
            
            {/* Social links */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Síguenos</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-poker-green rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                      <div className="relative glass p-3 rounded-lg hover:bg-white/10 transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {social.followers} seguidores
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@supernova.com" className="hover:text-poker-green transition-colors">
                  support@supernova.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-poker-green">♠</span> Juego
            </h3>
            <ul className="space-y-2">
              {footerLinks.juego.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-poker-green group-hover:w-3 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-poker-red">♥</span> Club
            </h3>
            <ul className="space-y-2">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-poker-red group-hover:w-3 transition-all" />
                    {link.name}
                    {link.name === 'Blog' && (
                      <Badge variant="outline" className="ml-2 text-xs px-1 py-0">
                        Nuevo
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-poker-blue">♣</span> Soporte
            </h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-poker-blue group-hover:w-3 transition-all" />
                    {link.name}
                    {link.name === 'Soporte 24/7' && (
                      <span className="relative flex h-2 w-2 ml-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-poker-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-poker-green"></span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-poker-gold">♦</span> Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-poker-gold group-hover:w-3 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-3">Métodos de pago seguros</p>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="glass px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-3">Certificaciones</p>
              <div className="flex gap-3">
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-xs">SSL Seguro</span>
                </div>
                <div className="glass px-4 py-2 rounded-lg">
                  <span className="text-xs">18+ Juego Responsable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Supernova. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Mapa del sitio
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/careers" className="hover:text-white transition-colors flex items-center gap-1">
                Trabaja con nosotros
                <Badge className="bg-poker-green text-white text-xs px-1 py-0">
                  Hiring
                </Badge>
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-600 mt-6">
            El juego puede ser adictivo. Juega responsablemente. Solo para mayores de 18 años.
          </p>
        </div>
      </div>
    </footer>
  );
}