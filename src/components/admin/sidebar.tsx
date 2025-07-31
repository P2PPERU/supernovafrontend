'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Gift,
  Newspaper,
  Gamepad2,
  Code2,
  Trophy,
  BarChart3,
  Settings,
  Shield,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AdminSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  badge?: { text: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' };
  subItems?: Array<{ title: string; href: string }>;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
      },
    ],
  },
  {
    title: 'Gestión de Contenido',
    items: [
      {
        title: 'Noticias',
        href: '/admin/news',
        icon: Newspaper,
        subItems: [
          { title: 'Todas las Noticias', href: '/admin/news' },
          { title: 'Crear Noticia', href: '/admin/news/create' },
          { title: 'Estadísticas', href: '/admin/news/stats' },
        ],
      },
      {
        title: 'Bonificaciones',
        href: '/admin/bonuses',
        icon: Gift,
      },
    ],
  },
  {
    title: 'Ruleta',
    items: [
      {
        title: 'Premios',
        href: '/admin/roulette/prizes',
        icon: Gamepad2,
      },
      {
        title: 'Validaciones',
        href: '/admin/roulette/validations',
        icon: CheckCircle,
        badge: { text: '5', variant: 'destructive' as const },
      },
      {
        title: 'Códigos',
        href: '/admin/roulette/codes',
        icon: Code2,
      },
      {
        title: 'Estadísticas',
        href: '/admin/roulette/stats',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Rankings',
        href: '/admin/rankings',
        icon: Trophy,
      },
      {
        title: 'Reportes',
        href: '/admin/reports',
        icon: FileText,
      },
      {
        title: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => pathname === subItem.href);
    }
    return item.href !== '/admin' && pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => onOpenChange(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-gray-900 text-white transition-all duration-300',
          open ? 'w-64' : 'w-20',
          'lg:z-40'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-poker-green">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-bold text-xl whitespace-nowrap overflow-hidden"
                  >
                    Admin Panel
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-6">
              {menuItems.map((section) => (
                <div key={section.title}>
                  {open && (
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item);
                      const isExpanded = expandedItems.includes(item.href);
                      const hasSubItems = item.subItems && item.subItems.length > 0;

                      return (
                        <div key={item.href}>
                          <div className="relative">
                            <Link
                              href={!hasSubItems ? item.href : '#'}
                              onClick={hasSubItems && open ? (e) => {
                                e.preventDefault();
                                toggleExpanded(item.href);
                              } : undefined}
                              className={cn(
                                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-poker-green text-white'
                                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                                !open && 'justify-center'
                              )}
                            >
                              <Icon
                                className={cn('h-5 w-5 flex-shrink-0', open && 'mr-3')}
                              />
                              <AnimatePresence>
                                {open && (
                                  <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex-1 overflow-hidden whitespace-nowrap"
                                  >
                                    {item.title}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                              {open && item.badge && (
                                <Badge variant={item.badge.variant} className="ml-auto">
                                  {item.badge.text}
                                </Badge>
                              )}
                              {open && hasSubItems && (
                                <ChevronRight 
                                  className={cn(
                                    'ml-auto h-4 w-4 transition-transform',
                                    isExpanded && 'rotate-90'
                                  )}
                                />
                              )}
                              {!open && item.badge && (
                                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
                              )}
                            </Link>
                          </div>

                          {/* Submenu */}
                          {open && hasSubItems && (
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="ml-8 mt-1 space-y-1 overflow-hidden"
                                >
                                  {item.subItems?.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className={cn(
                                        'block rounded-md px-3 py-2 text-sm transition-colors',
                                        pathname === subItem.href
                                          ? 'bg-gray-800 text-poker-green'
                                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                      )}
                                    >
                                      {subItem.title}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white',
                !open && 'justify-center'
              )}
            >
              <ChevronRight className={cn('h-5 w-5', open && 'mr-3')} />
              {open && <span>Volver al sitio</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}