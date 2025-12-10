import { prisma } from "@/lib/prisma";
import { SubscriptionType } from "@/schema/subscription";
import { MutationResponse } from "@/types";

export async function getUserSubscriptions(userId: string
) {
  const data = await prisma.subscription.findMany({
    where: { userId }
  });

  return data;
}

export async function getSubscriptionCategory(id: string) {

  const data = await prisma.subscriptionCategory.findUnique({
    where: { id }
  });

  if (!data) throw new Error();

  return data;
}

export async function getSubscriptionCategories() {

  const data = await prisma.subscriptionCategory.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!data) throw new Error();

  return data;
}

export async function upsertSubscription(data: SubscriptionType): Promise<MutationResponse> {
  try {
    await prisma.subscription.upsert({
      where: {
        userId_subscriptionCategoryId: {
          userId: data.userId,
          subscriptionCategoryId: data.subscriptionCategoryId,
        },
      },
      create: { ...data },
      update: { ...data },
    });
    return {
      status: 200,
      message: "Subscription Actived!"
    }
  } catch {
    return {
      status: 500,
      message: "Something went wrong"
    }
  }
}