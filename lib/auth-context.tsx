'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

interface AuthUser {
  name: string;
  email: string;
  image: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  signIn: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const signIn = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  const logout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  const user: AuthUser | null = session?.user
    ? {
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
        role: 'Cabinet Member',
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.user,
        isLoading: isPending,
        user,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
