import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });

        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Chathy",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Até logo!",
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        toast({
          title: "Verifique seu email",
          description: "Enviamos um link de confirmação para seu email.",
        });
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error: error.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message };
    }
  }, []);

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!authState.user,
  };
};