import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface StoreModel {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
  created_at?: string;
}

export const storeService = {
  async getStores(): Promise<StoreModel[]> {
    const q = query(collection(db, 'stores'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        city: data.city || '',
        isActive: data.deleted_at === null || data.deleted_at === undefined,
        created_at: data.created_at
      };
    });
  },

  async createStore(name: string, city: string): Promise<void> {
    const newId = `loja-${crypto.randomUUID().slice(0, 8)}`;
    const storeRef = doc(db, 'stores', newId);
    await setDoc(storeRef, {
      name,
      city,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    });
  },

  async updateStore(id: string, name: string, city: string): Promise<void> {
    const storeRef = doc(db, 'stores', id);
    await updateDoc(storeRef, {
      name,
      city,
      updated_at: new Date().toISOString()
    });
  },

  async toggleStoreStatus(id: string, currentIsActive: boolean): Promise<void> {
    const storeRef = doc(db, 'stores', id);
    await updateDoc(storeRef, {
      deleted_at: currentIsActive ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    });
  }
};
