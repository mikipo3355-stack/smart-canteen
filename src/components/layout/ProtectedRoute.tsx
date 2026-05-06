import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import type { UserRole } from '../../store/authStore';

export function ProtectedRoute({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role === 'student' ? 'student' : user.role === 'vendor' ? 'vendor' : 'admin'}`} replace />;
  }

  return <>{children}</>;
}
