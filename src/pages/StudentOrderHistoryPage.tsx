import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { useOrders, type OrderStatus } from '../store/orderStore';
import { useAuth } from '../store/authStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

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

const statusIcon: Record<OrderStatus, typeof Package> = {
  pending: Clock,
  accepted: Package,
  preparing: Package,
  ready: CheckCircle,
  picked_up: CheckCircle,
};

const filterTabs = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'active', label: 'กำลังดำเนินการ' },
  { key: 'completed', label: 'เสร็จสิ้น' },
];

export function StudentOrderHistoryPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  const myOrders = orders.filter(o => o.studentId === user?.id || o.studentId === 'unknown');

  const filtered = myOrders.filter(o => {
    if (activeFilter === 'active') return o.status !== 'picked_up';
    if (activeFilter === 'completed') return o.status === 'picked_up';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-bold text-ink">ประวัติการสั่งซื้อ</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === tab.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-bold text-ink text-lg mb-2">ยังไม่มีออเดอร์</h3>
            <p className="text-muted text-sm mb-6">เริ่มสั่งอาหารเพื่อติดตามสถานะ</p>
            <Button onClick={() => navigate('/student')}>เลือกร้านอาหาร</Button>
          </motion.div>
        ) : (
          filtered.map((order, idx) => {
            const StatusIcon = statusIcon[order.status];
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="card p-5 mb-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.status === 'picked_up' ? 'bg-gray-100' :
                      order.status === 'ready' ? 'bg-emerald-100' :
                      'bg-brand-100'
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        order.status === 'picked_up' ? 'text-gray-500' :
                        order.status === 'ready' ? 'text-emerald-600' :
                        'text-brand-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-ink">คิว <span className="text-brand-600">{order.queueNo}</span></p>
                      <p className="text-xs text-muted">เวลารับ: {order.pickupTime}</p>
                    </div>
                  </div>
                  <Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge>
                </div>

                {/* Items */}
                <div className="border-t border-gray-50 pt-3 mb-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-1">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-ink flex-1">{item.name}</span>
                      <span className="text-muted">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">{order.total} บาท</span>
                  {order.status !== 'picked_up' && (
                    <button
                      onClick={() => navigate('/confirmation', { state: { order } })}
                      className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline"
                    >
                      ติดตาม <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
