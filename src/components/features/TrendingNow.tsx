import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { menuItems, shops as allShops, analyticsData } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export function TrendingNow() {
  const navigate = useNavigate();
  const trending = analyticsData.topMenus.slice(0, 3).map((m: any) => {
    const item = menuItems.find((mi: any) => mi.name === m.name)!;
    const shop = allShops.find((s: any) => s.id === item.shopId)!;
    return { item, shop, orders: m.orders };
  }).filter((t: any) => t.item && t.shop);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="font-bold text-ink text-lg">Trending Now</h2>
        <span className="text-xs text-muted ml-1">ยอดนิยมวันนี้</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trending.map((t, i) => (
          <motion.button
            key={t.item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/shop/${t.shop.id}`)}
            className="card p-4 flex items-center gap-4 text-left hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{t.item.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{t.item.name}</p>
              <p className="text-xs text-muted">{t.shop.name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-orange-500 text-sm">{t.orders}</p>
              <p className="text-[10px] text-muted">ออเดอร์</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
