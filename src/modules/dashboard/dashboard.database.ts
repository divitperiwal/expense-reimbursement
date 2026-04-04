import db from "@/config/drizzle.config.js";
import { expenseClaims } from "@/database/schema/expense-claims.schema.js";
import { users } from "@/database/schema/user.schema.js";
import type { ClaimStatus } from "@/types/common.js";
import { and, count, desc, eq, gte, inArray, isNull } from "drizzle-orm";

export const DashboardDatabase = {
    getSummaryClaims: async (employeeId?: string) => {
        const whereCondition = employeeId
            ? and(eq(expenseClaims.employeeId, employeeId), isNull(expenseClaims.deletedAt))
            : isNull(expenseClaims.deletedAt);

        const claims = await db.select({
            status: expenseClaims.status,
            amount: expenseClaims.amount,
        })
            .from(expenseClaims)
            .where(whereCondition);

        return claims;
    },

    getCategoryClaims: async (employeeId?: string) => {
        const whereCondition = employeeId
            ? and(eq(expenseClaims.employeeId, employeeId), isNull(expenseClaims.deletedAt))
            : isNull(expenseClaims.deletedAt);

        const claims = await db.select({
            category: expenseClaims.category,
            amount: expenseClaims.amount,
        })
            .from(expenseClaims)
            .where(whereCondition);

        return claims;
    },

    getTrendClaims: async (employeeId?: string) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const whereCondition = employeeId
            ? and(
                eq(expenseClaims.employeeId, employeeId),
                isNull(expenseClaims.deletedAt),
                gte(expenseClaims.createdAt, sixMonthsAgo)
            )
            : and(
                isNull(expenseClaims.deletedAt),
                gte(expenseClaims.createdAt, sixMonthsAgo)
            );

        const claims = await db.select({
            createdAt: expenseClaims.createdAt,
            status: expenseClaims.status,
            amount: expenseClaims.amount,
        })
            .from(expenseClaims)
            .where(whereCondition)
            .orderBy(desc(expenseClaims.createdAt));

        return claims;
    },

    getPendingClaims: async (statuses: ClaimStatus[], offset: number, pageSize: number) => {
        if (statuses.length === 0) {
            return { claims: [], total: 0 };
        }

        const [claims, [{ count: total }]] = await Promise.all([
            db.select({
                id: expenseClaims.id,
                employeeName: users.name,
                amount: expenseClaims.amount,
                category: expenseClaims.category,
                status: expenseClaims.status,
                createdAt: expenseClaims.createdAt,
            })
                .from(expenseClaims)
                .innerJoin(users, eq(expenseClaims.employeeId, users.id))
                .where(
                    and(
                        inArray(expenseClaims.status, statuses),
                        isNull(expenseClaims.deletedAt)
                    )
                )
                .orderBy(desc(expenseClaims.createdAt))
                .limit(pageSize)
                .offset(offset),
            db.select({
                count: count(),
            })
                .from(expenseClaims)
                .where(
                    and(
                        inArray(expenseClaims.status, statuses),
                        isNull(expenseClaims.deletedAt)
                    )
                ),
        ]);

        return { claims, total };
    },
};
