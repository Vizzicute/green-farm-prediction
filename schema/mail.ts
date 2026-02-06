import z from "zod";

export const mailSchema = z.object({
  recipientType: z.enum([
    "single-user",
    "all-users",
    "all-subscribers",
    "non-subscribers",
    "with-subscription-type",
  ]),
  recipient: z.string().optional(),
  subscriptionId: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type MailSchemaType = z.infer<typeof mailSchema>;
