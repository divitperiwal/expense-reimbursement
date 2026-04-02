import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { claimActionTypeEnum } from "./enums.schema.js";
import { expenseClaims } from "./expense-claims.schema.js";
import { users } from "./user.schema.js";

export const claimActions = pgTable(
    "claim_actions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        claimId: uuid("claim_id").notNull().references(() => expenseClaims.id),
        actorId: uuid("actor_id").notNull().references(() => users.id),
        action: claimActionTypeEnum("action").notNull(),
        note: text("note"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    })