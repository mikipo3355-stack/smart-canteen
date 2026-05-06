import { useState, useCallback, useEffect } from 'react';
import { menuApi } from '../lib/api';
import type { MenuItem } from '../data/mockData';

export function useMenuItems(shopId: string, includeUnavailable = false) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const data = await menuApi.getByShop(shopId, includeUnavailable);
      const mapped = data.map((item: any) => ({
        id: item.id,
        shopId: item.shopId,
        name: item.name,
        emoji: item.emoji,
        price: item.price,
        prepTime: item.prepTime,
        description: item.description || '',
        tags: item.tags || [],
        isAvailable: item.isAvailable !== false,
        timeSlots: item.timeSlots || [],
        imageUrl: item.imageUrl || '',
      }));
      setItems(mapped);
    } catch {
      // Keep existing items or empty on error
    } finally {
      setIsLoading(false);
    }
  }, [shopId, includeUnavailable]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { items, isLoading, refetch: fetch };
}
