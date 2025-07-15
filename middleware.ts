import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/news',
  '/rankings',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/faq',
];

// Rutas que requieren roles específicos
const roleBasedPaths = {
  admin: ['/admin'],
  agent: ['/agent'],
  editor: ['/editor'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir acceso a archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // archivos estáticos
  ) {
    return NextResponse.next();
  }

  // Obtener token de las cookies
  const token = request.cookies.get('token')?.value;
  
  // Verificar si es una ruta pública
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token y el usuario intenta acceder a login/register, redirigir a dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // TODO: Verificar roles cuando tengamos decodificación de JWT
  // Por ahora, permitir acceso si hay token
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};