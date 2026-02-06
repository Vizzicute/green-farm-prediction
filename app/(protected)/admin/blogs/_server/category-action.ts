import { prisma } from "@/lib/prisma";
import { blogCategorySchemaType } from "@/schema/blog";
import { MutationResponse } from "@/types";

export async function adminCreateBlogCategory(
  data: blogCategorySchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blogCategory.create({
      data,
    });
    return {
      status: 200,
      message: "Blog Category Added",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function adminUpdateBlogCategory(
  data: blogCategorySchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blogCategory.update({
      where: { id: data.id! },
      data,
    });
    return {
      status: 200,
      message: "Blog Category Updated",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function adminGetBlogCategories() {
  // await requireAdmin();

  const data = await prisma.blogCategory.findMany();

  return data;
}

export async function adminGetBlogCategory(id: string) {
  const data = await prisma.blogCategory.findUnique({
    where: { id },
    include: { blogs: true },
  });

  return data;
}

export async function adminDeleteBlogCategory(
  id: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.blogCategory.delete({ where: { id } });
    return {
      status: 200,
      message: "Blog Category Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}
