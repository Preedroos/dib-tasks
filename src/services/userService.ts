import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Users, RoleType } from '../types';

export interface UserManagementModel {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  store_id: string | null;
  isActive: boolean;
}

export const userService = {
  async getUserProfile(uid: string): Promise<Users | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: uid,
        name: data.name || '',
        email: data.email || '',
        role: (data.role || 'MANAGER') as RoleType,
        store_id: data.store_id || null,
        created_at: data.created_at || new Date().toISOString()
      };
    }
    return null;
  },

  async getUsers(): Promise<UserManagementModel[]> {
    const q = query(collection(db, 'users'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        email: data.email || '',
        role: (data.role || 'MANAGER') as RoleType,
        store_id: data.store_id || null,
        isActive: data.deleted_at === null || data.deleted_at === undefined
      };
    });
  },

  async createUserProfile(uid: string, profileData: {
    name: string;
    email: string;
    role: RoleType;
    store_id: string | null;
  }): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      ...profileData,
      created_at: new Date().toISOString()
    });
  },

  async updateUserProfile(uid: string, profileData: {
    name: string;
    email: string;
    role: RoleType;
    store_id: string | null;
  }): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      name: profileData.name,
      email: profileData.email,
      role: profileData.role,
      store_id: profileData.store_id
    });
  },

  async toggleUserStatus(uid: string, currentIsActive: boolean): Promise<void> {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      deleted_at: currentIsActive ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    });
  }
};
