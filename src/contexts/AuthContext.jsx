import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demonstration (in production, this would be in Supabase)
  const mockUsers = [
    {
      id: '1',
      email: 'admin@company.com',
      password_hash: bcrypt.hashSync('admin123', 10),
      full_name: 'Admin User',
      role: 'Admin',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      email: 'manager@company.com',
      password_hash: bcrypt.hashSync('manager123', 10),
      full_name: 'Manager User',
      role: 'Manager',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      email: 'user@company.com',
      password_hash: bcrypt.hashSync('user123', 10),
      full_name: 'Regular User',
      role: 'User',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In production, this would query Supabase
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = bcrypt.compareSync(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      };

      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};