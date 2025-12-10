import { prisma } from "@/lib/prisma";
import { Notification } from "@/schema/notification";
import { MutationResponse } from "@/types";

export async function newNotification(
  data: Notification
): Promise<MutationResponse> {
  try {
    await prisma.notification.create({
      data,
    });

    return {
      status: 200,
      message: "Notification Created!",
    };
  } catch {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function markNotificationAsRead(
  id: string
): Promise<MutationResponse> {
  try {
    await prisma.notification.update({
      where: { id },
      data: {
        read: true,
      },
    });

    return {
      status: 200,
      message: "marked as read!",
    };
  } catch {
    return {
      status: 500,
      message: "Unable to mark notification as read",
    };
  }
}

export async function markAllAsReadMutation(): Promise<MutationResponse> {
  try {
    await prisma.notification.updateMany({
      data: { read: true },
    });

    return {
      status: 200,
      message: "notifications marked as read",
    };
  } catch {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function getNotifications(
  id: string,
  pageSize: number,
  page: number
) {
  const data = await prisma.notification.findMany({
    where: { userId: id },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return data;
}

export async function getUnreadNotificationsCount(id: string) {
  const count = await prisma.notification.count({
    where: { userId: id, read: false },
  });

  return count;
}
