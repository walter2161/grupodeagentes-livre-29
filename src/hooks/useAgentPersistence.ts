import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Agent } from '@/types/agents';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para garantir persistência segura de agentes criados pelos usuários
 * Evita perda de dados durante operações de limpeza de localStorage
 */
export const useAgentPersistence = (agents: Agent[], setAgents: (agents: Agent[]) => void) => {
  const { user } = useAuth();

  // Função para verificar e restaurar agentes se necessário
  const verifyAndRestoreAgents = () => {
    if (!user?.id) return;

    const userAgentKey = `${user.id}-agents`;
    const backupKey = `${user.id}-agents-backup`;
    
    // Verificar se os agentes foram perdidos
    const currentAgents = localStorage.getItem(userAgentKey);
    
    if (!currentAgents || currentAgents === '[]') {
      // Tentar restaurar do backup
      const backupAgents = localStorage.getItem(backupKey);
      if (backupAgents) {
        try {
          const parsedBackup = JSON.parse(backupAgents);
          if (Array.isArray(parsedBackup) && parsedBackup.length > 0) {
            localStorage.setItem(userAgentKey, backupAgents);
            setAgents(parsedBackup);
            console.log('Agentes restaurados do backup:', parsedBackup.length);
            
            // Notificar usuário sobre a restauração
            setTimeout(() => {
              toast({
                title: "Agentes Restaurados",
                description: `${parsedBackup.length} agente(s) foram restaurados automaticamente do backup.`,
                duration: 5000,
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Erro ao restaurar backup de agentes:', error);
        }
      }
    }
  };

  // Função para criar backup automático dos agentes
  const createAgentBackup = (agentsList: Agent[]) => {
    if (!user?.id || !Array.isArray(agentsList)) return;

    const userAgentsOnly = agentsList.filter(agent => 
      !agent.id.startsWith('default-') && agent.id.startsWith('agent-')
    );

    if (userAgentsOnly.length > 0) {
      const backupKey = `${user.id}-agents-backup`;
      const backupData = {
        agents: userAgentsOnly,
        timestamp: new Date().toISOString(),
        userId: user.id
      };
      
      try {
        localStorage.setItem(backupKey, JSON.stringify(userAgentsOnly));
        localStorage.setItem(`${backupKey}-meta`, JSON.stringify(backupData));
      } catch (error) {
        console.error('Erro ao criar backup de agentes:', error);
      }
    }
  };

  // Verificar integridade na inicialização
  useEffect(() => {
    if (user?.id) {
      verifyAndRestoreAgents();
    }
  }, [user?.id]);

  // Criar backup sempre que os agentes mudarem
  useEffect(() => {
    if (user?.id && agents && agents.length > 0) {
      // Aguardar um pouco para garantir que a mudança foi salva
      const timeoutId = setTimeout(() => {
        createAgentBackup(agents);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [agents, user?.id]);

  // Função para recuperar estatísticas de backup
  const getBackupInfo = () => {
    if (!user?.id) return null;

    const backupMetaKey = `${user.id}-agents-backup-meta`;
    const backupMeta = localStorage.getItem(backupMetaKey);
    
    if (backupMeta) {
      try {
        return JSON.parse(backupMeta);
      } catch {
        return null;
      }
    }
    
    return null;
  };

  // Função para forçar restauração manual
  const forceRestoreFromBackup = () => {
    if (!user?.id) return false;

    const backupKey = `${user.id}-agents-backup`;
    const backupAgents = localStorage.getItem(backupKey);
    
    if (backupAgents) {
      try {
        const parsedBackup = JSON.parse(backupAgents);
        if (Array.isArray(parsedBackup)) {
          const userAgentKey = `${user.id}-agents`;
          localStorage.setItem(userAgentKey, backupAgents);
          setAgents(parsedBackup);
          return true;
        }
      } catch (error) {
        console.error('Erro ao forçar restauração:', error);
      }
    }
    
    return false;
  };

  return {
    verifyAndRestoreAgents,
    createAgentBackup,
    getBackupInfo,
    forceRestoreFromBackup
  };
};