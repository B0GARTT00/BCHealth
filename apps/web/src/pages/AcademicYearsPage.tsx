import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarRange, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { createAcademicYear, getAcademicYears } from '../services/api';

export function AcademicYearsPage() {
  const queryClient = useQueryClient();
  const years = useQuery({ queryKey: ['academic-years'], queryFn: getAcademicYears });
  const [form, setForm] = useState({ label: '', startsAt: '', endsAt: '' });
  const create = useMutation({ mutationFn: () => createAcademicYear({ ...form, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() }), onSuccess: () => { setForm({ label: '', startsAt: '', endsAt: '' }); void queryClient.invalidateQueries({ queryKey: ['academic-years'] }); } });
  if (years.isLoading) return <LoadingState label="Loading academic years..." />;
  if (years.isError) return <ErrorState message="Unable to load academic years." />;
  return <div className="space-y-6"><header><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Administration</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Academic years</h1><p className="mt-1 text-[13px] text-medical-500">Manage school-year and semester boundaries for records and requirements.</p></header><Card title="Add academic year" description="Academic-year changes are restricted to administrators."><form className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}><label><span className="field-label">Label</span><input required value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="field-input" placeholder="2027-2028" /></label><label><span className="field-label">Starts</span><input required type="date" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="field-input" /></label><label><span className="field-label">Ends</span><input required type="date" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className="field-input" /></label><Button disabled={create.isPending}><Plus className="h-4 w-4" />Add year</Button></form></Card><Card title="Academic-year history" description="Linked semesters, requirements, and clearances.">{years.data?.length ? <div className="divide-y divide-medical-100">{years.data.map((year) => <div className="px-5 py-4" key={year.id}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><CalendarRange className="h-4 w-4 text-brokenshire-600" /><p className="text-[13px] font-semibold text-medical-900">{year.label}</p></div><Badge variant={year.isActive ? 'success' : 'neutral'}>{year.isActive ? 'Active' : 'Archived'}</Badge></div><p className="mt-2 text-[11px] text-medical-500">{year.semesters.length} semesters · {year._count.requirements} requirements · {year._count.clearances} clearances</p></div>)}</div> : <p className="p-5 text-[13px] text-medical-500">No academic years configured.</p>}</Card></div>;
}
