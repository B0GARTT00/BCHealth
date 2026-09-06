import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, CalendarCheck, ClipboardCheck } from 'lucide-react';
import { getHealth } from '../services/api';

const cards = [
  { label: "Today's visits", value: '0', icon: Activity, tone: 'text-clinic-teal' },
  { label: 'Upcoming appointments', value: '0', icon: CalendarCheck, tone: 'text-clinic-blue' },
  { label: 'Pending clearances', value: '0', icon: ClipboardCheck, tone: 'text-clinic-green' },
  { label: 'Low-stock medicines', value: '0', icon: AlertTriangle, tone: 'text-clinic-amber' },
];

export function DashboardPage() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth, retry: 1 });

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Clinic Dashboard</h2>
        <p className="text-sm text-slate-500">Operational overview for authorized clinic personnel.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.tone}`} />
            </div>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold">System status</h3>
        <p className="mt-2 text-sm text-slate-600">
          API: {health.isLoading ? 'Checking...' : health.data?.status === 'ok' ? `Online (${health.data.service})` : 'Unavailable'}
        </p>
      </section>
    </div>
  );
}
