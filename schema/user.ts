import z from "zod";

export const userSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    image: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;