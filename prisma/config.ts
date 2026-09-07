import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: false,
  seed: {
    run: async (prisma) => {
      await import('../prisma/seed.ts');
    },
  },
});