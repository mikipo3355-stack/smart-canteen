import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Review {
  id: string;
  shopId: string;
  shopName: string;
  studentName: string;
  rating: number; // 1-5
  comment: string;
  menuItem?: string;
  createdAt: number;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviewsByShop: (shopId: string) => Review[];
  getAverageRating: (shopId: string) => number;
  getReviewCount: (shopId: string) => number;
}

const STORAGE_KEY = 'smart-canteen-reviews';

function loadReviews(): Review[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// Seed mock reviews if empty
const mockReviews: Review[] = [
  { id: 'r1', shopId: 'shop-1', shopName: 'ครัวป้าแดง', studentName: 'สมชาย', rating: 5, comment: 'กะเพราไก่เด็ดมากครับ เผ็ดจัดจ้าน อร่อยสุดๆ 🔥', menuItem: 'ข้าวผัดกะเพราไก่', createdAt: Date.now() - 3600000 },
  { id: 'r2', shopId: 'shop-2', shopName: 'Fresh Tea Bar', studentName: 'มานี', rating: 4, comment: 'ชาไทยเย็นสดชื่นดีค่ะ แต่หวานไปนิดนึง', menuItem: 'ชาไทยเย็น', createdAt: Date.now() - 7200000 },
  { id: 'r3', shopId: 'shop-3', shopName: 'Smile Noodles', studentName: 'ปิติ', rating: 5, comment: 'ก๋วยเตี๋ยวเรือน้ำซุปเข้มข้น เส้นเหนียวนุ่ม ชอบมากครับ', menuItem: 'ก๋วยเตี๋ยวเรือน้ำ', createdAt: Date.now() - 10800000 },
  { id: 'r4', shopId: 'shop-1', shopName: 'ครัวป้าแดง', studentName: 'วิภา', rating: 4, comment: 'ข้าวหมูกระเทียมอร่อย หมูนุ่มมาก แต่รอนานไปหน่อย', menuItem: 'ข้าวหมูกระเทียม', createdAt: Date.now() - 14400000 },
  { id: 'r5', shopId: 'shop-4', shopName: 'Green Bowl', studentName: 'ณัฐ', rating: 5, comment: 'ควินัวโบว์สดมาก! โปรตีนแน่น เหมาะกับคนเล่นกล้าม 🥗', menuItem: 'ควินัวเพาเวอร์โบว์', createdAt: Date.now() - 18000000 },
  { id: 'r6', shopId: 'shop-5', shopName: 'Halal Corner', studentName: 'อาหะหมัด', rating: 5, comment: 'ข้าวหมกไก่รสชาติดีมาก ข้าวหอม ไก่นุ่ม ฮาลาลแท้ๆ', menuItem: 'ข้าวหมกไก่', createdAt: Date.now() - 21600000 },
  { id: 'r7', shopId: 'shop-6', shopName: 'Sweet Treats', studentName: 'พิมพ์', rating: 4, comment: 'โรตีกล้วยอร่อย กรอบนอกนุ่มใน แต่ชิ้นเล็กไปนิด', menuItem: 'โรตีกล้วย', createdAt: Date.now() - 25200000 },
  { id: 'r8', shopId: 'shop-2', shopName: 'Fresh Tea Bar', studentName: 'ธนพล', rating: 5, comment: 'สมูทตี้มะม่วงสดชื่นมาก! เหมาะกับอากาศร้อนสุดๆ 🥭', menuItem: 'สมูทตี้อ้อยข้าวเหนียวมะม่วง', createdAt: Date.now() - 28800000 },
];

if (loadReviews().length === 0) {
  saveReviews(mockReviews);
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);

  const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: Date.now(),
    };
    setReviews(prev => {
      const next = [newReview, ...prev];
      saveReviews(next);
      return next;
    });
  }, []);

  const getReviewsByShop = useCallback((shopId: string) => {
    return reviews.filter(r => r.shopId === shopId).sort((a, b) => b.createdAt - a.createdAt);
  }, [reviews]);

  const getAverageRating = useCallback((shopId: string) => {
    const shopReviews = reviews.filter(r => r.shopId === shopId);
    if (shopReviews.length === 0) return 0;
    return shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length;
  }, [reviews]);

  const getReviewCount = useCallback((shopId: string) => {
    return reviews.filter(r => r.shopId === shopId).length;
  }, [reviews]);

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByShop, getAverageRating, getReviewCount }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
