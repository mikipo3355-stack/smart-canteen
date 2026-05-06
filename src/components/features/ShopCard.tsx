import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import type { Shop } from '../../data/mockData';

export function ShopCard({ shop, onClick }: { shop: Shop; onClick: () => void }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card overflow-hidden cursor-pointer group"
    >
      <div className={`h-32 bg-gradient-to-br ${shop.gradient} flex items-center justify-center`}>
        <motion.span
          className="text-5xl"
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {shop.emoji}
        </motion.span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-ink group-hover:text-brand-600 transition-colors">{shop.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {shop.rating} ({shop.reviews})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {shop.prepTime}
          </span>
        </div>
        <div className="flex gap-1.5 mt-3">
          {shop.categories.slice(0, 2).map(cat => (
            <span key={cat} className="badge badge-info">{cat}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
