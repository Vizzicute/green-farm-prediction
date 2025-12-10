import { BlogStatus } from "@/generated/prisma";
import z from "zod";

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  status: z.enum(BlogStatus),
  featuredImage: z.string(),
  authorId: z.string(),
  categoriesId: z.array(z.string()),
  publishedAt: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date/time format.",
  }),
});

export type blogSchemaType = z.infer<typeof blogSchema>;

export const blogCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string()
});

export type blogCategorySchemaType = z.infer<typeof blogCategorySchema>;