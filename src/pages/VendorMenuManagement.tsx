import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Clock } from 'lucide-react';
import { useOrders } from '../store/orderStore';
import { useToast } from '../store/toastStore';
import { useAuth } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { menuApi, type TimeSlot, type MenuItemFormData } from '../lib/api';
import { getVendorShopId } from '../lib/vendorShopMap';
import type { MenuItem } from '../data/mockData';

const FOOD_EMOJIS = ['🍛', '🍗', '🍚', '🍳', '🥩', '🍲', '🧋', '🥤', '🥭', '🍋', '🥥', '🍜', '🍝', '🌶️', '🥟', '🥙', '🥗', '🫐', '🍢', '🥘', '🥐', '🥞', '🍮', '🍰', '🧁', '🍩'];

const ALL_TAGS = ['ยอดนิยม', 'เผ็ด', 'เพื่อสุขภาพ', 'คลาสสิก', 'ประหยัด', 'สดชื่น', 'ธรรมชาติ', 'ตามฤดูกาล', 'โปรตีน', 'ซุปเปอร์ฟู้ด', 'ฮาลาล', 'ใหม่', 'โฮมมี่'];

const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: 'เช้า',
  lunch: 'เที่ยง',
  afternoon: 'บ่าย',
};

const EMPTY_FORM: Omit<MenuItemFormData, 'shopId'> & { shopId?: string } = {
  shopId: '',
  name: '',
  emoji: '🍛',
  price: 0,
  prepTime: 5,
  description: '',
  tags: [],
  timeSlots: ['morning', 'lunch', 'afternoon'],
};

function computeAIScore(item: MenuItem, orderCount: number): number {
  let score = 0;
  if (orderCount > 5) score += 20;
  else if (orderCount > 2) score += 10;
  if (item.prepTime <= 3) score += 8;
  else if (item.prepTime <= 5) score += 5;
  if (item.tags.includes('ยอดนิยม')) score += 10;
  if (item.price <= 40) score += 5;
  const hour = new Date().getHours();
  if (hour >= 11 && hour <= 13 && !item.tags.includes('เครื่องดื่ม')) score += 5;
  if (hour < 10 && item.tags.includes('สดชื่น')) score += 5;
  return Math.min(score, 50);
}

function getAITip(score: number, orderCount: number): string | null {
  if (score >= 35 && orderCount >= 3) return 'เพิ่ม 5 บาทได้ — ความต้องการสูง';
  if (score >= 30) return 'เตรียมเพิ่ม 10 จาน — คาดว่าจะขายดี';
  if (orderCount <= 1) return 'ควรโปรโมท — ยอดขายต่ำ';
  return null;
}

function getScoreBadge(score: number): { text: string; variant: 'success' | 'warning' | 'info' } {
  if (score >= 30) return { text: `${score} สูง`, variant: 'success' };
  if (score >= 15) return { text: `${score} ปานกลาง`, variant: 'warning' };
  return { text: `${score} ต่ำ`, variant: 'info' };
}

