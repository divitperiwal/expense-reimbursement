import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["employee", "manager", "finance", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);
export const claimStatusEnum = pgEnum("claim_status", ["draft", "submitted", "approved", "rejected", "disbursed"]);
export const claimActionTypeEnum = pgEnum("claim_action_type", ["created", "submitted", "approved", "rejected", "disbursed",]);

