import { SubDuration } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { MutationResponse } from "@/types";
import { buildSubscriptionsWhere } from "@/utils/where-filter";

// SubscriptionCategory
export async function adminGetSubscriptionCategory(id: string) {
  // await requireAdmin();

  const data = await prisma.subscriptionCategory.findUnique({
    where: { id },
  });

  if (!data) throw new Error();

  return data;
}

export async function adminGetSubscriptionCategories() {
  // await requireAdmin();

  const data = await prisma.subscriptionCategory.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!data) throw new Error();

  return data;
}

export type adminGetSubscriptionCategoriesType = Awaited<
  ReturnType<typeof adminGetSubscriptionCategories>
>[0];

export async function adminCreateSubscriptionCategory(
  name: string,
  minOdds: number,
  maxOdds: number,
  uniqueColor: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscriptionCategory.create({
      data: {
        name,
        minOdds,
        maxOdds,
        uniqueColor,
      },
    });

    return {
      status: 200,
      message: "Subscription Category Created",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminUpdateSubscriptionCategory(
  id: string,
  name: string,
  minOdds: number,
  maxOdds: number,
  uniqueColor: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscriptionCategory.update({
      where: {
        id,
      },
      data: {
        name,
        minOdds,
        maxOdds,
        uniqueColor,
      },
    });

    return {
      status: 200,
      message: "Subscription Category Updated",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminDeleteSubscriptionCategory(
  id: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscriptionCategory.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "Subscription Category Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

//Subscriptions
export async function adminGetSubscriptions(
  filters: {
    search?: string;
    isActive?: boolean;
    isFreezed?: boolean;
    category?: string;
    customStartDate?: string;
    customEndDate?: string;
  },
  currentPage: number,
  pageSize: number
) {
  // await requireAdmin();

  const where = buildSubscriptionsWhere(filters);

  const data = await prisma.subscription.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: { User: true, SubscriptionCategory: true },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
  });

  return data;
}

export type adminGetSubscriptionsType = Awaited<
  ReturnType<typeof adminGetSubscriptions>
>[0];

export async function adminGetSubscriptionsCount(filters: {
  search?: string;
  isActive?: boolean;
  isFreezed?: boolean;
  category?: string;
  customStartDate?: string;
  customEndDate?: string;
}) {
  // await requireAdmin();

  const where = buildSubscriptionsWhere(filters);

  const count = await prisma.subscription.count({
    where,
  });

  return count;
}

export async function adminUpdateSubscription(
  id: string,
  userId: string,
  duration: SubDuration,
  subscriptionCategoryId: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscription.update({
      where: {
        id,
      },
      data: {
        duration,
        subscriptionCategoryId,
        userId,
      },
    });

    return {
      status: 200,
      message: "Subscription Updated",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminUpdateSubscriptionFreezeStatus(
  id: string,
  isFreezed: boolean
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscription.update({
      where: {
        id,
      },
      data: {
        isFreezed,
      },
    });

    return {
      status: 200,
      message: isFreezed ? "Subscription Freezed" : "Subscription Unfreezed",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminCreateSubscription(
  userId: string,
  duration: SubDuration,
  subscriptionCategoryId: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscription.create({
      data: {
        userId,
        duration,
        subscriptionCategoryId,
      },
    });

    return {
      status: 200,
      message: "Subscription Created",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminDeleteSubscription(
  id: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.subscription.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "Subscription Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
