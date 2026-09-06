import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
    <main className="grid min-h-screen place-items-center bg-clinic-surface px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-2xl font-semibold text-clinic-ink">BCHealth</p>
          <p className="text-sm text-slate-500">Sign in to the clinic records system.</p>
        </div>
        {errors.root && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.root.message}
          </p>
        )}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" {...register('email')} />
          {errors.email && <span className="text-sm text-red-700">{errors.email.message}</span>}
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2" {...register('password')} />
          {errors.password && <span className="text-sm text-red-700">{errors.password.message}</span>}
        </label>
        <button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-clinic-blue px-4 py-2 font-medium text-white disabled:opacity-60">
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="mt-4 flex justify-between text-sm">
          <Link className="font-medium text-clinic-blue hover:underline" to="/forgot-password">
            Forgot password
          </Link>
          <Link className="font-medium text-clinic-blue hover:underline" to="/reset-password">
            Reset password
          </Link>
        </div>
      </form>
    </main>
  );
}
