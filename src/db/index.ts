import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool} from 'pg';
import * as schema from './schema';
import env from "@/lib/env"
import { eq } from 'drizzle-orm';
import { post } from './schema';
// const db = drizzle(process.env.DATABASE_URL!);

const pool = new Pool({
    connectionString: env.DATABASE_URL 
})

export const db = drizzle(pool, {
    schema, logger: true
});
export type DB = typeof db


