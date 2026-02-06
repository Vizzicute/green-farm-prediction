import { prisma } from "@/lib/prisma";
import { User } from "@/schema/user";
import { MutationResponse } from "@/types";

export async function updateProfile(data: User): Promise<MutationResponse> {
    try {
        await prisma.user.update({
            where: { id: data.id },
            data,
        })

        return { status: 200, message: "Profile updated!"}
    } catch {
        return {
            status: 500,
            message: "Failed to update profile.",
        }
    }
}