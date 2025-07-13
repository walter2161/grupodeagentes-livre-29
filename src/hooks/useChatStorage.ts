import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/apiService';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'psychologist';
  timestamp: Date;
  audio_url?: string;
}

export function useChatStorage(agentId: string): [ChatMessage[], (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => Promise<void>, boolean] {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load chat messages from API
  const loadMessages = useCallback(async () => {
    if (!user?.id || !agentId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiService.getChatMessages(user.id, agentId);
      if (data && Array.isArray(data)) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp),
          audio_url: msg.audio_url
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, agentId]);

  // Save messages to API
  const saveMessages = useCallback(async (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    if (!user?.id || !agentId) {
      console.warn('No user authenticated or agent ID, cannot save messages');
      return;
    }

    try {
      const messagesToStore = newMessages instanceof Function ? newMessages(messages) : newMessages;
      setMessages(messagesToStore);

      // Find new messages that need to be saved
      const existingIds = new Set(messages.map(m => m.id));
      const newMessagesToSave = messagesToStore.filter(msg => !existingIds.has(msg.id));

      // Save each new message to the API
      for (const message of newMessagesToSave) {
        await apiService.saveChatMessage({
          id: message.id,
          user_id: user.id,
          agent_id: agentId,
          content: message.content,
          sender: message.sender === 'psychologist' ? 'agent' : message.sender, // Map psychologist to agent for API
          audio_url: message.audio_url
        });
      }
    } catch (error) {
      console.error('Error saving chat messages:', error);
      // Revert the local state if API call fails
      setMessages(messages);
      throw error;
    }
  }, [user?.id, agentId, messages]);

  // Load messages when user or agent changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return [messages, saveMessages, isLoading];
}

// Hook for group chat messages
export function useGroupChatStorage(groupId: string): [any[], (messages: any[] | ((prev: any[]) => any[])) => Promise<void>, boolean] {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load group chat messages from API
  const loadMessages = useCallback(async () => {
    if (!user?.id || !groupId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiService.getGroupMessages(user.id, groupId);
      if (data && Array.isArray(data)) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          senderName: msg.sender_name,
          senderAvatar: msg.sender_avatar,
          agentId: msg.agent_id,
          timestamp: new Date(msg.timestamp),
          groupId: msg.group_id,
          mentions: msg.mentions || [],
          isResponse: msg.is_response,
          respondingTo: msg.responding_to
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading group chat messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, groupId]);

  // Save group messages to API
  const saveMessages = useCallback(async (newMessages: any[] | ((prev: any[]) => any[])) => {
    if (!user?.id || !groupId) {
      console.warn('No user authenticated or group ID, cannot save messages');
      return;
    }

    try {
      const messagesToStore = newMessages instanceof Function ? newMessages(messages) : newMessages;
      setMessages(messagesToStore);

      // Find new messages that need to be saved
      const existingIds = new Set(messages.map(m => m.id));
      const newMessagesToSave = messagesToStore.filter(msg => !existingIds.has(msg.id));

      // Save each new message to the API
      for (const message of newMessagesToSave) {
        await apiService.saveGroupMessage({
          id: message.id,
          user_id: user.id,
          group_id: groupId,
          content: message.content,
          sender: message.sender,
          sender_name: message.senderName,
          sender_avatar: message.senderAvatar,
          agent_id: message.agentId,
          mentions: message.mentions,
          is_response: message.isResponse,
          responding_to: message.respondingTo
        });
      }
    } catch (error) {
      console.error('Error saving group chat messages:', error);
      // Revert the local state if API call fails
      setMessages(messages);
      throw error;
    }
  }, [user?.id, groupId, messages]);

  // Load messages when user or group changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return [messages, saveMessages, isLoading];
}