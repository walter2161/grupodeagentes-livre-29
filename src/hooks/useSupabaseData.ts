import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

type TableName = 'profiles' | 'agents' | 'groups' | 'guidelines' | 'documents' | 'appointments' | 'consultation_protocols' | 'agent_interactions' | 'chat_messages' | 'group_messages' | 'agent_memory' | 'virtual_rooms' | 'daily_disclaimers';

export function useSupabaseData<T>(
  table: TableName,
  initialValue: T,
  columns = '*'
): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean, () => Promise<void>] {
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setData(initialValue);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .select(columns)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      if (result && result.length > 0) {
        // Se for um array, retornar o array completo
        if (Array.isArray(initialValue)) {
          setData(result as T);
        } else {
          // Se for um objeto único, retornar o primeiro item
          setData(result[0] as T);
        }
      } else {
        setData(initialValue);
      }
    } catch (error) {
      console.error(`Error loading data from ${table}:`, error);
      setData(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, table, columns, initialValue]);

  const saveData = useCallback(async (value: T | ((prev: T) => T)) => {
    if (!user?.id) {
      console.warn('No user authenticated, cannot save data');
      return;
    }

    const valueToStore = value instanceof Function ? value(data) : value;
    setData(valueToStore);

    try {
      // Se for um array, vamos fazer upsert de cada item
      if (Array.isArray(valueToStore)) {
        for (const item of valueToStore) {
          const itemWithUserId = { ...item, user_id: user.id };
          
          // Verificar se já existe um registro com este ID customizado
          if (item.agent_id || item.group_id) {
            const idField = item.agent_id ? 'agent_id' : 'group_id';
            const idValue = item.agent_id || item.group_id;
            
            const { error } = await supabase
              .from(table)
              .upsert(itemWithUserId, {
                onConflict: `user_id,${idField}`
              });

            if (error) {
              throw error;
            }
          } else {
            // Para itens sem ID customizado, fazer insert simples
            const { error } = await supabase
              .from(table)
              .upsert(itemWithUserId);

            if (error) {
              throw error;
            }
          }
        }
      } else {
        // Para objeto único, fazer upsert direto
        const itemWithUserId = { ...(valueToStore as any), user_id: user.id };
        
        const { error } = await supabase
          .from(table)
          .upsert(itemWithUserId);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error saving data to ${table}:`, error);
    }
  }, [user?.id, table, data]);

  // Load data when user changes or component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  return [data, saveData, isLoading, loadData];
}

// Hooks específicos para cada tipo de dados
export function useSupabaseProfile() {
  const { user } = useSupabaseAuth();
  const defaultProfile = {
    id: '',
    user_id: user?.id || '',
    name: user?.user_metadata?.name || user?.email || 'Usuário',
    email: user?.email || '',
    avatar: '/src/assets/default-user-avatar.png',
    bio: 'Olá! Sou um usuário do Chathy.',
    preferences: { theme: 'light', language: 'pt-BR' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return useSupabaseData('profiles', defaultProfile);
}

export function useSupabaseAgents() {
  return useSupabaseData('agents', [], '*');
}

export function useSupabaseGroups() {
  return useSupabaseData('groups', [], '*');
}

export function useSupabaseGuidelines() {
  return useSupabaseData('guidelines', [], '*');
}

export function useSupabaseDocuments() {
  return useSupabaseData('documents', [], '*');
}

export function useSupabaseAppointments() {
  return useSupabaseData('appointments', [], '*');
}

export function useSupabaseConsultationProtocols() {
  return useSupabaseData('consultation_protocols', [], '*');
}

export function useSupabaseAgentInteractions() {
  return useSupabaseData('agent_interactions', [], '*');
}

// Hook para mensagens de chat
export function useSupabaseChatMessages(agentId: string) {
  const { user } = useSupabaseAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    if (!user?.id || !agentId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading chat messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, agentId]);

  const saveMessage = useCallback(async (message: any) => {
    if (!user?.id) return;

    try {
      const messageWithUserId = {
        ...message,
        user_id: user.id,
        agent_id: agentId,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert(messageWithUserId);

      if (error) {
        throw error;
      }

      // Recarregar mensagens após salvar
      await loadMessages();
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }, [user?.id, agentId, loadMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return { messages, saveMessage, isLoading, loadMessages };
}

// Hook para memória do agente
export function useSupabaseAgentMemory(agentId: string) {
  const { user } = useSupabaseAuth();
  const [memory, setMemory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMemory = useCallback(async () => {
    if (!user?.id || !agentId) {
      setMemory(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agent_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows returned
        throw error;
      }

      if (data) {
        setMemory(data);
      } else {
        // Criar nova memória se não existir
        const newMemory = {
          user_id: user.id,
          agent_id: agentId,
          conversation_history: [],
          personal_notes: '',
          preferences: {},
          last_interaction: new Date().toISOString(),
        };

        const { data: createdMemory, error: createError } = await supabase
          .from('agent_memory')
          .insert(newMemory)
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setMemory(createdMemory);
      }
    } catch (error) {
      console.error('Error loading agent memory:', error);
      setMemory(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, agentId]);

  const updateMemory = useCallback(async (updates: any) => {
    if (!user?.id || !memory) return;

    try {
      const updatedMemory = {
        ...memory,
        ...updates,
        last_interaction: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('agent_memory')
        .update(updatedMemory)
        .eq('user_id', user.id)
        .eq('agent_id', agentId);

      if (error) {
        throw error;
      }

      setMemory(updatedMemory);
    } catch (error) {
      console.error('Error updating agent memory:', error);
    }
  }, [user?.id, agentId, memory]);

  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  return { memory, updateMemory, isLoading };
}