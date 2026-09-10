import { cn } from '../utils/cn';

type AuthLayoutProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'center' | 'right';
  marketing?: React.ReactNode;
  branding?: React.ReactNode;
};

export function AuthLayout({ children, className, align = 'center', marketing, branding }: AuthLayoutProps) {
  const alignment = align === 'right' ? 'lg:justify-end lg:px-[9vw]' : '';

  return (
    <main className="login-page relative min-h-screen overflow-hidden bg-brokenshire-900">
      <div className="login-backdrop absolute inset-0" aria-hidden="true" />
      <div className="login-scrim absolute inset-0" aria-hidden="true" />
      <div className={cn('relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8', alignment)}>
        {branding && (
          <div className="pointer-events-none absolute top-[10vh] left-[8vw] hidden lg:flex">
            {branding}
          </div>
        )}
        {marketing && (
          <div className="pointer-events-none absolute bottom-10 left-[8vw] hidden max-w-sm text-white lg:block">
            {marketing}
          </div>
        )}
        <section className={cn('login-card relative w-full rounded-[22px] border shadow-2xl sm:p-10 lg:translate-x-[90px]', className)}>
          {children}
        </section>
      </div>
    </main>
  );
}
