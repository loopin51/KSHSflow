'use client';

import type { User } from '@/lib/mock-data';
import { users } from '@/lib/mock-data';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (email: string): boolean => {
    // In a real app, you'd verify credentials against a backend.
    // For this mock setup, we'll just log in the first user from our mock data.
    const mockUserToLogin = users[0];
    if (mockUserToLogin) {
      setUser(mockUserToLogin);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
