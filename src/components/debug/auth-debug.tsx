'use client';

import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';

export function AuthDebug() {
  const { user, token, isAuthenticated } = useAuthStore();
  
  const cookieToken = Cookies.get('token');
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (process.env.NODE_ENV !== 'development') {
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