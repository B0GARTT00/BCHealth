import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, CalendarDays, ClipboardCheck, FileCheck, Package, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getReportsSummary } from '../services/api';

export function ReportsPage() {
  const summary = useQuery({ queryKey: ['reports-summary'], queryFn: getReportsSummary });
  if (summary.isLoading) return <LoadingState label="Loading reports..." />;
  if (summary.isError || !summary.data) return <ErrorState message="Unable to load reports." />;
  const data = summary.data;
  const cards = [{ label: 'Active patients', value: data.patients, icon: Users }, { label: "Today's visits", value: data.visitsToday, icon: Activity }, { label: 'Upcoming appointments', value: data.appointmentsUpcoming, icon: CalendarDays }, { label: 'Pending requirements', value: data.pendingRequirements, icon: ClipboardCheck }, { label: 'Clearances for review', value: data.clearancesForReview, icon: FileCheck }, { label: 'Low-stock medicines', value: data.lowStock, icon: AlertTriangle }];
  return <div className="space-y-6"><header className="flex items-end justify-between border-b border-medical-200 pb-6"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Insights</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Reports & dashboard</h1><p className="mt-1 text-[13px] text-medical-500">Live operational summary across the clinic system.</p></div><Badge variant="success">Live data</Badge></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <Card key={card.label}><div className="flex items-center justify-between p-5"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-medical-500">{card.label}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-medical-900">{card.value}</p></div><card.icon className="h-5 w-5 text-brokenshire-600" /></div></Card>)}</section><div className="grid gap-5 lg:grid-cols-2"><Card title="Visit activity" description="Completed visits recorded in the system"><div className="flex items-center gap-3 p-5"><Activity className="h-5 w-5 text-brokenshire-600" /><p className="text-2xl font-semibold text-medical-900">{data.visitsCompleted}</p><span className="text-[12px] text-medical-500">total completed visits</span></div></Card><Card title="Inventory overview" description="Medicine master records and stock attention"><div className="flex items-center gap-3 p-5"><Package className="h-5 w-5 text-brokenshire-600" /><p className="text-2xl font-semibold text-medical-900">{data.medicines}</p><span className="text-[12px] text-medical-500">medicines tracked</span></div></Card></div></div>;
}
