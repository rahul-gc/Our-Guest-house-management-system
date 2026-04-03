import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  role: 'staff' | 'admin';
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'staff' | 'admin'>('staff');

  const login = (username: string, password: string) => {
    if (username === 'Admin' && password === 'IamADmiN123@') {
      setIsLoggedIn(true);
      setRole('admin');
      return true;
    }
    if (username === 'staff' && password === 'staff123') {
      setIsLoggedIn(true);
      setRole('staff');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole('staff');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
