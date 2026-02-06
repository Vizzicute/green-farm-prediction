import { prisma } from "@/lib/prisma";
import { pageDataType } from "@/schema/pages-data";
import { MutationResponse } from "@/types";

export async function adminGetPagesData() {
  // await requireAdmin();

  const data = await prisma.pageData.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      updatedAt: true,
      title: true,
      slug: true,
    },
  });

  return data;
}

export async function adminGetPageData(id: string) {
  // await requireAdmin();

  const data = await prisma.pageData.findUnique({
    where: { id },
  });

  return data;
}

export async function adminUpdatePageData(
  data: pageDataType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.pageData.update({
      where: {
        id: data.id!,
      },
      data,
    });

    return {
      status: 200,
      message: "Page Data Updated!",
    };
  } catch (error) {
    return { status: 500, message: "Something went wrong" };
  }
}
