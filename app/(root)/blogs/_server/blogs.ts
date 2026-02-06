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
  // await requireAdmin();

  const where = buildBlogsWhere(filter);

  const data = await prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
    where,
    take: pageSize,
      skip: (page - 1) * pageSize,
    include: { comments: true, categories: true }
  });

  return data;
}

export async function getBlogPostsCount(filter: {
  search?: string;
  status?: string;
  customStartDate?: string;
  customEndDate?: string;
}) {
  // await requireAdmin();

  const where = buildBlogsWhere(filter);

  const count = await prisma.blog.count({
    where,
  });

  return count;
}

export async function getBlogPost(id: string) {
  // await requireAdmin();

  const data = await prisma.blog.findUnique({
    where: { id },
    include: { categories: true },
  });

  return data;
}
