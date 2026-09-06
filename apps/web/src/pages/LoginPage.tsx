import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
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
  const [role, setRole] = useState('ADMIN');
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
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="mb-7">
          <div className="mb-5 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-brokenshire-600 text-sm font-bold text-white">B</div><p className="text-lg font-semibold tracking-tight text-slate-950">BCHealth</p></div>
          <p className="text-[22px] font-semibold tracking-tight text-slate-950">Welcome back</p>
          <p className="mt-1 text-[13px] text-slate-500">Sign in to the private clinic workspace.</p>
        </div>
        {errors.root && (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
            {errors.root.message}
          </p>
        )}
        <label className="mb-4 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">Role</span><select value={role} onChange={(event) => setRole(event.target.value)} className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-[13px] outline-none focus:border-brokenshire-600 focus:ring-2 focus:ring-brokenshire-100"><option>NURSE</option><option>DOCTOR</option><option>ADMIN</option></select></label>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">Email</span>
          <input className="h-9 w-full rounded-xl border border-slate-300 px-3 text-[13px] outline-none focus:border-brokenshire-600 focus:ring-2 focus:ring-brokenshire-100" {...register('email')} />
          {errors.email && <span className="text-[12px] text-rose-600">{errors.email.message}</span>}
        </label>
        <label className="mb-6 block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">Password</span>
          <input type="password" className="h-9 w-full rounded-xl border border-slate-300 px-3 text-[13px] outline-none focus:border-brokenshire-600 focus:ring-2 focus:ring-brokenshire-100" {...register('password')} />
          {errors.password && <span className="text-[12px] text-rose-600">{errors.password.message}</span>}
        </label>
        <button disabled={isSubmitting} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-brokenshire-600 px-4 text-[13px] font-semibold text-white shadow-sm shadow-brokenshire-600/20 transition-colors hover:bg-brokenshire-700 disabled:opacity-60">
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-4 text-center text-[11px] text-slate-400">Demo access: <span className="font-medium text-slate-600">*.demo@bchealth.local</span></p>
        <div className="mt-5 flex justify-between text-[12px]">
          <Link className="font-medium text-brokenshire-700 hover:underline" to="/forgot-password">
            Forgot password
          </Link>
          <Link className="font-medium text-brokenshire-700 hover:underline" to="/reset-password">
            Reset password
          </Link>
        </div>
      </form>
    </main>
  );
}
