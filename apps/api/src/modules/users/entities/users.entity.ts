export class UserEntity {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  patientId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
