import { prisma } from "@/lib/prisma";

export async function getPageDataBySlug(slug: string) {

  const data = await prisma.pageData.findUnique({
    where: { slug },
  });

  return data;
}