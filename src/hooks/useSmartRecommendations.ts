import { useMemo } from 'react';
import { analyticsData, type MenuItem } from '../data/mockData';

interface Shop {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  rating: number;
  reviews: number;
  prepTime: string;
  categories: string[];
  description: string;
}

interface ScoredItem {
  item: MenuItem;
  shop: Shop;
  reason: string;
  score: number;
}

interface TrendingItem {
  item: MenuItem;
  shop: Shop;
  ordersCount: number;
}

export function useSmartRecommendations(
  menuItems: MenuItem[],
  shops: Shop[],
  userOrderHistory: string[] = [] // shop IDs user has ordered from
) {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  // Weather mock (stable per day)
  const daySeed = now.getDate() + now.getMonth() * 31;
  const weather = daySeed % 3 === 0 ? 'rainy' : 'hot';

  const popularNames = new Set(analyticsData.topMenus.map((m: { name: string; orders: number }) => m.name));
  const popularOrders: Record<string, number> = Object.fromEntries(
    analyticsData.topMenus.map((m: { name: string; orders: number }) => [m.name, m.orders])
  ) as Record<string, number>;

  const getShop = (shopId: string) => shops.find(s => s.id === shopId)!;

  const scoreItems = (items: MenuItem[]): ScoredItem[] => {
    return items.map(item => {
      let score = 0;
      let reasons: string[] = [];
      const shop = getShop(item.shopId);

      // 1. Time of day
      if (hour < 10.5) {
        // Morning: drinks & snacks preferred
        if (shop.categories.includes('เครื่องดื่ม') || shop.categories.includes('ของทานเล่น')) {
          score += 8;
          reasons.push('เหมาะสำหรับช่วงเช้า');
        }
      } else if (hour >= 11 && hour <= 13) {
        // Lunch: main meals
        if (shop.categories.includes('ข้าว')) {
          score += 8;
          reasons.push('มื้อเที่ยงยอดนิยม');
        }
      } else if (hour > 13) {
        // Late: fast prep
        if (item.prepTime <= 5) {
          score += 8;
          reasons.push('ทำเร็ว รับทันเวลา');
        }
      }

      // 2. Popularity
      if (popularNames.has(item.name)) {
        score += 12;
        reasons.push(`ขายดีวันนี้ (${popularOrders[item.name]} ออเดอร์)`);
      }

      // 3. User history
      if (userOrderHistory.includes(item.shopId)) {
        score += 5;
        reasons.push('คุณเคยสั่งร้านนี้');
      }

      // 4. Queue time
      if (item.prepTime <= 5) {
        score += 6;
        reasons.push(`พร้อมใน ${item.prepTime} นาที`);
      }

      // 5. Weather
      if (weather === 'hot') {
        if (shop.name === 'Fresh Tea Bar' || shop.name === 'Green Bowl') {
          score += 5;
          reasons.push('เหมาะกับอากาศร้อน');
        }
      } else {
        if (item.name.includes('ก๋วยเตี๋ยว') || item.name.includes('ต้ม') || item.name.includes('น้ำ')) {
          score += 5;
          reasons.push('เหมาะสำหรับวันฝนตก');
        }
      }

      // Tags bonus
      if (item.tags.includes('ยอดนิยม')) {
        score += 3;
      }

      if (reasons.length === 0) {
        reasons.push('เมนูน่าสนใจวันนี้');
      }

      return { item, shop, reason: reasons.slice(0, 2).join(' + '), score };
    });
  };

  // For You: personalized top 3
  const forYou = useMemo(() => {
    const scored = scoreItems(menuItems);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [menuItems, shops.length, weather, userOrderHistory.length]);

  // Trending: top 3 by order count
  const trending = useMemo((): TrendingItem[] => {
    return analyticsData.topMenus
      .slice(0, 3)
      .map(m => {
        const item = menuItems.find(mi => mi.name === m.name)!;
        return { item, shop: getShop(item?.shopId), ordersCount: m.orders };
      })
      .filter(t => t.item && t.shop);
  }, [menuItems]);

  // Quick Pickup: prepTime <= 5
  const quickPickup = useMemo(() => {
    const items = menuItems.filter(i => i.prepTime <= 5);
    items.sort((a, b) => a.prepTime - b.prepTime);
    return items.slice(0, 4).map(item => ({ item, shop: getShop(item.shopId) }));
  }, [menuItems]);

  // Healthy Choice
  const healthyChoice = useMemo(() => {
    const items = menuItems.filter(i =>
      i.tags.includes('เพื่อสุขภาพ') ||
      i.tags.includes('คลีน') ||
      i.tags.includes('ซุปเปอร์ฟู้ด') ||
      i.tags.includes('โปรตีน')
    );
    return items.slice(0, 3).map(item => ({ item, shop: getShop(item.shopId) }));
  }, [menuItems]);

  return { forYou, trending, quickPickup, healthyChoice, weather };
}
