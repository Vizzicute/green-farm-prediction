import { prisma } from "@/lib/prisma";
import { MutationResponse } from "@/types";

export async function adminUpdateSettings(
  id: string,
  value: string
): Promise<MutationResponse> {
  // await requireAdmin();
  try {
    await prisma.settings.update({
      where: { id },
      data: { value },
    });

    return {
      status: 200,
      message: "Settings updated successfully.",
    };
  } catch {
    return {
      status: 500,
      message: "Something went wrong while updating settings.",
    };
  }
}

export async function adminGetSettingsByCategory(category: string) {
  // await requireAdmin();
  const data = await prisma.settings.findFirst({
    where: { category },
  });
  return data;
}
