import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_TOKEN_KEY = 'authToken';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp <= currentTime) {
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
          setToken(null);
          setUser(null);
        } else {
          setUser({
            username: decodedToken.sub,
            role: decodedToken.role || ''
          });
        }
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setToken(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 