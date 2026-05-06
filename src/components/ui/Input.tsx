export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ink placeholder:text-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${className ?? ''}`}
      {...props}
    />
  );
}
