import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSpacetimeDB, useTable } from 'spacetimedb/react';
import { tables } from '@/module_bindings';
import { Identity } from 'spacetimedb';

interface AuthContextType {
  identity: Identity | null | undefined;
  user: any | null;
  shop: any | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { identity } = useSpacetimeDB();
  const users: any[] = (useTable(tables.users) as any) || [];
  const shops: any[] = (useTable(tables.shops) as any) || [];
  const [isLoading, setIsLoading] = useState(true);

  const user = identity ? users.find(u => u.id.toHexString() === identity.toHexString()) : null;
  const shop = user ? shops.find(s => s.id.toHexString() === user.shopId.toHexString()) : null;

  useEffect(() => {
    // If identity is null, we are not connected yet or logged out
    if (identity === undefined) return;
    
    // Once we have an identity, if no user record exists, we might still be loading or need to init
    if (identity && user) {
      setIsLoading(false);
    } else if (identity && !user) {
      // Small delay to allow tables to sync
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [identity, user]);

  const logout = () => {
    // SpacetimeDB usually handles tokens in localStorage
    const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
    const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'react-ts';
    const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ identity, user, shop, isLoading, logout }}>
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
