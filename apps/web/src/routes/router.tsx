import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { ClinicVisitsPage } from '../pages/ClinicVisitsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { RequirementsPage } from '../pages/RequirementsPage';
import { ClearancesPage } from '../pages/ClearancesPage';
import { VaccinationHistoryPage } from '../pages/VaccinationHistoryPage';
import { ScreeningsPage } from '../pages/ScreeningsPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CertificatesPage } from '../pages/CertificatesPage';
import { EmergenciesPage } from '../pages/EmergenciesPage';
import { DispensingPage } from '../pages/DispensingPage';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AcademicYearsPage } from '../pages/AcademicYearsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { AdminRolesPage } from '../pages/AdminRolesPage';
import { LoginPage } from '../pages/LoginPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { PatientsPage } from '../pages/PatientsPage';
import { PatientProfilePage } from '../pages/PatientProfilePage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/patients', element: <PatientsPage /> },
          { path: '/patients/:id', element: <PatientProfilePage /> },
          { path: '/clinic/visits', element: <ClinicVisitsPage /> },
          { path: '/clinic/visits/new', element: <PlaceholderPage title="New Clinic Visit" /> },
          { path: '/appointments', element: <AppointmentsPage /> },
          { path: '/requirements', element: <RequirementsPage /> },
          { path: '/requirements/submissions', element: <PlaceholderPage title="Requirement Submissions" /> },
          { path: '/clearances', element: <ClearancesPage /> },
          { path: '/inventory', element: <PlaceholderPage title="Inventory" /> },
          { path: '/inventory/medicines', element: <InventoryPage /> },
          { path: '/inventory/transactions', element: <PlaceholderPage title="Inventory Transactions" /> },
          { path: '/inventory/dispensing', element: <DispensingPage /> },
          { path: '/emergencies', element: <EmergenciesPage /> },
          { path: '/certificates', element: <CertificatesPage /> },
          { path: '/vaccinations', element: <VaccinationHistoryPage /> },
          { path: '/screenings', element: <ScreeningsPage /> },
          { path: '/reports', element: <Navigate to="/dashboard" replace /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/announcements', element: <AnnouncementsPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/roles', element: <AdminRolesPage /> },
          { path: '/admin/academic-years', element: <AcademicYearsPage /> },
          { path: '/admin/audit-logs', element: <AuditLogsPage /> },
          { path: '/admin/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
