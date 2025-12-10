import { prisma } from "@/lib/prisma";
import { buildBlogsWhere } from "@/utils/where-filter";

export async function getBlogPosts(
  filter: {
    search?: string;
    status?: string;
    customStartDate?: string;
    customEndDate?: string;
  },
  pageSize: number,
  page: number
) {

  const where = buildBlogsWhere(filter);

  const data = await prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return data;
}

export async function getBlogPost(id: string) {
  const data = await prisma.blog.findUnique({
    where: { id },
    include: { categories: true },
  });

  return data;
}