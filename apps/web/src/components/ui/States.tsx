import { AlertCircle, LoaderCircle } from 'lucide-react';

export function LoadingState({ label = 'Loading records...' }: { label?: string }) { return <div className="flex min-h-40 items-center justify-center gap-2 text-[13px] text-medical-500"><LoaderCircle className="h-4 w-4 animate-spin text-brokenshire-600" />{label}</div>; }
export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="flex min-h-40 flex-col items-center justify-center px-6 text-center"><p className="text-[13px] font-semibold text-medical-800">{title}</p><p className="mt-1 max-w-sm text-[12px] text-medical-500">{description}</p></div>; }
export function ErrorState({ message = 'Unable to load records.' }: { message?: string }) { return <div className="flex min-h-40 items-center justify-center gap-2 px-6 text-[13px] text-danger-700"><AlertCircle className="h-4 w-4" />{message}</div>; }
