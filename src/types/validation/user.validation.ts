import z from "zod";

export const getUserSchema = z.object({
    page: z.coerce.number().min(1).default(1),
})

export const updateStatusSchema = z.object({
    status: z.enum(['active', 'inactive'])
})

export const updateRoleSchema = z.object({
    role: z.enum(['employee', 'manager', 'finance', 'admin'])
})