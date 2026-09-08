import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ErrorState, LoadingState } from '../components/ui/States';
import { getNotifications, markNotificationRead } from '../services/api';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const notifications = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });
  const read = useMutation({ mutationFn: (id: string) => markNotificationRead(id), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }) });
  if (notifications.isLoading) return <LoadingState label="Loading notifications..." />;
  if (notifications.isError) return <ErrorState message="Unable to load notifications." />;
  return <div className="space-y-6"><header><p className="text-[11px] font-semibold uppercase tracking-widest text-brokenshire-600">Communication</p><h1 className="mt-1 text-[26px] font-semibold tracking-tight text-medical-900">Notifications</h1><p className="mt-1 text-[13px] text-medical-500">Review requirement, appointment, and system updates.</p></header><Card title="Notification center" description="Unread notifications are highlighted.">{notifications.data?.length ? <div className="divide-y divide-medical-100">{notifications.data.map((notification) => <div className={`flex items-start justify-between gap-3 px-5 py-4 ${notification.isRead ? '' : 'bg-brokenshire-50/40'}`} key={notification.id}><div className="flex gap-3"><Bell className="mt-0.5 h-4 w-4 text-brokenshire-600" /><div><p className="text-[13px] font-semibold text-medical-900">{notification.title}</p><p className="mt-1 text-[12px] text-medical-600">{notification.body}</p><p className="mt-1 text-[10px] text-medical-400">{new Date(notification.createdAt).toLocaleString()}</p></div></div>{notification.isRead ? <Badge variant="neutral">Read</Badge> : <Button variant="secondary" onClick={() => read.mutate(notification.id)}><Check className="h-4 w-4" />Mark read</Button>}</div>)}</div> : <p className="p-5 text-[13px] text-medical-500">You have no notifications.</p>}</Card></div>;
}
