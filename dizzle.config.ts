import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import env from '@/lib/env';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL || env.AUTH_TRUST_HOST,
  },
  strict: true,
});