export function VendorMenuManagement() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { addToast } = useToast();
  const shopId = getVendorShopId(user?.id || '');

  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchItems = useCallback(async () => {
    try {
      const data = await menuApi.getByShop(shopId, true);
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
        timeSlots: item.timeSlots || [],
        imageUrl: item.imageUrl || '',
      }));
      setItems(mapped);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Compute per-item performance from orders
  const itemPerformance = useCallback((itemId: string) => {
    let count = 0;
    let revenue = 0;
    for (const order of orders) {
      for (const oi of (order as any).items || []) {
        if (oi.menuItemId === itemId || oi.name === items.find(i => i.id === itemId)?.name) {
          count += oi.quantity || 1;
          revenue += oi.price || 0;
        }
      }
    }
    return { count, revenue };
  }, [orders, items]);

  const handleToggleAvailability = async (item: MenuItem) => {
    const newVal = !item.isAvailable;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: newVal } : i));
    try {
      await menuApi.toggleAvailability(item.id, newVal);
      addToast(newVal ? '✅ เปิดขายแล้ว' : '🚫 หมดแล้ว', newVal ? 'success' : 'info');
    } catch {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: !newVal } : i));
      addToast('อัปเดตไม่สำเร็จ', 'error');
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`ลบ "${item.name}"?`)) return;
    try {
      await menuApi.delete(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      addToast('🗑️ ลบเมนูแล้ว', 'info');
    } catch {
      addToast('ลบไม่สำเร็จ', 'error');
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, shopId });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      shopId: item.shopId,
      name: item.name,
      emoji: item.emoji,
      price: item.price,
      prepTime: item.prepTime,
      description: item.description,
      tags: [...item.tags],
      timeSlots: (item.timeSlots as TimeSlot[]) || ['morning', 'lunch', 'afternoon'],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.emoji) {
      addToast('กรุณากรอกชื่อ ราคา และเลือกไอคอน', 'info');
      return;
    }
    try {
      if (editingItem) {
        await menuApi.update(editingItem.id, form);
        addToast('✅ อัปเดตเมนูแล้ว', 'success');
      } else {
        const result = await menuApi.create(form as MenuItemFormData);
        const newItem: MenuItem = {
          id: result.id,
          shopId: form.shopId!,
          name: form.name,
          emoji: form.emoji,
          price: form.price,
          prepTime: form.prepTime,
          description: form.description,
          tags: form.tags,
          isAvailable: true,
          timeSlots: form.timeSlots || [],
        };
        setItems(prev => [newItem, ...prev]);
        addToast('✅ เพิ่มเมนูใหม่แล้ว', 'success');
      }
      setShowModal(false);
      fetchItems();
    } catch {
      addToast('บันทึกไม่สำเร็จ', 'error');
    }
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }));
  };

  const toggleTimeSlot = (slot: TimeSlot) => {
    setForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots?.includes(slot)
        ? prev.timeSlots.filter(s => s !== slot)
        : [...(prev.timeSlots || []), slot],
    }));
  };

  // Sort items: available first, then by name
  const sortedItems = [...items].sort((a, b) => {
    if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
    return a.name.localeCompare(b.name, 'th');
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink">จัดการเมนูอาหาร</h2>
          <p className="text-sm text-muted mt-0.5">{items.length} เมนู — {items.filter(i => i.isAvailable).length} เปิดขาย</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" />
          เพิ่มเมนูใหม่
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-muted">
              <th className="text-left px-5 py-3 font-semibold">เมนู</th>
              <th className="text-left px-5 py-3 font-semibold">ราคา</th>
              <th className="text-left px-5 py-3 font-semibold">เวลาเตรียม</th>
              <th className="text-left px-5 py-3 font-semibold">แท็ก</th>
              <th className="text-left px-5 py-3 font-semibold">เวลาขาย</th>
              <th className="text-left px-5 py-3 font-semibold">สถานะ</th>
              <th className="text-left px-5 py-3 font-semibold">AI คะแนน</th>
              <th className="text-left px-5 py-3 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map(item => {
              const perf = itemPerformance(item.id);
              const score = computeAIScore(item, perf.count);
              const tip = getAITip(score, perf.count);
              const scoreBadge = getScoreBadge(score);

              return (
                <motion.tr
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-t border-gray-50 hover:bg-gray-50/50 ${!item.isAvailable ? 'opacity-50' : ''}`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <p className="font-medium text-ink">{item.name}</p>
                        {tip && <p className="text-[10px] text-amber-600 font-medium mt-0.5">{tip}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink">{item.price} ฿</td>
                  <td className="px-5 py-3 text-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.prepTime} นาที</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="badge badge-info">{tag}</span>
                      ))}
                      {item.tags.length > 2 && <span className="text-[10px] text-muted">+{item.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {(['morning', 'lunch', 'afternoon'] as TimeSlot[]).map(slot => (
                        <span
                          key={slot}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            item.timeSlots?.includes(slot)
                              ? 'bg-brand-50 text-brand-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {TIME_SLOT_LABELS[slot]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        item.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                          item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-brand-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedItems.map(item => {
          const perf = itemPerformance(item.id);
          const score = computeAIScore(item, perf.count);
          const tip = getAITip(score, perf.count);
          const scoreBadge = getScoreBadge(score);

          return (
            <motion.div key={item.id} layout className={`card p-4 ${!item.isAvailable ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink truncate">{item.name}</h3>
                    {!item.isAvailable && <Badge variant="danger">หมดแล้ว</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span>{item.price} ฿</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {item.prepTime} นาที</span>
                  </div>
                  {tip && <p className="text-[10px] text-amber-600 font-medium mt-1">{tip}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${item.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-muted">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-2 rounded-lg hover:bg-red-50 text-muted">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
                <h3 className="font-bold text-ink text-lg">
                  {editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Emoji Picker */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">ไอคอนอาหาร</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {FOOD_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setForm(prev => ({ ...prev, emoji }))}
                        className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all ${
                          form.emoji === emoji
                            ? 'bg-brand-100 ring-2 ring-brand-500 scale-110'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">ชื่อเมนู</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="เช่น ข้าวผัดกะเพราไก่"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">รายละเอียด</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="อธิบายสั้นๆ เกี่ยวกับเมนูนี้"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
                  />
                </div>

                {/* Price + Prep Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">ราคา (บาท)</label>
                    <input
                      type="number"
                      value={form.price || ''}
                      onChange={e => setForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      placeholder="40"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">เวลาเตรียม (นาที)</label>
                    <input
                      type="number"
                      value={form.prepTime || ''}
                      onChange={e => setForm(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                      placeholder="5"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">แท็ก</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          form.tags.includes(tag)
                            ? 'bg-brand-600 text-white'
                            : 'bg-gray-100 text-muted hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">เวลาขาย</label>
                  <div className="flex gap-2">
                    {(['morning', 'lunch', 'afternoon'] as TimeSlot[]).map(slot => (
                      <button
                        key={slot}
                        onClick={() => toggleTimeSlot(slot)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          form.timeSlots?.includes(slot)
                            ? 'bg-brand-600 text-white'
                            : 'bg-gray-100 text-muted hover:bg-gray-200'
                        }`}
                      >
                        {TIME_SLOT_LABELS[slot]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100 flex gap-2 rounded-b-2xl">
                <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>ยกเลิก</Button>
                <Button className="flex-1" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  บันทึก
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
