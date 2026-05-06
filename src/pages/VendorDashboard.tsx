import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingBag, Clock, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { useOrders, type OrderStatus } from '../store/orderStore';
import { useToast } from '../store/toastStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Sidebar } from '../components/layout/Sidebar';
import { VendorAIPanel } from '../components/features/VendorAIPanel';
import { VendorMenuManagement } from './VendorMenuManagement';
import { cn } from '../lib/utils';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'รอดำเนินการ',
  accepted: 'รับออเดอร์',
  preparing: 'กำลังทำ',
  ready: 'พร้อมรับ',
  picked_up: 'รับแล้ว',
};

const statusBadge: Record<OrderStatus, 'warning' | 'info' | 'success' | 'danger'> = {
  pending: 'warning',
  accepted: 'info',
  preparing: 'info',
  ready: 'success',
  picked_up: 'danger',
};

export function VendorDashboard() {
  const { orders, isLoading, advanceOrderStatus } = useOrders();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  const handleAdvance = (orderId: string, currentStatus: OrderStatus) => {
    advanceOrderStatus(orderId);
    const flow: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'picked_up'];
    const idx = flow.indexOf(currentStatus);
    if (idx < flow.length - 1) {
      const nextStatus = flow[idx + 1];
      if (nextStatus === 'ready') {
        addToast('🔔 ออเดอร์พร้อมรับแล้ว!', 'success');
      } else {
        addToast(`อัปเดตสถานะ: ${statusLabels[nextStatus]}`, 'info');
      }
    }
  };

  const stats = {
    total: orders.length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === 'pending' || o.status === 'accepted').length,
    popular: 'ข้าวผัดกะเพราไก่',
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role="vendor" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">แผงควบคุมร้านค้า</h1>
          <p className="text-muted text-sm mt-1">จัดการออเดอร์เข้าและเมนูอาหาร</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'ออเดอร์วันนี้', value: stats.total, icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'รายได้วันนี้', value: `${stats.revenue} บาท`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'รอดำเนินการ', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'เมนูยอดนิยม', value: stats.popular, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-muted mb-0.5">{stat.label}</p>
              <p className="font-bold text-ink text-lg truncate">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5',
              activeTab === 'orders' ? 'bg-white text-brand-600 shadow-sm' : 'text-muted hover:text-ink'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            ออเดอร์
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5',
              activeTab === 'menu' ? 'bg-white text-brand-600 shadow-sm' : 'text-muted hover:text-ink'
            )}
          >
            <UtensilsCrossed className="w-4 h-4" />
            จัดการเมนู
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div
              key="orders-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <VendorAIPanel />

              <div className="card overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-ink text-lg">ออเดอร์วันนี้</h2>
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-muted">
                        <th className="text-left px-5 py-3 font-semibold">คิว</th>
                        <th className="text-left px-5 py-3 font-semibold">นักเรียน</th>
                        <th className="text-left px-5 py-3 font-semibold">รายการ</th>
                        <th className="text-left px-5 py-3 font-semibold">เวลารับ</th>
                        <th className="text-left px-5 py-3 font-semibold">สถานะ</th>
                        <th className="text-left px-5 py-3 font-semibold">รวม</th>
                        <th className="text-left px-5 py-3 font-semibold">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {orders.map(order => (
                          <motion.tr key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-50 hover:bg-gray-50/50">
                            <td className="px-5 py-4"><span className="font-bold text-brand-600">{order.queueNo}</span></td>
                            <td className="px-5 py-4 font-medium text-ink">{order.studentName}</td>
                            <td className="px-5 py-4 text-muted max-w-[200px] truncate">
                              {order.items.map((i: any) => `${i.emoji} ${i.name} x${i.quantity}`).join(', ')}
                            </td>
                            <td className="px-5 py-4 text-muted">{order.pickupTime}</td>
                            <td className="px-5 py-4"><Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge></td>
                            <td className="px-5 py-4 font-semibold text-ink">{order.total} บาท</td>
                            <td className="px-5 py-4">
                              {order.status !== 'picked_up' && (
                                <Button size="sm" onClick={() => handleAdvance(order.id, order.status)}>
                                  {order.status === 'pending' ? 'รับออเดอร์' :
                                   order.status === 'accepted' ? 'เริ่มทำ' :
                                   order.status === 'preparing' ? 'พร้อมรับ' : 'เสร็จสิ้น'}
                                </Button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-gray-50">
                  {orders.map(order => (
                    <div key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-brand-600">{order.queueNo}</span>
                        <Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge>
                      </div>
                      <p className="font-medium text-ink text-sm">{order.studentName}</p>
                      <p className="text-muted text-xs mt-1">
                        {order.items.map((i: any) => `${i.emoji} ${i.name} x${i.quantity}`).join(', ')}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-muted text-xs">{order.pickupTime} — {order.total} บาท</span>
                        {order.status !== 'picked_up' && (
                          <Button size="sm" onClick={() => handleAdvance(order.id, order.status)}>
                            {order.status === 'pending' ? 'รับออเดอร์' :
                             order.status === 'accepted' ? 'กำลังทำ' :
                             order.status === 'preparing' ? 'พร้อมรับ' : 'เสร็จสิ้น'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <VendorMenuManagement />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
