import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@shared/schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set - database operations will fail');
}

export const db = DATABASE_URL ? drizzle(DATABASE_URL, { schema }) : null as any;
