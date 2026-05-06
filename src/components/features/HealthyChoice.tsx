import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { menuItems, shops as allShops } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export function HealthyChoice() {
  const navigate = useNavigate();
  const healthy = menuItems.filter((i: any) =>
    i.tags.includes('เพื่อสุขภาพ') ||
    i.tags.includes('คลีน') ||
    i.tags.includes('ซุปเปอร์ฟู้ด') ||
    i.tags.includes('โปรตีน')
  ).slice(0, 3);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-emerald-500" />
        <h2 className="font-bold text-ink text-lg">Healthy Choice</h2>
        <span className="text-xs text-muted ml-1">เมนูเพื่อสุขภาพ</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthy.map((item, i) => {
          const shop = allShops.find((s: any) => s.id === item.shopId)!;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="card p-4 text-left hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted">{shop.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {item.tags.filter((t: string) => ['เพื่อสุขภาพ', 'โปรตีน', 'ซุปเปอร์ฟู้ด'].includes(t)).map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-bold text-emerald-600 text-sm">{item.price}฿</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
