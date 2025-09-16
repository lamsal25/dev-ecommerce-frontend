// contexts/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  role: 'user' | 'vendor' | 'admin';
  email: string;
  name?: string;
  vendor?: {
    id: number;
    name: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  isVendor: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      // Updated endpoint to match your Django view
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getuser/`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      
      // Check if it's an authentication error
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Try to refresh the token
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token/refresh/`, {}, {
              withCredentials: true,
            });
            // Retry fetching user data after token refresh
            const retryResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getuser/`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            });
            setUser(retryResponse.data);
            return;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const contextValue: UserContextType = {
    user,
    loading,
    refreshUser,
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Custom hook for vendor-specific logic
export function useVendorPermissions(productVendorId?: number) {
  const { user, isVendor } = useUser();
  
  const isProductOwner = isVendor && user?.vendor?.id === productVendorId;
  
  return {
    isProductOwner,
    canManageProduct: isProductOwner,
    canReplyToReviews: isProductOwner,
  };
}