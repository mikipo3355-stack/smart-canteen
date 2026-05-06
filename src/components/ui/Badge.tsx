import { cn } from '../../lib/utils';

type BadgeVariant = 'success' | 'warning' | 'info' | 'danger';

const variantMap: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-brand-50 text-brand-700',
  danger: 'bg-red-50 text-red-700',
};

export function Badge({
  children,
  variant = 'info',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', variantMap[variant], className)}>
      {children}
    </span>
  );
}
