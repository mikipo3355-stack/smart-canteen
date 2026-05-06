import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { menuItems, shops as allShops } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export function QuickPickup() {
  const navigate = useNavigate();
  const quick = menuItems
    .filter((i: any) => i.prepTime <= 5)
    .sort((a: any, b: any) => a.prepTime - b.prepTime)
    .slice(0, 4);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-500" />
        <h2 className="font-bold text-ink text-lg">Quick Pickup</h2>
        <span className="text-xs text-muted ml-1">พร้อมเสิร์ฟใน 5 นาที</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quick.map((item, i) => {
          const shop = allShops.find((s: any) => s.id === item.shopId)!;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="card p-3.5 text-left hover:shadow-lg hover:shadow-amber-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{item.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink text-sm truncate">{item.name}</p>
                  <p className="text-[11px] text-muted">{shop.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {item.prepTime} นาที
                </span>
                <span className="font-bold text-ink text-sm">{item.price}฿</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
