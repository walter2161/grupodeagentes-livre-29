
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, defaultUser } from '@/types/auth';
import { UserProfile, defaultUserProfile } from '@/types/user';
import { apiService } from '@/services/apiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Inicializar usuário padrão se não existir
        const existingDefaultUser = await apiService.getUser(defaultUser.id);
        if (!existingDefaultUser) {
          await apiService.createUser(defaultUser);
        }

        // Verificar se há uma sessão ativa e se ainda é válida (24h)
        const currentUser = localStorage.getItem('chathy-current-user');
        const sessionExpiry = localStorage.getItem('chathy-session-expiry');
        
        if (currentUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiryTime = parseInt(sessionExpiry);
          
          if (now < expiryTime) {
            // Sessão ainda válida
            const userData = JSON.parse(currentUser);
            setUser(userData);
            await syncUserProfile(userData);
          } else {
            // Sessão expirada, limpar
            localStorage.removeItem('chathy-current-user');
            localStorage.removeItem('chathy-session-expiry');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Fallback para localStorage se a API falhar
        const users = JSON.parse(localStorage.getItem('chathy-users') || '[]');
        if (users.length === 0) {
          localStorage.setItem('chathy-users', JSON.stringify([defaultUser]));
        }
      }
    };

    initializeAuth();
  }, []);

  const syncUserProfile = async (userData: User) => {
    try {
      const existingProfile = await apiService.getUserProfile(userData.id);
      
      // Se não há perfil ou o perfil não corresponde ao usuário logado, criar/atualizar
      if (!existingProfile || (existingProfile as any)?.email !== userData.email) {
        const userProfile: UserProfile = {
          ...defaultUserProfile,
          id: userData.id,
          name: userData.name,
          email: userData.email,
          updatedAt: new Date()
        };
        await apiService.saveUserProfile({ ...userProfile, user_id: userData.id });
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
      // Fallback para localStorage
      const userProfileKey = `${userData.id}-user-profile`;
      const userProfile: UserProfile = {
        ...defaultUserProfile,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        updatedAt: new Date()
      };
      localStorage.setItem(userProfileKey, JSON.stringify(userProfile));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Buscar todos os usuários para verificar login
      const allUsers = await apiService.getAllUsers();
      const foundUser = Array.isArray(allUsers) ? allUsers.find((u: any) => u.email === email && u.password === password && u.is_active) : null;
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          password: foundUser.password,
          createdAt: new Date(foundUser.created_at),
          isActive: foundUser.is_active
        };
        
        setUser(userData);
        localStorage.setItem('chathy-current-user', JSON.stringify(userData));
        
        // Definir expiração da sessão para 24 horas
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('chathy-session-expiry', expiryTime.toString());
        
        // Salvar sessão na API
        await apiService.saveUserSession(userData.id, expiryTime);
        
        await syncUserProfile(userData);
        return true;
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Fallback para localStorage
      const users: User[] = JSON.parse(localStorage.getItem('chathy-users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password && u.isActive);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('chathy-current-user', JSON.stringify(foundUser));
        
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('chathy-session-expiry', expiryTime.toString());
        
        await syncUserProfile(foundUser);
        return true;
      }
    }
    return false;
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // Verificar se o email já existe na API
      const allUsers = await apiService.getAllUsers();
      if (Array.isArray(allUsers) && allUsers.some((u: any) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        password,
        createdAt: new Date(),
        isActive: true
      };

      // Salvar usuário na API
      await apiService.createUser(newUser);
      
      setUser(newUser);
      localStorage.setItem('chathy-current-user', JSON.stringify(newUser));
      
      // Definir expiração da sessão para 24 horas
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('chathy-session-expiry', expiryTime.toString());
      
      // Salvar sessão na API
      await apiService.saveUserSession(newUser.id, expiryTime);
      
      await syncUserProfile(newUser);
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      // Fallback para localStorage
      const users: User[] = JSON.parse(localStorage.getItem('chathy-users') || '[]');
      
      // Verificar se o email já existe
      if (users.some(u => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        password,
        createdAt: new Date(),
        isActive: true
      };

      users.push(newUser);
      localStorage.setItem('chathy-users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('chathy-current-user', JSON.stringify(newUser));
      
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('chathy-session-expiry', expiryTime.toString());
      
      await syncUserProfile(newUser);
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chathy-current-user');
    localStorage.removeItem('chathy-session-expiry');
    // Os dados específicos do usuário permanecem no localStorage para quando ele logar novamente
    // O novo hook useUserStorage irá carregar os dados corretos automaticamente
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
