import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rolePermissions: Record<string, string[]> = {
  ADMINISTRATOR: ['users.manage', 'roles.manage', 'reports.read', 'audit.read'],
  CLINIC_NURSE: [
    'patients.read',
    'patients.manage',
    'clinical.read',
    'clinical.manage',
    'appointments.manage',
    'requirements.manage',
    'clearances.manage',
    'inventory.manage',
    'reports.read',
  ],
  DOCTOR: ['patients.read', 'clinical.read', 'clinical.manage'],
  CLINIC_STAFF: ['patients.read', 'patients.manage', 'appointments.manage', 'requirements.manage', 'clearances.manage'],
  STUDENT: ['own_profile.read'],
  FACULTY_STAFF: ['own_profile.read'],
};

async function main() {
  const permissions = new Map<string, string>();
  for (const key of [...new Set(Object.values(rolePermissions).flat())]) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, description: key.replace('.', ' ') },
    });
    permissions.set(key, permission.id);
  }

  for (const [name, keys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: `${name} demo role` },
      create: { name, description: `${name} demo role` },
    });

    for (const key of keys) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permissions.get(key)! } },
        update: {},
        create: { roleId: role.id, permissionId: permissions.get(key)! },
      });
    }
  }

  const passwordHash = await bcrypt.hash('DemoPass123!', 12);
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMINISTRATOR' } });
  const nurseRole = await prisma.role.findUniqueOrThrow({ where: { name: 'CLINIC_NURSE' } });
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { name: 'STUDENT' } });

  const ay = await prisma.academicYear.upsert({
    where: { label: '2026-2027' },
    update: { isActive: true },
    create: {
      label: '2026-2027',
      startsAt: new Date('2026-08-01'),
      endsAt: new Date('2027-07-31'),
      isActive: true,
    },
  });

  const firstSemester = await prisma.semester.upsert({
    where: { academicYearId_term: { academicYearId: ay.id, term: 'FIRST' } },
    update: { isActive: true },
    create: {
      academicYearId: ay.id,
      term: 'FIRST',
      label: 'First Semester',
      startsAt: new Date('2026-08-01'),
      endsAt: new Date('2026-12-20'),
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin.demo@brokenshire.edu.ph' },
    update: { emailVerifiedAt: new Date() },
    create: {
      email: 'admin.demo@brokenshire.edu.ph',
      passwordHash,
      displayName: 'Demo Administrator',
      emailVerifiedAt: new Date(),
      roles: { create: { roleId: adminRole.id } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'nurse.demo@brokenshire.edu.ph' },
    update: { emailVerifiedAt: new Date() },
    create: {
      email: 'nurse.demo@brokenshire.edu.ph',
      passwordHash,
      displayName: 'Demo Clinic Nurse',
      emailVerifiedAt: new Date(),
      roles: { create: { roleId: nurseRole.id } },
    },
  });

  const patient = await prisma.patient.upsert({
    where: { patientNumber: 'STU-2026-0001' },
    update: {},
    create: {
      patientNumber: 'STU-2026-0001',
      type: 'STUDENT',
      firstName: 'Demo',
      lastName: 'Student',
      email: 'student.demo@brokenshire.edu.ph',
      birthDate: new Date('2006-05-12'),
      sex: 'FEMALE',
      studentProfile: { create: { studentId: '2026-0001', program: 'BS Information Technology', yearLevel: 1 } },
      emergencyContacts: { create: { name: 'Demo Guardian', relationship: 'Parent', phone: '+63 900 000 0000' } },
    },
  });

  const studentEmail = 'student.demo@brokenshire.edu.ph';
  const linkedStudentUser = await prisma.user.findUnique({ where: { patientId: patient.id } });
  const studentEmailUser = await prisma.user.findUnique({ where: { email: studentEmail } });
  if (linkedStudentUser && linkedStudentUser.email !== studentEmail) {
    if (studentEmailUser && studentEmailUser.id !== linkedStudentUser.id) {
      await prisma.user.update({ where: { id: studentEmailUser.id }, data: { patientId: null } });
    }
    await prisma.user.update({ where: { id: linkedStudentUser.id }, data: { email: studentEmail } });
  }

  await prisma.user.upsert({
    where: { email: studentEmail },
    update: { patientId: patient.id, passwordHash, displayName: 'Demo Student', emailVerifiedAt: new Date() },
    create: {
      email: studentEmail,
      passwordHash,
      displayName: 'Demo Student',
      emailVerifiedAt: new Date(),
      patientId: patient.id,
      roles: { create: { roleId: studentRole.id } },
    },
  });

  await prisma.healthRequirement.upsert({
    where: { id: 'demo-medical-requirement' },
    update: {},
    create: {
      id: 'demo-medical-requirement',
      name: 'Annual Medical Clearance Form',
      description: 'Demo requirement for incoming students.',
      applicableTo: 'STUDENT',
      academicYearId: ay.id,
      semesterId: firstSemester.id,
      deadline: new Date('2026-09-30'),
    },
  });

  const collegeRequirements = [
    ['college-ua', 'College Laboratory Result - Urinalysis (UA)', 'Submit a valid urinalysis result for College health clearance.'],
    ['college-cbc', 'College Laboratory Result - Complete Blood Count (CBC)', 'Submit a valid CBC result for College health clearance.'],
    ['college-se', 'College Laboratory Result - Stool Examination (S/E)', 'Submit a valid stool examination result for College health clearance.'],
    ['college-cxr', 'College Laboratory Result - Chest X-ray (CXR PA View)', 'Submit a valid chest X-ray result using the PA view for College health clearance.'],
    ['college-hbsag', 'College Laboratory Result - HBsAg', 'Submit a valid HBsAg result for College health clearance.'],
    ['college-anti-hbs', 'College Laboratory Result - Anti-HBs Quantitative', 'Submit a valid quantitative Anti-HBs result for College health clearance.'],
    ['college-other', 'College Health Requirement - Other Supporting Document', 'Submit another clinic-approved health document when requested by the College program.'],
  ] as const;

  for (const [id, name, description] of collegeRequirements) {
    await prisma.healthRequirement.upsert({
      where: { id },
      update: { name, description, applicableTo: 'COLLEGE', academicYearId: ay.id, semesterId: firstSemester.id },
      create: { id, name, description, applicableTo: 'COLLEGE', academicYearId: ay.id, semesterId: firstSemester.id },
    });
  }

  await prisma.medicine.createMany({
    data: [
      { name: 'Paracetamol', genericName: 'Acetaminophen', dosageForm: '500mg tablet', unit: 'tablet', reorderLevel: 100 },
      { name: 'Oral Rehydration Salts', dosageForm: 'sachet', unit: 'sachet', reorderLevel: 50 },
    ],
    skipDuplicates: true,
  });

  await prisma.announcement.create({
    data: {
      title: 'Demo Clinic Advisory',
      body: 'This is seed data for BCHealth demonstrations only.',
      audience: 'ALL',
      publishedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
