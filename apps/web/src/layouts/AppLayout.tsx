import { Bell, CalendarDays, ClipboardList, FileText, LayoutDashboard, LogOut, Package, Search, ShieldCheck, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/clinic/visits', label: 'Clinic Visits', icon: ClipboardList },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/reports', label: 'Reports', icon: FileText },
];

export function AppLayout() {
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-clinic-surface text-clinic-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-[280px] bg-[var(--color-sidebar-bg)] text-slate-300 md:block">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-7">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brokenshire-600 text-sm font-bold text-white">B</div>
          <div>
            <p className="font-semibold tracking-tight text-white">BCHealth</p>
            <p className="text-[11px] text-slate-500">Davao University Clinic</p>
          </div>
        </div>
        <nav className="space-y-1 px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Workspace</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-white text-slate-950 shadow-sm before:absolute before:left-0 before:h-5 before:w-0.5 before:rounded-full before:bg-brokenshire-600' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Protected workspace</div>
          <p className="mt-1 pl-5 text-[10px] text-slate-600">Audit logging enabled</p>
        </div>
      </aside>

      <div className="md:pl-[280px]">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span>Clinic</span><span className="text-slate-300">/</span><span className="font-medium text-slate-900">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden h-8 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-[11px] text-slate-500 hover:bg-slate-50 sm:flex" aria-label="Search patients">
              <Search className="h-3.5 w-3.5" /> Search <kbd className="rounded border border-slate-200 bg-slate-50 px-1 text-[10px]">⌘K</kbd>
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell className="h-4 w-4" /></button>
            <div className="ml-1 hidden border-l border-slate-200 pl-3 sm:block"><p className="text-[12px] font-medium">{auth.user?.displayName}</p><p className="text-[10px] text-slate-500">{auth.user?.roles.join(', ')}</p></div>
            <button onClick={() => auth.logout()} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <main className="mx-auto max-w-[1280px] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
