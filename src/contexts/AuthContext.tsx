
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ user: any; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  isAuthenticated: boolean;
  // Manter compatibilidade com API antiga
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useSupabaseAuth();

  // Mapear as funções para manter compatibilidade com a API antiga
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await authState.signIn(email, password);
    return !result.error;
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    const result = await authState.signUp(email, password, name);
    return !result.error;
  };

  const logout = async () => {
    await authState.signOut();
  };

  const value: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp: authState.signUp,
    signIn: authState.signIn,
    signOut: authState.signOut,
    resetPassword: authState.resetPassword,
    isAuthenticated: authState.isAuthenticated,
    // Manter compatibilidade com API antiga
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
