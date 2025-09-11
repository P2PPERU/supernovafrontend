'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Trophy, Gamepad2, Newspaper, User, Shield, LogOut, Settings, Wallet, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Salas', href: '/rooms', icon: Gamepad2 },
  { name: 'Torneos', href: '/tournaments', icon: Trophy },
  { name: 'Ruleta', href: '/roulette', icon: Zap },
  { name: 'Noticias', href: '/news', icon: Newspaper },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo SUPERNOVA con tipografía original pero sin brillo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Efecto glow detrás del logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity scale-150" />
              
              {/* Logo de SUPERNOVA */}
              <div className="relative h-16 w-16 lg:h-20 lg:w-20 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <img 
                  src="/images/supernova-logo.png" 
                  alt="SUPERNOVA Poker Union"
                  className="h-16 w-16 lg:h-20 lg:w-20 object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                />
              </div>
            </div>
            
            {/* Texto SUPERNOVA con tipografía original pero sin efectos de brillo */}
            <div className="hidden sm:flex flex-col">
              <div className="relative">
                {/* Texto principal con tipografía original */}
                <h1 
                  className="text-3xl lg:text-4xl xl:text-5xl leading-none font-black tracking-wider relative z-10"
                  style={{
                    fontFamily: "'Orbitron', 'Bebas Neue', sans-serif",
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 25%, #ffffff 50%, #e0e0e0 75%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                    textShadow: '0 0 30px rgba(255,255,255,0.3)',
                  }}
                >
                  SUPERNOVA
                </h1>
              </div>
              
              {/* Subtítulo POKER UNION */}
              <div className="relative">
                <span 
                  className="text-xs lg:text-sm mt-1 font-bold tracking-[0.3em] relative z-10"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 50%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))',
                    textTransform: 'uppercase',
                  }}
                >
                  POKER UNION
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors relative"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Balance */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <Wallet className="h-4 w-4 text-poker-gold" />
                  <span className="font-semibold text-poker-gold">
                    ${Number(user?.balance || 0).toFixed(2)}
                  </span>
                </div>

                {/* Admin button */}
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="border-poker-green/50 hover:bg-poker-green/10 text-poker-green"
                  >
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 ring-2 ring-poker-green/50">
                        <AvatarImage src={user?.profile?.avatar} alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-poker-green border-2 border-background" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass border-white/10" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.profile?.avatar} alt={user?.username} />
                          <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.username}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                          <Badge variant="outline" className="w-fit mt-1 text-xs">
                            {user?.role === 'admin' ? 'Administrador' : user?.role === 'editor' ? 'Editor' : 'VIP Gold'}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center">
                        <Home className="mr-3 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/bonus" className="flex items-center">
                        <Gift className="mr-3 h-4 w-4" />
                        Mis Bonos
                        <Badge className="ml-auto bg-poker-green text-white">3</Badge>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:text-red-300">
                      <LogOut className="mr-3 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-poker-green to-poker-blue hover:opacity-90 btn-glow">
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] glass border-white/10">
                {/* Logo en mobile con tipografía original pero sin efectos de brillo */}
                <div className="flex items-center space-x-3 mb-8">
                  <img 
                    src="/images/supernova-logo.png" 
                    alt="SUPERNOVA"
                    className="h-14 w-14 object-contain filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                  />
                  <div>
                    <div className="relative">
                      <h2 
                        className="text-2xl font-black"
                        style={{
                          fontFamily: "'Orbitron', 'Bebas Neue', sans-serif",
                          fontWeight: 900,
                          fontStyle: 'italic',
                          textTransform: 'uppercase',
                          background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 25%, #ffffff 50%, #e0e0e0 75%, #ffffff 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                          textShadow: '0 0 30px rgba(255,255,255,0.3)',
                        }}
                      >
                        SUPERNOVA
                      </h2>
                    </div>
                    <div className="relative">
                      <div 
                        className="text-xs font-bold tracking-[0.3em]"
                        style={{
                          fontFamily: "'Orbitron', sans-serif",
                          textTransform: 'uppercase',
                          background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 50%, #10b981 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))',
                        }}
                      >
                        POKER UNION
                      </div>
                    </div>
                  </div>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-lg font-medium hover:text-poker-green transition-colors p-3 rounded-lg hover:bg-white/5"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="pt-4 border-t border-white/10">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg bg-white/5">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user?.profile?.avatar} alt={user?.username} />
                            <AvatarFallback className="bg-gradient-to-br from-poker-green to-poker-blue text-white">
                              {user?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Wallet className="h-3 w-3 text-poker-gold" />
                              <span className="text-sm font-semibold text-poker-gold">
                                ${Number(user?.balance || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Home className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <User className="h-5 w-5" />
                            <span>Mi Perfil</span>
                          </Link>
                          <Link
                            href="/bonus"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Gift className="h-5 w-5" />
                            <span>Mis Bonos</span>
                            <Badge className="ml-auto bg-poker-green text-white">3</Badge>
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                            }}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-red-400 w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full glass border-white/20" asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Iniciar Sesión
                          </Link>
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-poker-green to-poker-blue" asChild>
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            Registrarse
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}