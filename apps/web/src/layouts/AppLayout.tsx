import { Bell, CalendarDays, ClipboardList, FileText, LayoutDashboard, Package, Users } from 'lucide-react';
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
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xl font-semibold">BCHealth</p>
          <p className="text-sm text-slate-500">Clinic Records System</p>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
          <div>
            <p className="text-sm text-slate-500">Private higher-education clinic</p>
            <h1 className="text-lg font-semibold">Health information management</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-right text-sm sm:block">
              <span className="block font-medium">{auth.user?.displayName}</span>
              <span className="text-slate-500">{auth.user?.roles.join(', ')}</span>
            </p>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <button onClick={() => auth.logout()} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
