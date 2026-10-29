import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ApiError, apiRequest, refreshAccess, setAccessToken, setUnauthorizedHandler } from '@/shared/api';
import { AuthContext, type AuthContextValue, type User } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const requestId = useRef(0);

  async function restoreSession() {
    const id = ++requestId.current;
    setStatus('loading');
    try {
      await refreshAccess();
      const currentUser = await apiRequest<User>('/auth/me');
      if (id === requestId.current) {
        setUser(currentUser);
        setStatus('ready');
      }
    } catch (error) {
      if (id !== requestId.current) return;
      setAccessToken(null);
      setUser(null);
      setStatus(error instanceof ApiError && error.status === 401 ? 'ready' : 'error');
    }
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      requestId.current++;
      setUser(null);
      setStatus('ready');
    });
    void restoreSession();
    return () => {
      requestId.current++;
      setUnauthorizedHandler(null);
    };
  }, []);

  async function signIn(username: string, password: string) {
    requestId.current++;
    const data = await apiRequest<{ access_token: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    }, false);
    setAccessToken(data.access_token);
    const currentUser = await apiRequest<User>('/auth/me');
    setUser(currentUser);
    setStatus('ready');
  }

  async function signOut() {
    await apiRequest<void>('/auth/logout', { method: 'POST' }, false);
    requestId.current++;
    setAccessToken(null);
    setUser(null);
    setStatus('ready');
  }

  return (
    <AuthContext.Provider value={{ user, status, restoreSession, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
