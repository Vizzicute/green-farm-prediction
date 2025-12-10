import { CommentStatus, CommentType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { MutationResponse } from "@/types";
import { buildCommentsWhere } from "@/utils/where-filter";

export async function adminUpdateCommentStatus(
  id: string,
  status: CommentStatus
): Promise<MutationResponse> {
  try {
    await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return {
      status: 200,
      message: "Comment status updated successfully.",
    };
  } catch {
    return {
      status: 500,
      message: "Failed to update comment status.",
    };
  }
}

export async function adminDeleteComment(
  id: string
): Promise<MutationResponse> {
  try {
    await prisma.comment.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Comment deleted",
    };
  } catch {
    return {
      status: 500,
      message: "Failed to delete comment.",
    };
  }
}

export async function adminGetComments(
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

export async function adminGetCommentsCount(
  type: CommentType,
  filters: {
  status?: CommentStatus;
  search?: string;
  customStartDate?: string;
  customEndDate?: string;
}) {
  const where = buildCommentsWhere(filters, type);

  const count = await prisma.comment.count({
    where: { ...where, type },
  });
  return count;
}
