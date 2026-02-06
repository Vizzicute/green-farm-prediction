import { prisma } from "@/lib/prisma";

export async function getBlogCategories() {
  // await requireAdmin();

    const data = await prisma.blogCategory.findMany({
      include: { blogs: true }
  });

  return data;
}

export async function getBlogCategory(id: string) {
  const data = await prisma.blogCategory.findUnique({
    where: { id },
    include: { blogs: true },
  });

  return data;
}

export async function getBlogCategoryBySlug(slug: string) {
  const data = await prisma.blogCategory.findUnique({
    where: { slug },
    include: {
      blogs: {
        where: { status: "PUBLISHED" }
      }
    },
  })

  return data;
};