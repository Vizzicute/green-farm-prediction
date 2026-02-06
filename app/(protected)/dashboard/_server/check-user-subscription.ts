import { auth } from "@/lib/better-auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkUserSubscription() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        redirect("/login");
    }

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.user.id },
    });

    if (!subscriptions || subscriptions.length === 0) {
        return null;
    }

    const currentDate = new Date();
    const updatedSubscriptions = await Promise.all(subscriptions.map(async (subscription) => {
        const referenceDate = subscription.renewedAt || subscription.createdAt;
        let expirationDate = new Date(
            referenceDate.getTime() + Number(subscription.duration.split("D")[1]) * 24 * 60 * 60 * 1000
        );

        if (subscription.freezeStart && subscription.freezeEnd) {
            const freezeDuration = subscription.freezeEnd.getTime() - subscription.freezeStart.getTime();
            expirationDate = new Date(expirationDate.getTime() + freezeDuration);
        }

        const isExpired = currentDate > expirationDate;

        if (subscription.isFreezed) return subscription;

        if (isExpired && subscription.isActive) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: { isActive: false },
            });

            return { ...subscription, isActive: false };
        }

        return subscription;
    }));

    return updatedSubscriptions;
}