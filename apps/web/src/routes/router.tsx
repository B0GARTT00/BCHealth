import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/patients', element: <PlaceholderPage title="Patients" /> },
          { path: '/patients/:id', element: <PlaceholderPage title="Patient Profile" /> },
          { path: '/clinic/visits', element: <PlaceholderPage title="Clinic Visits" /> },
          { path: '/clinic/visits/new', element: <PlaceholderPage title="New Clinic Visit" /> },
          { path: '/appointments', element: <PlaceholderPage title="Appointments" /> },
          { path: '/requirements', element: <PlaceholderPage title="Requirements" /> },
          { path: '/requirements/submissions', element: <PlaceholderPage title="Requirement Submissions" /> },
          { path: '/clearances', element: <PlaceholderPage title="Clearances" /> },
          { path: '/inventory', element: <PlaceholderPage title="Inventory" /> },
          { path: '/inventory/medicines', element: <PlaceholderPage title="Medicines" /> },
          { path: '/inventory/transactions', element: <PlaceholderPage title="Inventory Transactions" /> },
          { path: '/inventory/dispensing', element: <PlaceholderPage title="Medicine Dispensing" /> },
          { path: '/emergencies', element: <PlaceholderPage title="Emergencies" /> },
          { path: '/certificates', element: <PlaceholderPage title="Certificates" /> },
          { path: '/reports', element: <PlaceholderPage title="Reports" /> },
          { path: '/notifications', element: <PlaceholderPage title="Notifications" /> },
          { path: '/announcements', element: <PlaceholderPage title="Announcements" /> },
          { path: '/admin/users', element: <PlaceholderPage title="User Administration" /> },
          { path: '/admin/roles', element: <PlaceholderPage title="Roles" /> },
          { path: '/admin/academic-years', element: <PlaceholderPage title="Academic Years" /> },
          { path: '/admin/audit-logs', element: <PlaceholderPage title="Audit Logs" /> },
        ],
      },
    ],
  },
]);
