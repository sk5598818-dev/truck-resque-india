'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export interface AppUser {
  uid: string;
  phone: string;
  isGarageOwner?: boolean;
  garageId?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginUser: (user: AppUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load from local storage
    try {
      const saved = localStorage.getItem('truck_rescue_current_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse saved user', e);
    }

    // Subscribe to Firebase Auth if configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const appUser: AppUser = {
            uid: fbUser.uid,
            phone: fbUser.phoneNumber || '',
          };
          setUser(appUser);
          localStorage.setItem('truck_rescue_current_user', JSON.stringify(appUser));
        } else {
          // If explicitly signed out in Firebase
          const saved = localStorage.getItem('truck_rescue_current_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            // If it was a mock driver/garage user in dev mode, keep it; otherwise clear
            if (!parsed.uid.startsWith('driver_') && !parsed.uid.startsWith('owner_')) {
              setUser(null);
              localStorage.removeItem('truck_rescue_current_user');
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (newUser: AppUser) => {
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('truck_rescue_current_user', JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('truck_rescue_current_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
