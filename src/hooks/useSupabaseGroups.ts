import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseData } from './useSupabaseData';
import { Group, defaultGroups } from '@/types/groups';

export const useSupabaseGroups = () => {
  const { user } = useSupabaseAuth();
  const [groups, setGroups, isLoading, loadGroups] = useSupabaseData<any[]>('groups', [], '*');

  // Função para converter dados do Supabase para o formato Group
  const convertToGroup = (dbGroup: any): Group => ({
    id: dbGroup.group_id,
    name: dbGroup.name,
    description: dbGroup.description,
    icon: dbGroup.icon,
    color: dbGroup.color,
    members: dbGroup.members || [],
    isDefault: dbGroup.is_default,
    createdBy: dbGroup.created_by as 'user' | 'system',
    createdAt: new Date(dbGroup.created_at),
  });

  // Função para converter Group para formato do banco
  const convertFromGroup = (group: Group) => ({
    group_id: group.id,
    name: group.name,
    description: group.description,
    icon: group.icon,
    color: group.color,
    members: group.members,
    is_default: group.isDefault,
    created_by: group.createdBy,
  });

  // Carregar grupos do usuário + grupos padrão
  const getAllGroups = useCallback((): Group[] => {
    const userGroups = Array.isArray(groups) ? groups.map(convertToGroup) : [];
    
    // Combinar grupos do usuário com grupos padrão
    const allGroups = [...defaultGroups];
    
    // Adicionar grupos personalizados do usuário (que não são padrão)
    userGroups.forEach(userGroup => {
      if (!defaultGroups.find(defaultGroup => defaultGroup.id === userGroup.id)) {
        allGroups.push(userGroup);
      }
    });
    
    return allGroups;
  }, [groups]);

  // Salvar grupo
  const saveGroup = useCallback(async (group: Group) => {
    if (!user?.id) return;

    try {
      const groupData = convertFromGroup(group);
      
      const { error } = await supabase
        .from('groups')
        .upsert({
          ...groupData,
          user_id: user.id,
        }, {
          onConflict: 'user_id,group_id'
        });

      if (error) {
        throw error;
      }

      // Recarregar dados
      await loadGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      throw error;
    }
  }, [user?.id, loadGroups]);

  // Deletar grupo
  const deleteGroup = useCallback(async (groupId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('user_id', user.id)
        .eq('group_id', groupId);

      if (error) {
        throw error;
      }

      // Recarregar dados
      await loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }, [user?.id, loadGroups]);

  return {
    groups: getAllGroups(),
    saveGroup,
    deleteGroup,
    isLoading,
    loadGroups,
  };
};