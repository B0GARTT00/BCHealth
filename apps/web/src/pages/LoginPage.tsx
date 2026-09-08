import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin.demo@bchealth.local', password: 'DemoPass123!' },
  });

  async function onSubmit(values: LoginForm) {
    try {
      await auth.login(values.email, values.password);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch {
      setError('root', { message: 'Sign in failed. Check your email and password.' });
    }
  }

  return (
    <main className="login-page relative min-h-screen overflow-hidden bg-brokenshire-900">
      <div className="login-backdrop absolute inset-0" aria-hidden="true" />
      <div className="login-scrim absolute inset-0" aria-hidden="true" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:justify-end lg:px-[9vw]">
        <div className="pointer-events-none absolute bottom-10 left-[8vw] hidden max-w-sm text-white lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-100/85">Brokenshire College</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">Care that keeps<br />your community well.</h1>
          <p className="mt-3 text-sm leading-6 text-emerald-50/70">A web-based health information management system for private higher education in Davao City.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="login-card relative w-full max-w-[440px] rounded-[22px] border p-8 shadow-2xl sm:p-10">
          <div className="mb-8">
            <div className="mb-7 flex items-center gap-2.5"><img src="/Clinova.png" alt="CLINOVA logo" width="32" height="32" className="h-8 w-8 rounded-full object-contain" /><p className="text-base font-semibold tracking-tight text-white">CLINOVA</p></div>
            <p className="text-2xl font-semibold tracking-tight text-white">Welcome back</p>
            <p className="mt-1.5 text-[13px] text-emerald-50/75">Sign in to your private clinic workspace.</p>
          </div>
          {errors.root && <p className="mb-5 rounded-xl border border-rose-200/40 bg-rose-950/40 px-3 py-2.5 text-[12px] text-rose-100">Unable to sign in. Please check your email and password.</p>}
          <label className="mb-5 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Email</span><input autoComplete="email" className="login-input h-10 w-full rounded-xl px-3 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('email')} />{errors.email && <span className="text-[12px] text-rose-100">{errors.email.message}</span>}</label>
          <label htmlFor="password" className="mb-7 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Password</span><span className="relative block"><input id="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} className="login-input h-10 w-full rounded-xl px-3 pr-10 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('password')} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-lg text-emerald-800/60 hover:bg-emerald-50/60" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>{errors.password && <span className="text-[12px] text-rose-100">{errors.password.message}</span>}</label>
          <button disabled={isSubmitting} className="brand-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold text-white transition-colors disabled:opacity-60"><span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span><LogIn className="h-4 w-4" /></button>
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/15 bg-black/10 px-3.5 py-3 text-[11px] leading-4 text-emerald-50/75"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-200" /><span><strong className="font-semibold text-white/90">Private clinic workspace</strong><br />Health information is protected by role-based access controls.</span></div>
          {import.meta.env.DEV && <p className="mt-4 text-center text-[11px] text-emerald-50/55">Development demo: <span className="font-medium text-white/75">*.demo@bchealth.local</span></p>}
          <div className="mt-4 flex justify-center text-[12px]"><Link className="font-medium text-emerald-100 hover:text-white hover:underline" to="/forgot-password">Forgot your password?</Link></div>
          <p className="mt-7 text-center text-[11px] text-emerald-50/50">© 2026 CLINOVA · Private clinic information system</p>
        </form>
      </div>
    </main>
  );
}
