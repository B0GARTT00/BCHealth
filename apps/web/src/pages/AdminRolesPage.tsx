import { useQuery } from '@tanstack/react-query';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getAdminRoles } from '../services/api';

export function AdminRolesPage() {
  const roles = useQuery({ queryKey: ['admin-roles'], queryFn: getAdminRoles });
  if (roles.isLoading) return <LoadingState label="Loading roles and permissions..." />;
  if (roles.isError) return <ErrorState message="Unable to load roles. Administrator access is required." />;
  return <div className="space-y-6"><header className="flex items-end justify-between border-b border-medical-200 pb-6"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Administration</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Roles & permissions</h1><p className="mt-1 text-[13px] text-medical-500">Review access boundaries for every system role.</p></div><Badge variant="success"><ShieldCheck className="mr-1 inline h-3 w-3" />Administrator only</Badge></header><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{roles.data?.map((role) => <Card key={role.id} title={role.name} description={role.description || 'Configured system role'}><div className="flex items-center justify-between border-b border-medical-100 px-5 py-3 text-[11px] text-medical-500"><span>{role._count.users} assigned users</span><span>{role.permissions.length} permissions</span></div><div className="space-y-2 p-5">{role.permissions.map(({ permission }) => <div className="flex items-start gap-2 text-[12px] text-medical-700" key={permission.key}><KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brokenshire-600" /><span>{permission.key}</span></div>)}</div></Card>)}</section></div>;
}
