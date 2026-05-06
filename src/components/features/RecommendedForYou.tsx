import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuItems, shops as allShops } from '../../data/mockData';
import { useSmartRecommendations } from '../../hooks/useSmartRecommendations';
import { useOrders } from '../../store/orderStore';
import { useAuth } from '../../store/authStore';

export function RecommendedForYou() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { user } = useAuth();

  const userShopHistory = orders
    .filter((o: any) => o.studentId === user?.id || o.studentId === 'unknown')
    .flatMap((o: any) => o.items)
    .map((item: any) => {
      const mi = menuItems.find((m: any) => m.name === item.name);
      return mi?.shopId;
    })
    .filter(Boolean) as string[];

  const { forYou } = useSmartRecommendations(menuItems, allShops, [...new Set(userShopHistory)]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <h2 className="font-bold text-ink text-lg">Recommended For You</h2>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 text-center border border-violet-100"
          >
            <div className="inline-flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-violet-600 font-medium">AI is preparing your lunch recommendations...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {forYou.map((rec, i) => (
              <motion.div
                key={rec.item.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.12 }}
                className="card overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/shop/${rec.shop.id}`)}
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${rec.shop.gradient} px-5 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rec.item.emoji}</span>
                    <div>
                      <p className="font-bold text-white">{rec.item.name}</p>
                      <p className="text-white/80 text-xs">{rec.shop.name}</p>
                    </div>
                  </div>
                  <span className="text-white font-bold text-lg">{rec.item.price}฿</span>
                </div>

                {/* Body */}
                <div className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {rec.reason}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {rec.item.prepTime} นาที
                    </span>
                    <span className="text-violet-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      ดูเมนู <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
