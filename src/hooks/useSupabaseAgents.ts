import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseData } from './useSupabaseData';
import { Agent, defaultAgents } from '@/types/agents';

export const useSupabaseAgents = () => {
  const { user } = useSupabaseAuth();
  const [agents, setAgents, isLoading, loadAgents] = useSupabaseData<any[]>('agents', [], '*');

  // Função para converter dados do Supabase para o formato Agent
  const convertToAgent = (dbAgent: any): Agent => ({
    id: dbAgent.agent_id,
    name: dbAgent.name,
    title: dbAgent.title,
    specialty: dbAgent.specialty,
    description: dbAgent.description,
    icon: dbAgent.icon,
    color: dbAgent.color,
    experience: dbAgent.experience,
    approach: dbAgent.approach,
    guidelines: dbAgent.guidelines,
    personaStyle: dbAgent.persona_style,
    documentation: dbAgent.documentation,
    isActive: dbAgent.is_active,
    avatar: dbAgent.avatar,
  });

  // Função para converter Agent para formato do banco
  const convertFromAgent = (agent: Agent) => ({
    agent_id: agent.id,
    name: agent.name,
    title: agent.title,
    specialty: agent.specialty,
    description: agent.description,
    icon: agent.icon,
    color: agent.color,
    experience: agent.experience,
    approach: agent.approach,
    guidelines: agent.guidelines,
    persona_style: agent.personaStyle,
    documentation: agent.documentation,
    is_active: agent.isActive,
    avatar: agent.avatar,
  });

  // Carregar agentes do usuário + agentes padrão
  const getAllAgents = useCallback((): Agent[] => {
    const userAgents = Array.isArray(agents) ? agents.map(convertToAgent) : [];
    
    // Combinar agentes do usuário com agentes padrão
    const allAgents = [...defaultAgents];
    
    // Adicionar agentes personalizados do usuário (que não são padrão)
    userAgents.forEach(userAgent => {
      if (!defaultAgents.find(defaultAgent => defaultAgent.id === userAgent.id)) {
        allAgents.push(userAgent);
      }
    });
    
    return allAgents.filter(agent => agent.isActive);
  }, [agents]);

  // Salvar agente
  const saveAgent = useCallback(async (agent: Agent) => {
    if (!user?.id) return;

    try {
      const agentData = convertFromAgent(agent);
      
      const { error } = await supabase
        .from('agents')
        .upsert({
          ...agentData,
          user_id: user.id,
        }, {
          onConflict: 'user_id,agent_id'
        });

      if (error) {
        throw error;
      }

      // Recarregar dados
      await loadAgents();
    } catch (error) {
      console.error('Error saving agent:', error);
      throw error;
    }
  }, [user?.id, loadAgents]);

  // Deletar agente
  const deleteAgent = useCallback(async (agentId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('user_id', user.id)
        .eq('agent_id', agentId);

      if (error) {
        throw error;
      }

      // Recarregar dados
      await loadAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }, [user?.id, loadAgents]);

  return {
    agents: getAllAgents(),
    saveAgent,
    deleteAgent,
    isLoading,
    loadAgents,
  };
};