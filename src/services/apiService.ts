const API_BASE_URL = 'https://lightblue-fox-143990.hostingersite.com/api/api.php';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

class ApiService {
  private async makeRequest<T>(
    method: 'GET' | 'POST',
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      let url = API_BASE_URL;
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'GET') {
        const queryParams = new URLSearchParams(params);
        url += '?' + queryParams.toString();
      } else {
        options.body = JSON.stringify(params);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const textResponse = await response.text();
      
      // Se a resposta estiver vazia ou for null, retornar um objeto vazio
      if (!textResponse || textResponse.trim() === '' || textResponse.trim() === 'null') {
        console.warn('API returned empty or null response');
        return {} as T;
      }
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (error) {
        console.error('Failed to parse JSON response:', textResponse);
        throw new Error('Invalid JSON response from server');
      }
      
      // Se data for null ou undefined, retornar objeto vazio
      if (data === null || data === undefined) {
        console.warn('API returned null data');
        return {} as T;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User operations
  async getUser(userId: string) {
    return this.makeRequest('GET', { table: 'users', user_id: userId });
  }

  async getAllUsers() {
    return this.makeRequest('GET', { table: 'users', key: 'all' });
  }

  async createUser(userData: any) {
    return this.makeRequest('POST', { table: 'users', action: 'insert', ...userData });
  }

  // User Profile operations
  async getUserProfile(userId: string) {
    return this.makeRequest('GET', { table: 'user_profiles', user_id: userId });
  }

  async saveUserProfile(profileData: any) {
    return this.makeRequest('POST', { table: 'user_profiles', action: 'update', ...profileData });
  }

  // Agents operations
  async getAgents(userId: string) {
    return this.makeRequest('GET', { table: 'agents', user_id: userId });
  }

  async saveAgent(agentData: any) {
    return this.makeRequest('POST', { table: 'agents', action: 'update', ...agentData });
  }

  async deleteAgent(agentId: string, userId: string) {
    return this.makeRequest('POST', { table: 'agents', action: 'delete', id: agentId, user_id: userId });
  }

  // Groups operations
  async getGroups(userId: string) {
    return this.makeRequest('GET', { table: 'groups', user_id: userId });
  }

  async saveGroup(groupData: any) {
    return this.makeRequest('POST', { table: 'groups', action: 'update', ...groupData });
  }

  async deleteGroup(groupId: string, userId: string) {
    return this.makeRequest('POST', { table: 'groups', action: 'delete', id: groupId, user_id: userId });
  }

  // Chat Messages operations
  async getChatMessages(userId: string, agentId: string) {
    return this.makeRequest('GET', { table: 'chat_messages', user_id: userId, agent_id: agentId });
  }

  async saveChatMessage(messageData: any) {
    return this.makeRequest('POST', { table: 'chat_messages', ...messageData });
  }

  // Group Messages operations
  async getGroupMessages(userId: string, groupId: string) {
    return this.makeRequest('GET', { table: 'group_messages', user_id: userId, group_id: groupId });
  }

  async saveGroupMessage(messageData: any) {
    return this.makeRequest('POST', { table: 'group_messages', ...messageData });
  }

  // Agent Memory operations
  async getAgentMemory(userId: string, agentId: string) {
    return this.makeRequest('GET', { table: 'agent_memory', user_id: userId, agent_id: agentId });
  }

  async saveAgentMemory(memoryData: any) {
    return this.makeRequest('POST', { table: 'agent_memory', ...memoryData });
  }

  // Agent Interactions operations
  async getAgentInteractions(userId: string) {
    return this.makeRequest('GET', { table: 'agent_interactions', user_id: userId });
  }

  async saveAgentInteraction(interactionData: any) {
    return this.makeRequest('POST', { table: 'agent_interactions', ...interactionData });
  }

  // Guidelines operations
  async getGuidelines(userId: string) {
    return this.makeRequest('GET', { table: 'guidelines', user_id: userId });
  }

  async saveGuideline(guidelineData: any) {
    return this.makeRequest('POST', { table: 'guidelines', ...guidelineData });
  }

  // Documents operations
  async getDocuments(userId: string) {
    return this.makeRequest('GET', { table: 'documents', user_id: userId });
  }

  async saveDocument(documentData: any) {
    return this.makeRequest('POST', { table: 'documents', ...documentData });
  }

  // Appointments operations
  async getAppointments(userId: string) {
    return this.makeRequest('GET', { table: 'appointments', user_id: userId });
  }

  async saveAppointment(appointmentData: any) {
    return this.makeRequest('POST', { table: 'appointments', ...appointmentData });
  }

  // Consultation Protocols operations
  async getConsultationProtocols(userId: string) {
    return this.makeRequest('GET', { table: 'consultation_protocols', user_id: userId });
  }

  async saveConsultationProtocol(protocolData: any) {
    return this.makeRequest('POST', { table: 'consultation_protocols', ...protocolData });
  }

  // Virtual Rooms operations
  async getVirtualRoom(userId: string, agentId: string) {
    return this.makeRequest('GET', { table: 'virtual_rooms', user_id: userId, agent_id: agentId });
  }

  async saveVirtualRoom(roomData: any) {
    return this.makeRequest('POST', { table: 'virtual_rooms', ...roomData });
  }

  // Daily Disclaimer operations
  async getDailyDisclaimer(userId: string) {
    return this.makeRequest('GET', { table: 'daily_disclaimer', user_id: userId });
  }

  async saveDailyDisclaimer(userId: string, date: string) {
    return this.makeRequest('POST', { table: 'daily_disclaimer', user_id: userId, date });
  }

  // User Sessions operations
  async saveUserSession(userId: string, sessionExpiry: number) {
    return this.makeRequest('POST', { table: 'user_sessions', user_id: userId, session_expiry: sessionExpiry });
  }

  async getUserSession(userId: string) {
    return this.makeRequest('GET', { table: 'user_sessions', user_id: userId });
  }

  // Generic storage operations for backward compatibility
  async getStoredData(userId: string, key: string) {
    // Map common localStorage keys to API calls
    switch (key) {
      case 'user-profile':
        return this.getUserProfile(userId);
      case 'agents':
        return this.getAgents(userId);
      case 'groups':
        return this.getGroups(userId);
      case 'guidelines':
        return this.getGuidelines(userId);
      case 'documents':
        return this.getDocuments(userId);
      case 'appointments':
        return this.getAppointments(userId);
      case 'consultation-protocols':
        return this.getConsultationProtocols(userId);
      case 'agent-interactions':
        return this.getAgentInteractions(userId);
      default:
        console.warn(`Unmapped storage key: ${key}`);
        return null;
    }
  }

  async setStoredData(userId: string, key: string, data: any) {
    // Map common localStorage keys to API calls
    switch (key) {
      case 'user-profile':
        return this.saveUserProfile({ ...data, user_id: userId });
      case 'agents':
        // For arrays, save each item individually
        if (Array.isArray(data)) {
          for (const agent of data) {
            await this.saveAgent({ ...agent, user_id: userId });
          }
          return { success: true };
        }
        return this.saveAgent({ ...data, user_id: userId });
      case 'groups':
        if (Array.isArray(data)) {
          for (const group of data) {
            await this.saveGroup({ ...group, user_id: userId });
          }
          return { success: true };
        }
        return this.saveGroup({ ...data, user_id: userId });
      case 'guidelines':
        if (Array.isArray(data)) {
          for (const guideline of data) {
            await this.saveGuideline({ ...guideline, user_id: userId });
          }
          return { success: true };
        }
        return this.saveGuideline({ ...data, user_id: userId });
      case 'documents':
        if (Array.isArray(data)) {
          for (const document of data) {
            await this.saveDocument({ ...document, user_id: userId });
          }
          return { success: true };
        }
        return this.saveDocument({ ...data, user_id: userId });
      case 'appointments':
        if (Array.isArray(data)) {
          for (const appointment of data) {
            await this.saveAppointment({ ...appointment, user_id: userId });
          }
          return { success: true };
        }
        return this.saveAppointment({ ...data, user_id: userId });
      case 'consultation-protocols':
        if (Array.isArray(data)) {
          for (const protocol of data) {
            await this.saveConsultationProtocol({ ...protocol, user_id: userId });
          }
          return { success: true };
        }
        return this.saveConsultationProtocol({ ...data, user_id: userId });
      case 'agent-interactions':
        if (Array.isArray(data)) {
          for (const interaction of data) {
            await this.saveAgentInteraction({ ...interaction, user_id: userId });
          }
          return { success: true };
        }
        return this.saveAgentInteraction({ ...data, user_id: userId });
      default:
        console.warn(`Unmapped storage key: ${key}`);
        return { success: false, error: 'Unmapped key' };
    }
  }
}

export const apiService = new ApiService();