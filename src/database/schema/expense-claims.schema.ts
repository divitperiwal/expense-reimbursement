import { date, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema.js";
import { claimStatusEnum } from "./enums.schema.js";

export const expenseClaims = pgTable(
    "expense_claims",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        employeeId: uuid("employee_id").notNull().references(() => users.id),
        amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
        category: text("category").notNull(),
        date: date("date").notNull(),
        notes: text("notes"),
        status: claimStatusEnum("status").notNull().default("draft"),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    },

);
