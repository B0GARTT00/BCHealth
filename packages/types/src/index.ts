export type UserRoleName =
  | 'ADMINISTRATOR'
  | 'CLINIC_NURSE'
  | 'DOCTOR'
  | 'CLINIC_STAFF'
  | 'STUDENT'
  | 'FACULTY_STAFF';

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface ApiHealth {
  status: 'ok';
  service: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRoleName[];
  patientId?: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
