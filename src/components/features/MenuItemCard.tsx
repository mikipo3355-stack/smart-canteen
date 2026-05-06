import { Plus } from 'lucide-react';
import type { MenuItem } from '../../data/mockData';
import { useCart } from '../../store/cartStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const tagStyle: Record<string, string> = {
  'ยอดนิยม': 'badge-warning',
  'เผ็ด': 'badge-danger',
  'เพื่อสุขภาพ': 'badge-success',
  'ซุปเปอร์ฟู้ด': 'badge-success',
  'ฮาลาล': 'badge-info',
  'คลาสสิก': 'badge-info',
  'ประหยัด': 'badge-info',
  'ใหม่': 'badge-success',
  'โปรตีน': 'badge-success',
  'สดชื่น': 'badge-info',
  'ธรรมชาติ': 'badge-info',
  'ตามฤดูกาล': 'badge-info',
  'โฮมมี่': 'badge-info',
};

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const isSoldOut = item.isAvailable === false;

  return (
    <div className={cn('card flex gap-4 p-4 group relative', isSoldOut && 'opacity-60')}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:from-brand-50 group-hover:to-brand-100 transition-colors">
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-ink truncate">{item.name}</h3>
          {isSoldOut && <Badge variant="danger">หมดแล้ว</Badge>}
        </div>
        <p className="text-sm text-muted mt-0.5 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-600 text-lg">{item.price} บาท</span>
            <span className="text-xs text-muted">{item.prepTime} นาที</span>
          </div>
          <Button size="sm" disabled={isSoldOut} onClick={() => !isSoldOut && addItem(item)} className="!px-3 !py-1.5">
            <Plus className="w-4 h-4" />
            {isSoldOut ? 'หมดแล้ว' : 'เพิ่ม'}
          </Button>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className={cn('badge', tagStyle[tag] ?? 'badge-info')}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
