import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import type { Stores } from '../types';

export function useStores() {
  const [stores, setStores] = useState<Stores[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'stores'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const fetchedStores: Stores[] = [];
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.deleted_at === null || data.deleted_at === undefined) {
            fetchedStores.push({
              id: docSnap.id,
              name: data.name,
              city: data.city,
              created_at: data.created_at
            });
          }
        });
        
        setStores(fetchedStores);
      } catch (error) {
        console.error("Erro ao buscar lojas no hook useStores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading };
}