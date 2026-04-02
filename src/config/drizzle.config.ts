import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@/database/schema/index.js";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";

const client = postgres(connectionString, {
    max: 10,
    ssl: "require",
    idle_timeout: 30,
    connect_timeout: 10
})

const db = drizzle(client, { schema })

export default db;