import { createContext, useContext } from 'react';

export type User = { id: number; username: string };

export type AuthContextValue = {
  user: User | null;
  status: 'loading' | 'ready' | 'error';
  restoreSession: () => void;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth нужно вызывать внутри AuthProvider');
  return value;
}
