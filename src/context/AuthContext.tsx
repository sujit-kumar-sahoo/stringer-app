"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

type UserType = {
  name: string;
  role: string;
  role_data: Record<string, any>; 
} | null;

interface AuthContextProps {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only access localStorage inside useEffect to avoid SSR issues
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpiration');
    
    if (token && expirationTime) {
      const currentTime = new Date().getTime();
      
      if (currentTime < parseInt(expirationTime)) {
        try {
          const decodedToken = jwtDecode(token);
          setUser({ 
            name: (decodedToken as any)?.profile_name || "Guest",
            role: (decodedToken as any)?.role || "Administrator",
            role_data: (decodedToken as any)?.role_data || {},
          });
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const expirationTime = new Date().getTime() + 8 * 60 * 60 * 1000;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      
      const decodedToken = jwtDecode(token);
      setUser({ 
        name: (decodedToken as any)?.profile_name || "Guest",
        role: (decodedToken as any)?.role || "Administrator",
        role_data: (decodedToken as any)?.role_data || {},
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    setUser(null);
    // Immediate redirect without showing any intermediate state
    router.replace('/login');
  };

  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
