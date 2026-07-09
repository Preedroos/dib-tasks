import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Mudado para buscar por documento direto
import { auth, db } from '../lib/firebase';
import type { Users, RoleType } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Users | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // CORREÇÃO: Busca direta pelo ID do documento (que deve ser igual ao uid do Auth)
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let role: RoleType = 'MANAGER';
          let storeId: string | null = null;
          let name = currentUser.displayName || '';

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            role = (userData.role || 'MANAGER') as RoleType;
            storeId = userData.store_id || null;
            name = userData.name || name;
          }

          setProfile({
            id: currentUser.uid, // O ID é estritamente o uid do Firebase Auth
            name: name,
            email: currentUser.email || '',
            role: role,
            store_id: storeId,
            created_at: currentUser.metadata.creationTime || new Date().toISOString()
          });
        } catch (err) {
          console.error("Erro ao buscar perfil do usuário no Firestore:", err);
          setProfile({
            id: currentUser.uid,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            role: 'MANAGER',
            store_id: null,
            created_at: currentUser.metadata.creationTime || new Date().toISOString()
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
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