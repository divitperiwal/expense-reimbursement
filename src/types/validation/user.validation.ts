import z from "zod";

export const getUserSchema = z.object({
    page: z.coerce.number().min(1).default(1),
})

export const updateUserSchema = z.object({
    role: z.enum(['employee', 'manager', 'finance', 'admin']),
    status: z.enum(['active', 'inactive'])
})