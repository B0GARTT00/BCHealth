import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getAdminUsers } from '../services/api';

export function AdminUsersPage() {
  const users = useQuery({ queryKey: ['admin-users'], queryFn: getAdminUsers });
  if (users.isLoading) return <LoadingState label="Loading users..." />;
  if (users.isError) return <ErrorState message="Unable to load user administration." />;
  return <div className="space-y-6"><header className="flex items-end justify-between border-b border-medical-200 pb-6"><div><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Administration</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">User administration</h1><p className="mt-1 text-[13px] text-medical-500">Review accounts, roles, and activation status.</p></div><Badge variant="success"><Users className="mr-1 inline h-3 w-3" />{users.data?.length ?? 0} accounts</Badge></header><Card title="System users" description="Role assignment and account changes are restricted to administrators."><div className="divide-y divide-medical-100">{users.data?.map((user) => <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" key={user.id}><div><p className="text-[13px] font-semibold text-medical-900">{user.displayName}</p><p className="mt-1 text-[11px] text-medical-500">{user.email}</p></div><div className="flex items-center gap-2"><Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>{user.roles.map((role) => <span className="flex items-center gap-1 text-[11px] text-medical-600" key={role.role.name}><ShieldCheck className="h-3.5 w-3.5" />{role.role.name}</span>)}</div></div>)}</div></Card></div>;
}
