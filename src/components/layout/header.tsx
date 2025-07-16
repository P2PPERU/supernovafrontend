'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Home, Trophy, Gamepad2, Newspaper, User as UserIcon, Shield } from 'lucide-react';
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

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Noticias', href: '/news', icon: Newspaper },
  { name: 'Ruleta', href: '/roulette', icon: Gamepad2 },
  { name: 'Rankings', href: '/rankings', icon: Trophy },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-poker-green flex items-center justify-center">
              <span className="text-white font-bold text-xl">♠</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              SUPERNOVA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <Button variant="outline" size="sm" asChild className="bg-poker-green/10 border-poker-green text-poker-green hover:bg-poker-green/20">
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile?.avatar} alt={user?.username} />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(user?.role === 'admin' || user?.role === 'editor') && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="text-poker-green font-medium">
                            Panel Administrativo
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bonus">Mis Bonos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="pt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.profile?.avatar} alt={user?.username} />
                            <AvatarFallback>
                              {user?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {(user?.role === 'admin' || user?.role === 'editor') && (
                            <Link
                              href="/admin"
                              onClick={() => setIsOpen(false)}
                              className="block w-full text-left px-2 py-1.5 text-sm font-medium text-poker-green hover:bg-accent rounded-md"
                            >
                              Panel Administrativo
                            </Link>
                          )}
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md"
                          >
                            Mi Perfil
                          </Link>
                          <Link
                            href="/bonus"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md"
                          >
                            Mis Bonos
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                            }}
                            className="block w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-accent rounded-md"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Iniciar Sesión
                          </Link>
                        </Button>
                        <Button className="w-full" asChild>
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
    </header>
  );
}