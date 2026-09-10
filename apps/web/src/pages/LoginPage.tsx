import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LockKeyhole, LogIn, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email().regex(/^[^@\s]+@brokenshire\.edu\.ph$/i, 'Use your @brokenshire.edu.ph email.'),
  displayName: z.string().optional(),
  password: z.string().min(8),
  confirmPassword: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationUrl, setVerificationUrl] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin.demo@brokenshire.edu.ph', password: 'DemoPass123!' },
  });

  async function onSubmit(values: LoginForm) {
    try {
      if (isSignup) {
        if (!values.displayName || values.displayName.trim().length < 2) {
          setError('displayName', { message: 'Enter your full name.' });
          return;
        }
        if (values.password !== values.confirmPassword) {
          setError('confirmPassword', { message: 'Passwords do not match.' });
          return;
        }
        const result = await auth.signup(values.email, values.displayName, values.password);
        setSuccessMessage(result.message);
        setVerificationUrl(result.verificationUrl);
        return;
      } else {
        await auth.login(values.email, values.password);
      }
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const responseMessage = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      const message = Array.isArray(responseMessage) ? responseMessage.join(' ') : responseMessage;
      setError('root', { message: message || (isSignup ? 'Unable to create the account.' : 'Sign in failed. Check your email and password.') });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-2xl font-semibold tracking-tight text-white">{isSignup ? 'Create your account' : 'Welcome back'}</p>
      <p className="mt-1.5 text-[13px] text-emerald-50/75">{isSignup ? 'Use your Brokenshire institutional email.' : 'Sign in to your private clinic workspace.'}</p>
      {errors.root && <p className="mb-5 mt-5 rounded-xl border border-rose-200/40 bg-rose-950/40 px-3 py-2.5 text-[12px] text-rose-100">{errors.root.message}</p>}
      {successMessage && (
        <div className="mb-5 mt-5 break-words rounded-xl border border-emerald-200/40 bg-emerald-950/40 px-3 py-2.5 text-[12px] text-emerald-100">
          <p>{successMessage}</p>
          {verificationUrl && <a href={verificationUrl} className="mt-2 inline-block font-semibold underline hover:text-white">Activate this development account</a>}
        </div>
      )}
      {isSignup && (
        <label className="mb-5 mt-5 block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Full name</span>
          <input autoComplete="name" className="login-input h-10 w-full rounded-xl px-3 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('displayName')} />
          {errors.displayName && <span className="text-[12px] text-rose-100">{errors.displayName.message}</span>}
        </label>
      )}
      <label className="mb-5 mt-5 block">
        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Email</span>
        <input autoComplete="email" className="login-input h-10 w-full rounded-xl px-3 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('email')} />
        {errors.email && <span className="text-[12px] text-rose-100">{errors.email.message}</span>}
      </label>
      <label htmlFor="password" className="mb-7 mt-5 block">
        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Password</span>
        <span className="relative block">
          <input id="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} className="login-input h-10 w-full rounded-xl px-3 pr-10 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('password')} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-lg text-emerald-800/60 hover:bg-emerald-50/60" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
        {errors.password && <span className="text-[12px] text-rose-100">{errors.password.message}</span>}
      </label>
      {isSignup && (
        <label htmlFor="confirm-password" className="mb-7 mt-5 block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-emerald-50/80">Confirm password</span>
          <input id="confirm-password" autoComplete="new-password" type="password" className="login-input h-10 w-full rounded-xl px-3 text-[13px] outline-none transition focus:ring-2 focus:ring-emerald-200" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="text-[12px] text-rose-100">{errors.confirmPassword.message}</span>}
        </label>
      )}
      <button type="submit" disabled={isSubmitting} className="brand-button mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold text-white transition-colors disabled:opacity-60">
        <span>{isSubmitting ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create account' : 'Sign in')}</span>
        {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
      </button>
      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/15 bg-black/10 px-3.5 py-3 text-[11px] leading-4 text-emerald-50/75">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-200" />
        <span>
          <strong className="font-semibold text-white/90">Private clinic workspace</strong>
          <br />
          Health information is protected by role-based access controls.
        </span>
      </div>
      {import.meta.env.DEV && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3 text-[11px] leading-4 text-emerald-50/70">
          <p className="mb-1.5 font-semibold text-emerald-100/90">Development demo accounts</p>
          <p>admin / nurse / faculty / staff / student</p>
          <p>@brokenshire.edu.ph &middot; password: DemoPass123!</p>
        </div>
      )}
      <div className="mt-4 flex justify-center gap-2 text-[12px]">
        <button
          type="button"
          onClick={() => {
            const nextSignup = !isSignup;
            setIsSignup(nextSignup);
            setSuccessMessage('');
            setVerificationUrl(undefined);
            setError('root', { message: '' });
            reset(nextSignup ? { email: '', displayName: '', password: '', confirmPassword: '' } : { email: 'admin.demo@brokenshire.edu.ph', password: 'DemoPass123!', displayName: '', confirmPassword: '' });
          }}
          className="font-medium text-emerald-100 hover:text-white hover:underline"
        >
          {isSignup ? 'Already have an account? Sign in' : 'Create an account'}
        </button>
        {!isSignup && <Link className="font-medium text-emerald-100 hover:text-white hover:underline" to="/forgot-password">Forgot your password?</Link>}
      </div>
      <p className="mt-7 text-center text-[11px] text-emerald-50/50">© 2026 CLINOVA · Private clinic information system</p>
    </form>
  );
}
