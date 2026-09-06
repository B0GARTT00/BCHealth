import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, ArrowUpRight, CalendarCheck, ClipboardCheck, Clock3, UserRound } from 'lucide-react';
import { getHealth } from '../services/api';

const cards = [
  { label: "Today's visits", value: '24', icon: Activity, tone: 'text-brokenshire-600', change: '+12%' },
  { label: 'In queue', value: '08', icon: Clock3, tone: 'text-sky-600', change: '3 urgent' },
  { label: 'Low-stock medicines', value: '03', icon: AlertTriangle, tone: 'text-amber-600', change: 'Review now' },
  { label: 'Referrals this week', value: '11', icon: ArrowUpRight, tone: 'text-emerald-600', change: '+4%' },
];

export function DashboardPage() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth, retry: 1 });

  return (
    <div className="space-y-7">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600">Monday, 06 September 2026</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight">Clinic Dashboard</h2>
        <p className="mt-1 text-[13px] text-slate-500">A quiet view of today&apos;s clinical operations.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{card.label}</p>
              <card.icon className={`h-4 w-4 ${card.tone}`} />
            </div>
            <div className="mt-4 flex items-end justify-between"><p className="text-3xl font-semibold tracking-tight">{card.value}</p><span className="text-[11px] text-slate-400">{card.change}</span></div>
          </article>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Queue now serving</p><p className="mt-1 text-[13px] text-slate-500">Live clinic flow</p></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">Live</span></div>
          <div className="divide-y divide-slate-100"><div className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><span className="text-xl font-semibold text-slate-900">Q-024</span><span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-700">Urgent</span></div><span className="text-[12px] text-slate-500">Consultation room 2</span></div><div className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><span className="text-xl font-semibold text-slate-900">Q-025</span><span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Waiting</span></div><span className="text-[12px] text-slate-500">Triage room</span></div></div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">System status</p><p className="mt-1 text-[13px] text-slate-500">Secure services overview</p></div>
          <div className="space-y-3 p-5"><div className="flex items-center justify-between text-[13px]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> API service</span><span className="text-slate-500">{health.isLoading ? 'Checking...' : health.data?.status === 'ok' ? 'Online' : 'Unavailable'}</span></div><div className="flex items-center justify-between text-[13px]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Audit logging</span><span className="text-emerald-600">Enabled</span></div><div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400"><UserRound className="h-3.5 w-3.5" /> Authorized staff only</div></div>
        </section>
      </div>
    </div>
  );
}
