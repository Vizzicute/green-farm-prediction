import { CommentStatus, CommentType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Comment } from "@/schema/comment";
import { MutationResponse } from "@/types";
import { buildCommentsWhere } from "@/utils/where-filter";

export async function addComment(data: Comment): Promise<MutationResponse> {
  try {
    await prisma.comment.create({
      data,
    });
    return {
      status: 200,
      message: "comment added!",
    };
  } catch {
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
}

export async function getComments(
  type: CommentType,
  filters: {
    status?: CommentStatus;
    search?: string;
    customStartDate?: string;
    customEndDate?: string;
  },
  pageSize: number,
  pageNumber: number
) {
  const where = buildCommentsWhere(filters, type);

  const comments = await prisma.comment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    where: { ...where, type },
    include: {
      blog: true,
      user: true,
    },
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
  });

  return comments.sort((a, b) => {
    const statusOrder = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

export async function getCommentsCount(
  type: CommentType,
  filters: {
    status?: CommentStatus;
    search?: string;
    customStartDate?: string;
    customEndDate?: string;
  }
) {
  const where = buildCommentsWhere(filters, type);

  const count = await prisma.comment.count({
    where: { ...where, type },
  });
  return count;
}
