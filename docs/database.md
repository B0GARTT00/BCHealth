# Database

The database is designed for MySQL through Prisma. The initial schema includes identity, RBAC, patients, academic terms, health records, visits, consultations, appointments, requirements, clearances, vaccinations, screenings, inventory, emergencies, certificates, private documents, notifications, announcements, audit logs, and archive status.

Important design choices:

- Patients are not assumed to be students. A `Patient` may have a student or employee profile.
- Clinical records are historical and should not be overwritten.
- Soft deletion is present where appropriate.
- Search fields and reporting fields have targeted indexes.
- Refresh tokens are stored as hashes.
- Documents are private by default and referenced by storage keys, not public URLs.

Run migrations with:

```bash
npm run prisma:migrate
```
