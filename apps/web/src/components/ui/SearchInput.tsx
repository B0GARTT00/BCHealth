import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function SearchInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('flex h-9 items-center gap-2 rounded-xl border border-medical-200 bg-white px-3 text-medical-400 focus-within:border-brokenshire-600 focus-within:ring-2 focus-within:ring-brokenshire-100', className)}>
      <Search className="h-4 w-4" />
      <input {...props} className="min-w-0 flex-1 bg-transparent text-[13px] text-medical-800 outline-none placeholder:text-medical-400" />
    </label>
  );
}
