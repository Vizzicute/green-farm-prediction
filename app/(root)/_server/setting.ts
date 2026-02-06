import { prisma } from "@/lib/prisma";

export async function getSettingsByCategory(category: string) {
    const data = await prisma.settings.findFirst({
        where: { category }
    });
    return data;
}