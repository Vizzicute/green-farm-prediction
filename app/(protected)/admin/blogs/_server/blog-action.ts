import { BlogStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { blogSchemaType } from "@/schema/blog";
import { MutationResponse } from "@/types";
import { buildBlogsWhere } from "@/utils/where-filter";

export async function adminCreateBlog(
  data: blogSchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: data.featuredImage,
        authorId: data.authorId,
        status: data.status,
        publishedAt: new Date(data.publishedAt),
        categories: {
          connect: data.categoriesId.map((id) => ({ id })),
        },
      },
    });
    return {
      status: 200,
      message: "Blog Post Added",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function adminUpdateBlog(
  data: blogSchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blog.update({
      where: { id: data.id! },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: data.featuredImage,
        authorId: data.authorId,
        status: data.status,
        publishedAt: new Date(data.publishedAt),
        categories: {
          connect: data.categoriesId.map((id) => ({ id })),
        },
      },
    });
    return {
      status: 200,
      message: "Blog Post Updated",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function adminUpdateBlogStatus(
  id: string,
  status: BlogStatus
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blog.update({
      where: { id },
      data: { status },
    });
    return {
      status: 200,
      message: "Status Updated",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function adminGetBlogPosts(
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
  });

  return data;
}

export async function adminGetBlogPostsCount(filter: {
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

export async function adminGetBlogPost(id: string) {
  // await requireAdmin();

  const data = await prisma.blog.findUnique({
    where: { id },
    include: { categories: true },
  });

  return data;
}

export async function adminDeleteBlogPost(
  id: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blog.delete({ where: { id } });
    return {
      status: 200,
      message: "Blog Post Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}
