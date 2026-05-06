import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, ChefHat, CheckCircle, Package, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { WasteInsight } from '../components/features/WasteInsight';
import { Button } from '../components/ui/Button';
import { useOrders, type OrderStatus } from '../store/orderStore';
import { useToast } from '../store/toastStore';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'รอร้านยืนยัน',
  accepted: 'ร้านรับออเดอร์แล้ว',
  preparing: 'กำลังทำอาหาร',
  ready: 'พร้อมรับแล้ว!',
  picked_up: 'รับอาหารแล้ว',
};

const statusDescriptions: Record<OrderStatus, string> = {
  pending: 'ออเดอร์ของคุณกำลังรอร้านค้ายืนยัน...',
  accepted: 'ร้านค้ายืนยันออเดอร์แล้ว กำลังเตรียมทำอาหาร',
  preparing: 'ครัวกำลังทำอาหารของคุณอย่างพิถีพิถัน 🍳',
  ready: 'อาหารเสร็จแล้ว! มารับได้ที่ร้านค้า',
  picked_up: 'คุณรับอาหารแล้ว — คืนจานที่จุดรับคืน',
};

const statusIcon: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  accepted: ChefHat,
  preparing: Sparkles,
  ready: Package,
  picked_up: CheckCircle,
};

const statusFlow: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'picked_up'];

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addToast } = useToast();

  const [currentOrder, setCurrentOrder] = useState(() => {
    const stateOrder = location.state?.order;
    if (stateOrder) return stateOrder;
    return orders.find(o => o.queueNo === location.state?.order?.queueNo);
  });

  // Poll for order status updates (simulating real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = orders.find(o => o.id === currentOrder?.id);
      if (updated && updated.status !== currentOrder?.status) {
        setCurrentOrder(updated);
        if (updated.status === 'ready') {
          addToast('🎉 อาหารพร้อมรับแล้ว!', 'success');
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentOrder, orders, addToast]);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">📋</p>
        <h2 className="font-bold text-ink text-xl mb-2">ไม่พบออเดอร์</h2>
        <Button onClick={() => navigate('/student')} className="mt-4">กลับหน้าหลัก</Button>
      </div>
    );
  }

  const currentIdx = statusFlow.indexOf(currentOrder.status);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      <button onClick={() => navigate('/student')} className="btn-ghost mb-4 -ml-2">
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Success Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        className="text-center mb-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOrder.status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              currentOrder.status === 'pending' ? 'bg-amber-100' :
              currentOrder.status === 'accepted' ? 'bg-blue-100' :
              currentOrder.status === 'preparing' ? 'bg-brand-100' :
              currentOrder.status === 'ready' ? 'bg-emerald-100' :
              'bg-gray-100'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
              className="text-3xl"
            >
              {currentOrder.status === 'picked_up' ? '✓' :
               currentOrder.status === 'ready' ? '🎉' : '🍳'}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <h1 className="text-2xl font-bold text-ink mb-1">{statusLabels[currentOrder.status]}</h1>
        <p className="text-muted">{statusDescriptions[currentOrder.status]}</p>
      </motion.div>

      {/* Queue Number */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-8 text-center mb-6"
      >
        <p className="text-sm text-muted mb-1">หมายเลขคิวของคุณ</p>
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-6xl font-black text-brand-600 tracking-wider"
        >
          {currentOrder.queueNo}
        </motion.p>
      </motion.div>

      {/* Status Timeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-5 mb-6"
      >
        <h3 className="font-semibold text-ink mb-5">สถานะออเดอร์</h3>
        <div className="space-y-0">
          {statusFlow.map((status, i) => {
            const isComplete = i < currentIdx;
            const isCurrent = i === currentIdx;
            const Icon = statusIcon[status];
            return (
              <div key={status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isComplete ? 'bg-emerald-500 text-white' :
                    isCurrent ? 'bg-brand-600 text-white ring-4 ring-brand-200 animate-pulse' :
                    'bg-gray-100 text-gray-300'
                  }`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div className={`w-0.5 h-8 rounded transition-colors duration-500 ${
                      i < currentIdx ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={`font-semibold text-sm ${
                    isComplete || isCurrent ? 'text-ink' : 'text-muted/50'
                  }`}>
                    {statusLabels[status]}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-brand-600 mt-0.5 font-medium">
                      ← กำลังอยู่ขั้นตอนนี้
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-5 mb-6"
      >
        <h3 className="font-semibold text-ink mb-4">รายละเอียดคำสั่งซื้อ</h3>
        <div className="space-y-2 mb-4">
          {currentOrder.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-ink flex-1">{item.name}</span>
              <span className="text-muted">x{item.quantity}</span>
              <span className="font-semibold text-ink">{item.price * item.quantity} บาท</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted flex items-center gap-2">
              <MapPin className="w-4 h-4" /> เวลารับอาหาร
            </span>
            <span className="font-semibold text-ink">{currentOrder.pickupTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">ชำระเงิน</span>
            <Badge variant="success">ชำระแล้ว</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">ยอดรวม</span>
            <span className="font-bold text-brand-600 text-lg">{currentOrder.total} บาท</span>
          </div>
        </div>
      </motion.div>

      <WasteInsight />

      <div className="mt-6 space-y-3">
        <Button variant="ghost" className="w-full" onClick={() => navigate('/student')}>
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  );
}
