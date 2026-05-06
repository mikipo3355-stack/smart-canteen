import { ShoppingBag, User, Bell, LogOut, ClipboardList, Clock, ChefHat, Package, CheckCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/cartStore';
import { useAuth } from '../../store/authStore';
import { useOrders, type OrderStatus } from '../../store/orderStore';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'รอร้านยืนยัน',
  accepted: 'ร้านรับแล้ว',
  preparing: 'กำลังทำ',
  ready: 'พร้อมรับ!',
  picked_up: 'รับแล้ว',
};

const statusBadge: Record<OrderStatus, 'warning' | 'info' | 'success' | 'danger'> = {
  pending: 'warning',
  accepted: 'info',
  preparing: 'info',
  ready: 'success',
  picked_up: 'danger',
};

const statusIcon: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  accepted: ChefHat,
  preparing: Package,
  ready: CheckCircle,
  picked_up: CheckCircle,
};

export function Navbar() {
  const { totalItems } = useCart();
  const { orders } = useOrders();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';
  if (isLanding) return null;

  const myActiveOrders = orders.filter(
    o => (o.studentId === user?.id || o.studentId === 'unknown') && o.status !== 'picked_up'
  );

  const roleLabel = user?.role === 'student' ? 'นักเรียน' :
    user?.role === 'vendor' ? 'ร้านค้า' : 'ผู้ดูแล';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'vendor' ? '/vendor' : user?.role === 'admin' ? '/admin' : '/student'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SC</span>
            </div>
            <span className="font-bold text-ink text-lg hidden sm:block">Smart Canteen</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Track Order Button */}
            {user?.role === 'student' && myActiveOrders.length > 0 && (() => {
              const order = myActiveOrders[0];
              const Icon = statusIcon[order.status];
              return (
                <button
                  onClick={() => navigate('/confirmation', { state: { order } })}
                  className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors border border-brand-200"
                >
                  <Icon className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-brand-700">คิว {order.queueNo}</span>
                  <Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge>
                </button>
              );
            })()}

            {/* Track Orders (multiple) */}
            {user?.role === 'student' && myActiveOrders.length > 1 && (
              <button
                onClick={() => navigate('/student/orders')}
                className="btn-ghost relative"
                title="ดูออเดอร์ทั้งหมด"
              >
                <ClipboardList className="w-5 h-5 text-brand-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {myActiveOrders.length}
                </span>
              </button>
            )}

            <button className="btn-ghost relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="btn-ghost">
              <Bell className="w-5 h-5" />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-ink leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted">{roleLabel}</p>
                </div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-ink text-sm">{user?.name}</p>
                      <p className="text-xs text-muted">{roleLabel}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      ออกจากระบบ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
