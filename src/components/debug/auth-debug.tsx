// src/components/debug/auth-debug.tsx
'use client';

import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function AuthDebug() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [cookieToken, setCookieToken] = useState<string | null>(null);
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
    setCookieToken(Cookies.get('token') || null);
    setLocalStorageToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }, []);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return null;
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 opacity-90">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>isAuthenticated:</strong> {isAuthenticated ? '✅ true' : '❌ false'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.username : '❌ null'}
        </div>
        <div>
          <strong>Token (Store):</strong> {token ? `${token.substring(0, 20)}...` : '❌ null'}
        </div>
        <div>
          <strong>Token (Cookie):</strong> {cookieToken ? `${cookieToken.substring(0, 20)}...` : '❌ null'}
        </div>
        <div>
          <strong>Token (LocalStorage):</strong> {localStorageToken ? `${localStorageToken.substring(0, 20)}...` : '❌ null'}
        </div>
      </CardContent>
    </Card>
  );
}