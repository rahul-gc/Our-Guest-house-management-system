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

  // ✅ Load from localStorage (persist after refresh)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [role, setRole] = useState<'staff' | 'admin'>(() => {
    return (localStorage.getItem('role') as 'staff' | 'admin') || 'staff';
  });

  // 🔐 Login function
  const login = (username: string, password: string) => {
    if (username === 'Admin' && password === 'IamADmiN123@') {
      setIsLoggedIn(true);
      setRole('admin');

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');

      return true;
    }

    if (username === 'staff' && password === 'staff123') {
      setIsLoggedIn(true);
      setRole('staff');

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'staff');

      return true;
    }

    return false;
  };

  // 🚪 Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setRole('staff');

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
