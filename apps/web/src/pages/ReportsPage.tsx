import { useQuery } from '@tanstack/react-query';
import {
  Activity, AlertTriangle, BarChart3, CalendarDays, CalendarRange, ClipboardCheck,
  EllipsisVertical, FileCheck, Megaphone, Package, TrendingUp, Users,
} from 'lucide-react';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getReportsSummary } from '../services/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ActivityChart({ total }: { total: number }) {
  const level = Math.max(0, Math.min(92, total));
  const y = 112 - level;
  return (
    <div className="mt-5">
      <div className="relative h-[170px] overflow-hidden rounded-xl border border-slate-100 bg-[linear-gradient(to_right,#e9f0f3_1px,transparent_1px),linear-gradient(to_bottom,#e9f0f3_1px,transparent_1px)] bg-[size:8.33%_25%]">
        <svg viewBox="0 0 720 170" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label={`${total} completed visits recorded`}>
          <defs>
            <linearGradient id="visitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#159a83" stopOpacity=".28" />
              <stop offset="100%" stopColor="#159a83" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0 140 C120 140 180 ${y} 300 ${y} S480 140 720 ${y} L720 170 L0 170 Z`} fill="url(#visitArea)" />
          <path d={`M0 140 C120 140 180 ${y} 300 ${y} S480 140 720 ${y}`} fill="none" stroke="#0f8a76" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          {[0, 144, 288, 432, 576, 720].map((x, index) => <circle key={x} cx={x} cy={index % 2 ? y : 140} r="5" fill="#0f8a76" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" />)}
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-12 text-center text-[11px] text-slate-500">
        {months.map((month) => <span key={month}>{month}</span>)}
      </div>
    </div>
  );
}

export function ReportsPage() {
  const summary = useQuery({ queryKey: ['reports-summary'], queryFn: getReportsSummary });
  if (summary.isLoading) return <LoadingState label="Loading reports..." />;
  if (summary.isError || !summary.data) return <ErrorState message="Unable to load reports." />;

  const data = summary.data;
  const inStock = Math.max(0, data.medicines - data.lowStock);
  const stockRatio = data.medicines > 0 ? (inStock / data.medicines) * 100 : 0;
  const cards = [
    { label: 'Active patients', value: data.patients, icon: Users, tone: 'emerald' },
    { label: "Today's visits", value: data.visitsToday, icon: Activity, tone: 'teal' },
    { label: 'Upcoming appointments', value: data.appointmentsUpcoming, icon: CalendarDays, tone: 'teal' },
    { label: 'Pending requirements', value: data.pendingRequirements, icon: ClipboardCheck, tone: 'cyan' },
    { label: 'Clearances for review', value: data.clearancesForReview, icon: FileCheck, tone: 'emerald' },
    { label: 'Low-stock medicines', value: data.lowStock, icon: AlertTriangle, tone: 'amber' },
  ] as const;

  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    teal: 'bg-teal-50 text-teal-600',
    cyan: 'bg-cyan-50 text-cyan-700',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-700">Insights</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.025em] text-slate-950 sm:text-[32px]">Reports &amp; dashboard</h1>
          <p className="mt-1 text-[15px] text-slate-500">Live operational summary across the clinic system.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-semibold text-emerald-700">
          <BarChart3 className="h-4 w-4" /> Live data <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="flex min-h-[112px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,54,64,0.04)]">
            <span className={`grid h-[68px] w-[68px] shrink-0 place-items-center rounded-2xl ${toneClasses[card.tone]}`}><card.icon className="h-7 w-7" strokeWidth={2} /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">{card.label}</p>
              <p className="mt-1 text-[30px] font-bold leading-none tracking-tight text-slate-950">{card.value}</p>
            </div>
            <div className="flex h-full flex-col items-end justify-between self-stretch">
              <button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700" aria-label={`More options for ${card.label}`}><EllipsisVertical className="h-5 w-5" /></button>
              <span className={`flex items-center gap-1 text-[12px] font-semibold ${card.tone === 'amber' ? 'text-rose-500' : 'text-emerald-600'}`}><TrendingUp className="h-3.5 w-3.5" /> +0%</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,54,64,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-[17px] font-bold text-slate-950">Visit Activity</h2><p className="mt-1 text-[14px] text-slate-500">Completed visits recorded in the system.</p></div>
            <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold text-slate-600"><CalendarRange className="h-4 w-4" /> This Year</span>
          </div>
          <ActivityChart total={data.visitsCompleted} />
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,54,64,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-[17px] font-bold text-slate-950">Inventory Overview</h2><p className="mt-1 text-[14px] text-slate-500">Medicine records and stock attention.</p></div>
            <a href="/inventory/medicines" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50"><Package className="h-4 w-4" /> View Inventory</a>
          </div>
          <div className="mt-7 grid items-center gap-7 sm:grid-cols-[210px_1fr]">
            <div className="relative mx-auto h-[170px] w-[170px] rounded-full" style={{ background: `conic-gradient(#168c72 0 ${stockRatio}%, #f6b544 ${stockRatio}% 100%)` }}>
              <div className="absolute inset-[23px] grid place-items-center rounded-full bg-white text-center"><div><strong className="block text-[28px] text-slate-950">{data.medicines}</strong><span className="text-[12px] text-slate-500">Total Medicines</span></div></div>
            </div>
            <dl className="divide-y divide-slate-100 text-[14px]">
              <div className="flex items-center gap-3 py-4"><span className="h-3.5 w-3.5 rounded-full bg-emerald-600" /><dt className="text-slate-600">In Stock</dt><dd className="ml-auto font-bold text-slate-950">{inStock}</dd></div>
              <div className="flex items-center gap-3 py-4"><span className="h-3.5 w-3.5 rounded-full bg-amber-400" /><dt className="text-slate-600">Low Stock</dt><dd className="ml-auto font-bold text-slate-950">{data.lowStock}</dd></div>
              <div className="flex items-center gap-3 py-4"><span className="h-3.5 w-3.5 rounded-full bg-slate-300" /><dt className="text-slate-600">Tracked</dt><dd className="ml-auto font-bold text-slate-950">{data.medicines}</dd></div>
            </dl>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,54,64,0.04)]">
          <div className="flex items-start justify-between p-5 pb-4 sm:px-6"><div><h2 className="text-[17px] font-bold text-slate-950">Recent Clinic Visits</h2><p className="mt-1 text-[14px] text-slate-500">Latest patient visits recorded.</p></div><a href="/clinic/visits" className="rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50">View All</a></div>
          <div className="mx-5 mb-5 rounded-xl bg-slate-50 px-4 py-6 text-center sm:mx-6"><Activity className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-[13px] text-slate-500">{data.visitsToday ? `${data.visitsToday} visit${data.visitsToday === 1 ? '' : 's'} recorded today` : 'No visits recorded today'}</p></div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,54,64,0.04)]">
          <div className="flex items-start justify-between p-5 pb-4 sm:px-6"><div><h2 className="text-[17px] font-bold text-slate-950">Announcements</h2><p className="mt-1 text-[14px] text-slate-500">Latest updates and reminders.</p></div><a href="/announcements" className="rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50">View All</a></div>
          <div className="mx-5 mb-5 flex items-center gap-4 rounded-xl bg-emerald-50/70 px-4 py-4 sm:mx-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-600"><Megaphone className="h-5 w-5" /></span>
            <div className="min-w-0"><p className="text-[14px] font-bold text-slate-900">Welcome to CLINICKA!</p><p className="mt-0.5 truncate text-[13px] text-slate-500">Your health management system is now active.</p></div>
            <span className="ml-auto hidden text-[12px] text-slate-500 sm:block">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </article>
      </section>
    </div>
  );
}
