import { SubDuration } from "@/generated/prisma";
import z from "zod";

export const subscriptionCategorySchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Title is required"),
    minOdds: z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() !== "" ? Number(val) : val,
      z.number().gt(1, { message: "minimum should be greater than 1.00" })
    ),
    maxOdds: z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() !== "" ? Number(val) : val,
      z.number()
    ),
    uniqueColor: z.string().min(7, "Color must be Hex code").max(7).optional(),
  })

export type SubscriptionCategoryType = z.infer<
  typeof subscriptionCategorySchema
>;

export const subscriptionSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "User is required"),
  subscriptionCategoryId: z.string().min(1, "Choose Subscription Category"),
  duration: z.enum(SubDuration),
});

export type SubscriptionType = z.infer<typeof subscriptionSchema>;
