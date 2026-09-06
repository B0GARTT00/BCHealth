export const roleNames = [
  'ADMINISTRATOR',
  'CLINIC_NURSE',
  'DOCTOR',
  'CLINIC_STAFF',
  'STUDENT',
  'FACULTY_STAFF',
] as const;

export const defaultPermissions = [
  'users.manage',
  'roles.manage',
  'patients.read',
  'patients.manage',
  'clinical.read',
  'clinical.manage',
  'appointments.manage',
  'requirements.manage',
  'clearances.manage',
  'inventory.manage',
  'reports.read',
  'audit.read',
  'own_profile.read',
] as const;
