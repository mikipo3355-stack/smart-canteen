import { LayoutDashboard, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const vendorNav = [
  { icon: LayoutDashboard, label: 'แดชบอร์ด', path: '/vendor' },
  { icon: ShoppingBag, label: 'ออเดอร์', path: '/vendor' },
  { icon: Settings, label: 'ตั้งค่า', path: '/vendor' },
];

const adminNav = [
  { icon: BarChart3, label: 'วิเคราะห์ข้อมูล', path: '/admin' },
  { icon: LayoutDashboard, label: 'ภาพรวม', path: '/admin' },
  { icon: Settings, label: 'ตั้งค่า', path: '/admin' },
];

export function Sidebar({ role }: { role: 'vendor' | 'admin' }) {
  const location = useLocation();
  const nav = role === 'vendor' ? vendorNav : adminNav;

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
          {role === 'vendor' ? 'แผงร้านค้า' : 'แผงผู้ดูแล'}
        </p>
      </div>
      <nav className="space-y-1">
        {nav.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-muted hover:bg-gray-50 hover:text-ink'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
