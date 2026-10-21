import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../shared/types.js';
import { api } from './api.js';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  resetDemoWorkspace: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedRole = (localStorage.getItem('flowtwin_role') as UserRole) || 'Logistics Manager';
    return {
      id: 'demo-user-1',
      name: savedRole === 'Administrator' ? 'Elena Rostova' : savedRole === 'Logistics Manager' ? 'Marcus Vance' : savedRole === 'Operations Analyst' ? 'Sarah Chen' : 'David Kalu',
      email: `${savedRole.toLowerCase().replace(/\s+/g, '')}@flowtwin.ai`,
      role: savedRole,
      accountStatus: 'active',
      department: 'Logistics Operations Command',
      createdAt: new Date().toISOString(),
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('flowtwin_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If token exists, verify with server
    if (token) {
      api.get<{ user: UserProfile }>('/auth/me')
        .then(res => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('flowtwin_role', res.user.role);
          }
        })
        .catch(() => {
          // Keep demo fallback active
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ token: string; user: UserProfile }>('/auth/login', { email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('flowtwin_token', res.token);
      localStorage.setItem('flowtwin_role', res.user.role);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('flowtwin_token');
    // Revert to demo viewer
    switchRole('Viewer');
  };

  const switchRole = (role: UserRole) => {
    localStorage.setItem('flowtwin_role', role);
    setUser(prev => ({
      id: prev?.id || 'demo-user',
      name: role === 'Administrator' ? 'Elena Rostova' : role === 'Logistics Manager' ? 'Marcus Vance' : role === 'Operations Analyst' ? 'Sarah Chen' : 'David Kalu',
      email: `${role.toLowerCase().replace(/\s+/g, '')}@flowtwin.ai`,
      role,
      accountStatus: 'active',
      department: role === 'Administrator' ? 'Global Admin Office' : 'Operations Command',
      createdAt: new Date().toISOString(),
    }));
  };

  const resetDemoWorkspace = async () => {
    setIsLoading(true);
    try {
      await api.post('/demo/reset');
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset demo workspace:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        resetDemoWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
