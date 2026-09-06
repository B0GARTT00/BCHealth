import type { ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';

export function Button({ loading, variant = 'primary', className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: 'primary' | 'secondary' | 'danger' }) {
  const styles = {
    primary: 'bg-brokenshire-600 text-white hover:bg-brokenshire-700 focus:ring-brokenshire-200',
    secondary: 'border border-medical-200 bg-white text-medical-700 hover:bg-medical-50 focus:ring-medical-200',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-100',
  };
  return <button {...props} disabled={loading || props.disabled} className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3.5 text-[13px] font-semibold shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}>{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}{children}</button>;
}
