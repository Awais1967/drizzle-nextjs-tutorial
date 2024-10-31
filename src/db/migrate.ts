import config from "$/dizzle.config"
import {drizzle} from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import env from "@/lib/env"

const pool = new Pool({
    connectionString: env.DATABASE_URL 
})

export const db = drizzle(pool)
async function main() {
    if(config.out) {
        await migrate(db, {migrationsFolder: config.out})
        console.log("Migration complete")
    }
}
main()
 .catch((e) => {
     console.error(e);
     process.exit(1);
 })
 .finally(async () => {
    await pool.end();
 });