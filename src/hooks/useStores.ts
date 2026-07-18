import { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import type { Stores } from '../types';

export function useStores() {
  const [stores, setStores] = useState<Stores[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const allStores = await storeService.getStores();
        // Filtra apenas as lojas ativas
        const activeStores: Stores[] = allStores
          .filter(store => store.isActive)
          .map(store => ({
            id: store.id,
            name: store.name,
            city: store.city,
            created_at: store.created_at || new Date().toISOString()
          }));
        
        setStores(activeStores);
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