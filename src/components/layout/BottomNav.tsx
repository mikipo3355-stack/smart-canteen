import { Home, Search, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Home, label: 'หน้าแรก', path: '/student' },
  { icon: Search, label: 'ค้นหา', path: '/student' },
  { icon: ClipboardList, label: 'ออเดอร์', path: '/student/orders' },
  { icon: User, label: 'โปรไฟล์', path: '/student/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                active ? 'text-brand-600' : 'text-muted hover:text-ink'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
