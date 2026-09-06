import type { ReactNode } from 'react';

const variants = {
  success: 'border-success-border bg-success-bg text-success-700',
  warning: 'border-warning-border bg-warning-bg text-warning-700',
  danger: 'border-danger-border bg-danger-bg text-danger-700',
  neutral: 'border-medical-200 bg-medical-50 text-medical-600',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
};

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: keyof typeof variants }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${variants[variant]}`}>{children}</span>;
}
