import { prisma } from "@/lib/prisma";
import { buildBlogsWhere } from "@/utils/where-filter";

export async function getAllBlogs() {
  const data = await prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
    where: { status: "PUBLISHED" },
  });
  return data;
}

export async function getAllBlogCategories() {
  const data = await prisma.blogCategory.findMany();
  return data;
}
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
    include: { comments: true, categories: true },
  });

  return data;
}

export async function getBlogPost(id: string) {
  const data = await prisma.blog.findUnique({
    where: { id },
    include: { categories: true, comments: true },
  });

  return data;
}

export async function getBlogPostBySlug(slug: string) {
 try {
   return await prisma.blog.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          blogs: {
            where: { status: "PUBLISHED"}
          }
        }
      },
      comments: {
        where: { status: "APPROVED" },
        include: { user: true },
      },
    },
  });
 } catch (error) {
   console.error(error);
   throw new Error();
 }
}
