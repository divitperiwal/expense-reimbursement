import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from "@/database/schema/index.js";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";

const pool = new Pool({
    connectionString
})

const db = drizzle(pool, { schema })

export default db;