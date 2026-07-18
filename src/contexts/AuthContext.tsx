import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthSessionUser } from '../services/authService';
import { userService } from '../services/userService';
import type { Users } from '../types';

interface AuthContextType {
  profile: Users | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [profile, setProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (currentUser: AuthSessionUser | null) => {
      if (currentUser) {
        try {
          const fetchedProfile = await userService.getUserProfile(currentUser.uid);

          if (fetchedProfile) {
            setProfile(fetchedProfile);
          } else {
            // Se o perfil não existir no Firestore por algum motivo, cria um perfil básico/fallback
            setProfile({
              id: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              role: 'MANAGER',
              store_id: null,
              created_at: currentUser.creationTime || new Date().toISOString()
            });
          }
        } catch (err) {
          console.error("Erro ao buscar perfil do usuário:", err);
          setProfile({
            id: currentUser.uid,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            role: 'MANAGER',
            store_id: null,
            created_at: currentUser.creationTime || new Date().toISOString()
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Erro ao realizar logout:", err);
    }
  };

  const isAuthenticated = !!profile;

  return (
    <AuthContext.Provider value={{ profile, loading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};