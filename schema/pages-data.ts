import z from "zod";

export const pageDataSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string(),
  description: z.string().min(1, "Description is required"),
  h1tag: z.string(),
  content: z.string(),
});

export type pageDataType = z.infer<
  typeof pageDataSchema
>;