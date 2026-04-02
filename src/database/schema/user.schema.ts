import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum } from "./enums.schema.js";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: userRoleEnum("role").notNull().default("employee"),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});