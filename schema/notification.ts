import { NotificationType } from "@/generated/prisma";
import z from "zod";

export const notificationSchema = z.object({
    type: z.enum(NotificationType),
    message: z.string(),
    userId: z.string()
});

export type Notification = z.infer<typeof notificationSchema>;