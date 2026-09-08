import { useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getAuditLogs } from '../services/api';

export function AuditLogsPage() {
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [filters, setFilters] = useState({ action: '', entity: '' });
  const logs = useQuery({ queryKey: ['audit-logs', filters], queryFn: () => getAuditLogs(filters.action, filters.entity) });
  if (logs.isLoading) return <LoadingState label="Loading audit logs..." />;
  if (logs.isError) return <ErrorState message="Unable to load audit logs. Administrator access is required." />;
  return <div className="space-y-6"><header className="flex items-end justify-between border-b border-medical-200 pb-6"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Security</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Audit logs</h1><p className="mt-1 text-[13px] text-medical-500">Review recorded changes and sensitive system activity.</p></div><Badge variant="success"><ShieldCheck className="mr-1 inline h-3 w-3" />Administrator only</Badge></header><Card title="Filter activity" description="Search by action or entity type."><form className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end" onSubmit={(event) => { event.preventDefault(); setFilters({ action, entity }); }}><label className="flex-1"><span className="field-label">Action</span><input value={action} onChange={(event) => setAction(event.target.value)} className="field-input" placeholder="PATIENT_CREATED" /></label><label className="flex-1"><span className="field-label">Entity</span><input value={entity} onChange={(event) => setEntity(event.target.value)} className="field-input" placeholder="Patient" /></label><Button><Search className="h-4 w-4" />Filter</Button></form></Card><Card title="Activity history" description={`${logs.data?.length ?? 0} records shown.`}>{logs.data?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-medical-100 text-[10px] uppercase tracking-widest text-medical-500"><tr><th className="px-5 py-3">Time</th><th className="px-5 py-3">Actor</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Entity</th><th className="px-5 py-3">Entity ID</th></tr></thead><tbody className="divide-y divide-medical-100">{logs.data.map((log) => <tr className="text-[12px]" key={log.id}><td className="px-5 py-4 text-medical-500">{new Date(log.createdAt).toLocaleString()}</td><td className="px-5 py-4 text-medical-700">{log.actor?.displayName || 'System'}</td><td className="px-5 py-4 font-semibold text-medical-900">{log.action}</td><td className="px-5 py-4"><Badge variant="neutral">{log.entity}</Badge></td><td className="px-5 py-4 text-medical-500">{log.entityId || '-'}</td></tr>)}</tbody></table></div> : <p className="p-5 text-[13px] text-medical-500">No audit activity found.</p>}</Card></div>;
}
