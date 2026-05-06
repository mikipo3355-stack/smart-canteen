import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Clock } from 'lucide-react';
import { CartItemRow } from '../components/features/CartItemRow';
import { PaymentModal } from '../components/features/PaymentModal';
import { useCart } from '../store/cartStore';
import { useOrders } from '../store/orderStore';
import { useToast } from '../store/toastStore';
import { useAuth } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { pickupSlots } from '../data/mockData';

export function CartCheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState('12:05');
  const [showPayment, setShowPayment] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-bold text-ink text-xl mb-2">ตะกร้าว่าง</h2>
        <p className="text-muted mb-6">เลือกร้านและเพิ่มอาหารเพื่อเริ่มต้น</p>
        <Button onClick={() => navigate('/student')}>เลือกร้านอาหาร</Button>
      </div>
    );
  }

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    const orderItems = items.map(i => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      emoji: i.emoji,
    }));
    const order = await placeOrder(orderItems, pickupTime, totalPrice, user?.name || 'นักเรียน', user?.id || 'unknown');
    clearCart();
    if (order) {
      addToast('💳 ชำระเงินสำเร็จ! กำลังเตรียมอาหาร', 'success');
      navigate('/confirmation', { state: { order } });
    } else {
      addToast('เกิดข้อผิดพลาดในการสั่งซื้อ', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-bold text-ink">ชำระเงิน</h1>
      </div>

      <motion.div layout className="mb-6"><CartItemRow /></motion.div>

      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-ink">เวลารับอาหาร</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {pickupSlots.map(slot => (
            <button key={slot} onClick={() => setPickupTime(slot)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pickupTime === slot ? 'bg-brand-600 text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'}`}>
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-50 to-cyan-50 rounded-xl border border-brand-100">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-sm">PromptPay QR Code</h3>
            <p className="text-muted text-xs mt-0.5">สแกนด้วยแอปธนาคารทุกธนาคาร</p>
          </div>
          <div className="ml-auto"><span className="badge badge-info">ปลอดภัย</span></div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted"><span>ยอดรวม</span><span>{totalPrice} บาท</span></div>
          <div className="flex justify-between text-muted"><span>ส่วนลด</span><span className="text-emerald-600">-0 บาท</span></div>
          <div className="flex justify-between text-muted"><span>ค่าบริการ</span><span className="text-emerald-600">ฟรี</span></div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-ink text-base"><span>รวมทั้งสิ้น</span><span>{totalPrice} บาท</span></div>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={() => setShowPayment(true)}>
        <QrCode className="w-5 h-5" />
        ชำระเงิน — {totalPrice} บาท
      </Button>

      <PaymentModal isOpen={showPayment} total={totalPrice} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
    </div>
  );
}
