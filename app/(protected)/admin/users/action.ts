import { prisma } from "@/lib/prisma";
import { MutationResponse } from "@/types";
import { buildUsersWhere } from "@/utils/where-filter";

export async function adminGetUsers(
  filter: {
    search?: string;
    active?: boolean;
    role?: string;
    subscription?: boolean;
    customStartDate?: string;
    customEndDate?: string;
  },
  pageSize: number,
  page: number
) {
  // await requireAdmin();
  const where = buildUsersWhere(filter);

  const data = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: { subscriptions: true },
  });

  return data;
}

export type adminGetUsersType = Awaited<ReturnType<typeof adminGetUsers>>[0];

export async function adminGetUsersCount(filter: {
  search?: string;
  active?: boolean;
  role?: string;
  subscription?: boolean;
  customStartDate?: string;
  customEndDate?: string;
}) {
  // await requireAdmin();

  const where = buildUsersWhere(filter);

  try {
    const count = await prisma.user.count({
      where,
    });

    return count;
  } catch (error) {
    throw new Error();
  }
}

export async function adminUpdateUserRole(
  id: string,
  role: string
): Promise<MutationResponse> {
  // await requireAdmin();

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });

  if (!result) {
    console.error(new Error());
    return {
      status: 500,
      message: "Something is wrong!",
    };
  }

  return {
    status: 200,
    message: "Role updated!",
  };
}

export async function adminUpdateUserActiveStatus(
  id: string,
  active: boolean
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        active,
      },
    });

    return {
      status: 200,
      message: "Active Status updated!",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminDeleteUser(id: string): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "User Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
