import { ApiError } from "@/utils/constants/api-error.js";
import { DashboardDatabase } from "./dashboard.database.js";
import type { ClaimStatus, Role } from "@/types/common.js";

export const DashboardService = {
    getSummary: async (userId: string, role: Role) => {
        const employeeId = role === 'employee' ? userId : undefined;
        const claims = await DashboardDatabase.getSummaryClaims(employeeId);

        const toNumber = (value: string | null) => Number(value ?? 0);

        let pendingApproval = 0;
        let approvedAmount = 0;
        let disbursedAmount = 0;
        let rejectedCount = 0;
        let totalAmount = 0;

        for (const claim of claims) {
            const amount = toNumber(claim.amount);
            totalAmount += amount;

            if (claim.status === 'submitted') pendingApproval += 1;
            if (claim.status === 'approved') approvedAmount += amount;
            if (claim.status === 'disbursed') disbursedAmount += amount;
            if (claim.status === 'rejected') rejectedCount += 1;
        }

        return {
            totalClaims: claims.length,
            pendingApproval,
            approvedAmount: approvedAmount.toFixed(2),
            disbursedAmount: disbursedAmount.toFixed(2),
            rejectedCount,
            totalAmount: totalAmount.toFixed(2),
        };
    },

    getCategories: async (userId: string, role: Role) => {
        const employeeId = role === 'employee' ? userId : undefined;
        const claims = await DashboardDatabase.getCategoryClaims(employeeId);

        const grouped = new Map<string, { category: string; totalAmount: number; claimCount: number }>();

        for (const claim of claims) {
            const existing = grouped.get(claim.category);
            const amount = Number(claim.amount ?? 0);

            if (existing) {
                existing.totalAmount += amount;
                existing.claimCount += 1;
                continue;
            }

            grouped.set(claim.category, {
                category: claim.category,
                totalAmount: amount,
                claimCount: 1,
            });
        }

        const categories = Array.from(grouped.values())
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .map((item) => ({
                category: item.category,
                totalAmount: item.totalAmount.toFixed(2),
                claimCount: item.claimCount,
            }));

        return categories.map(cat => ({
            category: cat.category,
            totalAmount: cat.totalAmount,
            claimCount: cat.claimCount,
        }));
    },

    getTrends: async (userId: string, role: Role) => {
        const employeeId = role === 'employee' ? userId : undefined;
        const claims = await DashboardDatabase.getTrendClaims(employeeId);

        const monthKey = (date: Date) => {
            const year = date.getUTCFullYear();
            const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
            return `${year}-${month}`;
        };

        const months: string[] = [];
        const start = new Date();
        start.setUTCDate(1);
        start.setUTCHours(0, 0, 0, 0);

        for (let i = 5; i >= 0; i -= 1) {
            const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - i, 1));
            months.push(monthKey(d));
        }

        const trendMap = new Map<string, { month: string; submitted: number; approved: number; disbursed: number; totalAmount: number }>();
        for (const month of months) {
            trendMap.set(month, { month, submitted: 0, approved: 0, disbursed: 0, totalAmount: 0 });
        }

        for (const claim of claims) {
            const key = monthKey(claim.createdAt as Date);
            const bucket = trendMap.get(key);
            if (!bucket) continue;

            const amount = Number(claim.amount ?? 0);
            bucket.totalAmount += amount;

            if (['submitted', 'approved', 'disbursed', 'rejected'].includes(claim.status)) {
                bucket.submitted += 1;
            }

            if (['approved', 'disbursed', 'rejected'].includes(claim.status)) {
                bucket.approved += 1;
            }

            if (claim.status === 'disbursed') {
                bucket.disbursed += 1;
            }
        }

        const trends = months.map((month) => {
            const item = trendMap.get(month)!;
            return {
                month: item.month,
                submitted: item.submitted,
                approved: item.approved,
                disbursed: item.disbursed,
                totalAmount: item.totalAmount.toFixed(2),
            };
        });

        return trends.map(trend => ({
            month: trend.month,
            submitted: trend.submitted,
            approved: trend.approved,
            disbursed: trend.disbursed,
            totalAmount: trend.totalAmount,
        }));
    },

    getPending: async (userId: string, role: Role, page: number | undefined) => {
        if (role === 'employee') throw new ApiError('Not applicable for employee role', 403);


        if (!page || page < 1) page = 1;
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        let statuses: ClaimStatus[] = [];
        if (role === 'manager') {
            statuses = ['submitted'];
        } else if (role === 'finance') {
            statuses = ['approved'];
        } else if (role === 'admin') {
            statuses = ['submitted', 'approved'];
        }

        const { claims, total } = await DashboardDatabase.getPendingClaims(
            statuses,
            offset,
            pageSize
        );

        return {
            claims: claims.map(claim => ({
                id: claim.id,
                employeeName: claim.employeeName,
                amount: claim.amount,
                category: claim.category,
                status: claim.status,
                createdAt: claim.createdAt,
            })),
            meta: {
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
                total,
            },
        };
    },
}