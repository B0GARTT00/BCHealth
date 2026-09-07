import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ClinicVisitsModule } from './modules/clinic-visits/clinic-visits.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { HealthRequirementsModule } from './modules/health-requirements/health-requirements.module';
import { ClearancesModule } from './modules/clearances/clearances.module';
import { VaccinationsModule } from './modules/vaccinations/vaccinations.module';
import { ScreeningsModule } from './modules/screenings/screenings.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { DispensingModule } from './modules/dispensing/dispensing.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ArchiveModule } from './modules/archive/archive.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    ClinicVisitsModule,
    ConsultationsModule,
    AppointmentsModule,
    HealthRequirementsModule,
    ClearancesModule,
    VaccinationsModule,
    ScreeningsModule,
    CertificatesModule,
    InventoryModule,
    DispensingModule,
    EmergencyModule,
    ReportsModule,
    NotificationsModule,
    AnnouncementsModule,
    ArchiveModule,
    AuditModule,
  ],
  providers: [GlobalExceptionFilter, ResponseInterceptor],
})
export class AppModule {}
