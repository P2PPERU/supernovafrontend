import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Solo aplicar a rutas /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Aquí podrías verificar el rol del usuario decodificando el JWT
    // Por ahora asumimos que la verificación del rol se hace en el cliente
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};