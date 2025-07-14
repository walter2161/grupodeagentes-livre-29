import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/apiService';
import { useSupabaseAgents } from './useSupabaseAgents';
import { useSupabaseGroups } from './useSupabaseGroups';

export function useApiStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean] {
  const { user } = useAuth();
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from API
  const loadData = useCallback(async () => {
    if (!user?.id) {
      setStoredValue(initialValue);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiService.getStoredData(user.id, key);
      if (data !== null && data !== undefined) {
        setStoredValue(data as T);
        // Salvar no localStorage como backup
        localStorage.setItem(`${user.id}-${key}`, JSON.stringify(data));
      } else {
        // Tentar carregar do localStorage se API falhar
        const localData = localStorage.getItem(`${user.id}-${key}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            setStoredValue(parsedData as T);
          } catch {
            setStoredValue(initialValue);
          }
        } else {
          setStoredValue(initialValue);
        }
      }
    } catch (error) {
      console.error(`Error loading data for key "${key}":`, error);
      // Fallback para localStorage quando API falhar
      const localData = localStorage.getItem(`${user.id}-${key}`);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          setStoredValue(parsedData as T);
          console.log(`Loaded ${key} from localStorage fallback`);
        } catch {
          setStoredValue(initialValue);
        }
      } else {
        setStoredValue(initialValue);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, key, initialValue]);

  // Save data to API
  const setValue = useCallback(async (value: T | ((prev: T) => T)) => {
    if (!user?.id) {
      console.warn('No user authenticated, cannot save data');
      return;
    }

    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    
    // Sempre salvar no localStorage primeiro
    localStorage.setItem(`${user.id}-${key}`, JSON.stringify(valueToStore));

    try {
      await apiService.setStoredData(user.id, key, valueToStore);
    } catch (error) {
      console.error(`Error setting data for key "${key}":`, error);
      // Não reverter o estado local se já foi salvo no localStorage
      console.log(`Data saved to localStorage as fallback for key "${key}"`);
    }
  }, [user?.id, key, storedValue]);

  // Load data when user changes or component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  return [storedValue, setValue, isLoading];
}

// Specific hooks for common data types
export function useUserProfile() {
  const { user } = useAuth();
  const defaultProfile = {
    id: user?.id || 'default',
    user_id: user?.id || 'default',
    name: user?.name || 'Usuário',
    email: user?.email || '',
    avatar: '/src/assets/default-user-avatar.png',
    bio: 'Olá! Sou um usuário do Chathy.',
    preferences: {
      theme: 'light' as const,
      language: 'pt-BR'
    },
    created_at: new Date(),
    updated_at: new Date()
  };

  return useApiStorage('user-profile', defaultProfile);
}

// Substituído por hooks do Supabase - manter para compatibilidade
export function useAgents() {
  const { agents, saveAgent, deleteAgent, isLoading } = useSupabaseAgents();
  const setAgents = async (newAgents: any[]) => {
    // Esta função é mantida para compatibilidade mas não faz nada
    console.warn('useAgents setAgents is deprecated, use useSupabaseAgents instead');
  };
  return [agents, setAgents, isLoading];
}

export function useGroups() {
  const { groups, saveGroup, deleteGroup, isLoading } = useSupabaseGroups();
  const setGroups = async (newGroups: any[]) => {
    // Esta função é mantida para compatibilidade mas não faz nada
    console.warn('useGroups setGroups is deprecated, use useSupabaseGroups instead');
  };
  return [groups, setGroups, isLoading];
}

export function useGuidelines() {
  return useApiStorage('guidelines', []);
}

export function useDocuments() {
  return useApiStorage('documents', []);
}

export function useAppointments() {
  return useApiStorage('appointments', []);
}

export function useConsultationProtocols() {
  return useApiStorage('consultation-protocols', []);
}

export function useAgentInteractions() {
  return useApiStorage('agent-interactions', []);
}