import { CommentType } from "@/generated/prisma";
import z from "zod";

export const commentSchema = z.object({
    blogId: z.string(),
    userId: z.string().optional(),
    guestName: z.string().optional(),
    guestEmail: z.string().optional(),
    type: z.enum(CommentType),
    content: z.string()
});

export type Comment = z.infer<typeof commentSchema>;