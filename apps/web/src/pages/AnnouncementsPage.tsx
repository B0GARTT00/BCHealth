import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone, Send } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { createAnnouncement, getAnnouncements, publishAnnouncement } from '../services/api';

export function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const announcements = useQuery({ queryKey: ['announcements'], queryFn: getAnnouncements });
  const [form, setForm] = useState({ title: '', body: '', audience: 'ALL' });
  const create = useMutation({ mutationFn: () => createAnnouncement(form), onSuccess: () => { setForm({ title: '', body: '', audience: 'ALL' }); void queryClient.invalidateQueries({ queryKey: ['announcements'] }); } });
  const publish = useMutation({ mutationFn: (id: string) => publishAnnouncement(id), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['announcements'] }) });
  if (announcements.isLoading) return <LoadingState label="Loading announcements..." />;
  if (announcements.isError) return <ErrorState message="Unable to load announcements." />;
  return <div className="space-y-6"><header><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Communication</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Announcements</h1><p className="mt-1 text-[13px] text-medical-500">Publish clinic schedules, reminders, and health updates.</p></header><Card title="Create announcement" description="Announcements are visible to the selected audience after publishing."><form className="space-y-3 p-5" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}><label><span className="field-label">Title</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="field-input" /></label><label><span className="field-label">Message</span><textarea required value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="field-input min-h-24" /></label><div className="flex items-end gap-3"><label className="w-52"><span className="field-label">Audience</span><select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} className="field-input"><option>ALL</option><option>STUDENT</option><option>FACULTY_STAFF</option><option>CLINIC_STAFF</option></select></label><Button disabled={create.isPending}><Megaphone className="h-4 w-4" />Save draft</Button></div></form></Card><Card title="Announcement history" description="Draft and published clinic communications.">{announcements.data?.length ? <div className="divide-y divide-medical-100">{announcements.data.map((announcement) => <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" key={announcement.id}><div><p className="text-[13px] font-semibold text-medical-900">{announcement.title}</p><p className="mt-1 text-[12px] text-medical-600">{announcement.body}</p><p className="mt-1 text-[11px] text-medical-400">Audience: {announcement.audience}</p></div><div className="flex items-center gap-2"><Badge variant={announcement.publishedAt ? 'success' : 'warning'}>{announcement.publishedAt ? 'Published' : 'Draft'}</Badge>{!announcement.publishedAt && <Button variant="secondary" onClick={() => publish.mutate(announcement.id)}><Send className="h-4 w-4" />Publish</Button>}</div></div>)}</div> : <p className="p-5 text-[13px] text-medical-500">No announcements yet.</p>}</Card></div>;
}
