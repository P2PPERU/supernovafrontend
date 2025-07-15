import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  juego: [
    { name: 'Cómo Jugar', href: '/how-to-play' },
    { name: 'Reglas', href: '/rules' },
    { name: 'Estrategias', href: '/strategies' },
    { name: 'Torneos', href: '/tournaments' },
  ],
  club: [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Afiliados', href: '/affiliates' },
  ],
  legal: [
    { name: 'Términos y Condiciones', href: '/terms' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Juego Responsable', href: '/responsible-gaming' },
    { name: 'FAQ', href: '/faq' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-poker-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-poker-green flex items-center justify-center">
                <span className="text-white font-bold text-xl">♠</span>
              </div>
              <span className="font-bold text-xl">SUPERNOVA</span>
            </div>
            <p className="text-gray-400 text-sm">
              El mejor club de poker online. Únete a miles de jugadores y disfruta de la
              experiencia más emocionante.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links del juego */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Juego</h3>
            <ul className="space-y-2">
              {footerLinks.juego.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links del club */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Club</h3>
            <ul className="space-y-2">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links legales */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Supernova. Todos los derechos reservados.
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Juega responsablemente. El juego puede ser adictivo.
          </p>
        </div>
      </div>
    </footer>
  );
}