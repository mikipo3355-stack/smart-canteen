import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { shops } from '../data/mockData';
import { MenuItemCard } from '../components/features/MenuItemCard';
import { ChatWidget } from '../components/features/ChatWidget';
import { useCart } from '../store/cartStore';
import type { MenuItem } from '../data/mockData';

export function ShopMenuPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const shop = shops.find(s => s.id === id);

  useEffect(() => {
    if (!id) return;
    const fetchMenu = () => {
      import('../lib/api').then(({ menuApi }) => {
        menuApi.getByShop(id).then(data => {
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
          }));
          if (mapped.length > 0) setMenuItems(mapped);
        }).catch(() => {});
      });
    };
    fetchMenu();
    const interval = setInterval(fetchMenu, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🏪</p>
        <h2 className="font-bold text-ink text-xl mb-2">ไม่พบร้าน</h2>
        <button onClick={() => navigate('/student')} className="btn-primary mt-4">กลับหน้าหลัก</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-6">
      <div className={`relative h-48 md:h-56 bg-gradient-to-br ${shop.gradient} flex items-end`}>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-24" />
        <div className="relative px-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{shop.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
              <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {shop.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {shop.prepTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <h2 className="font-bold text-ink text-lg mb-4">เมนูอาหาร</h2>
        <motion.div layout className="space-y-4">
          {menuItems.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MenuItemCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {totalItems > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40">
          <button onClick={() => navigate('/cart')} className="w-full bg-brand-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{totalItems}</span>
              <span className="font-semibold">ดูตะกร้า</span>
            </div>
            <span className="font-bold text-lg">{totalPrice} บาท</span>
          </button>
        </motion.div>
      )}
      <ChatWidget />
    </div>
  );
}
