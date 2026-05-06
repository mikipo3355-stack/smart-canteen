import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { shops as mockShops } from '../data/mockData';
import { ShopCard } from '../components/features/ShopCard';
import { AIRecommendation } from '../components/features/AIRecommendation';
import { QueuePrediction } from '../components/features/QueuePrediction';
import { RecommendedForYou } from '../components/features/RecommendedForYou';
import { TrendingNow } from '../components/features/TrendingNow';
import { QuickPickup } from '../components/features/QuickPickup';
import { HealthyChoice } from '../components/features/HealthyChoice';
import { PlateReturnAndReview } from '../components/features/PlateReturnAndReview';
import { ChatWidget } from '../components/features/ChatWidget';
import { Input } from '../components/ui/Input';
import { useAuth } from '../store/authStore';

const categories = ['ทั้งหมด', 'ข้าว', 'เครื่องดื่ม', 'ของทานเล่น', 'ฮาลาล', 'คลีน'];

export function StudentDashboard() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState(mockShops);
  const navigate = useNavigate();

  // Fetch shops from API
  useEffect(() => {
    import('../lib/api').then(({ shopsApi }) => {
      shopsApi.getAll().then(data => {
        const mapped = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          emoji: s.emoji,
          gradient: s.gradient,
          rating: s.rating,
          reviews: s.reviews,
          prepTime: s.prep_time || s.prepTime,
          categories: s.categories || [],
          description: s.description || '',
        }));
        if (mapped.length > 0) setShops(mapped);
      }).catch(() => {
        // Fallback to mock data if API fails
      });
    });
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesCategory = activeCategory === 'ทั้งหมด' || shop.categories.includes(activeCategory);
    const matchesSearch = searchQuery === '' ||
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.categories.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const minutesToLunch = 45;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-ink">สวัสดีค่ะ {user?.name} 👋</h1>
        <div className="flex items-center gap-2 mt-2 text-muted">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            อาหารเริ่ม 12:00 น. — <span className="font-semibold text-brand-600">เหลืออีก {minutesToLunch} นาที</span>
          </span>
        </div>
      </motion.div>

      <PlateReturnAndReview />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <AIRecommendation />
        <QueuePrediction />
      </div>

      <RecommendedForYou />

      <TrendingNow />

      <QuickPickup />

      <HealthyChoice />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/50" />
        <Input placeholder="ค้นหาเมนูหรือร้าน..." className="pl-12" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`chip whitespace-nowrap ${activeCategory === cat ? 'chip-active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map(shop => (
          <ShopCard key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
        ))}
      </motion.div>

      {filteredShops.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-ink text-lg mb-2">ไม่พบร้าน</h3>
          <p className="text-muted">ลองเปลี่ยนหมวดหมู่หรือคำค้นหา</p>
        </div>
      )}

      <ChatWidget />
    </div>
  );
}
