import { CommentType, Prisma } from "@/generated/prisma";

export function buildPredictionsWhere(
  filter: Record<string, any>
): Prisma.PredictionWhereInput {
  const where: Prisma.PredictionWhereInput = {};

  if (!filter || Object.keys(filter).length === 0) return where;

  // Search across homeTeam, awayTeam, league
  if (filter.search && typeof filter.search === "string") {
    where.OR = [
      { homeTeam: { contains: filter.search } },
      { awayTeam: { contains: filter.search } },
      { league: { contains: filter.search } },
      { tip: { contains: filter.search } },
    ];
  }

  if (filter.subscriptionCategoryId) {
    where.subscriptionCategoryId = filter.subscriptionCategoryId;
  }

  if (filter.SubscriptionCategory && filter.SubscriptionCategory.name) {
    where.SubscriptionCategory = {
      name: filter.SubscriptionCategory.name,
    } as any;
  }

  if (filter.sport) {
    where.sport = filter.sport;
  }

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.htft) {
    where.htft = filter.htft;
  }

  if (filter.chance) {
    where.chance = filter.chance;
  }

  if (filter.either) {
    where.either = filter.either;
  }

  if (filter.btts !== undefined) {
    where.btts = filter.btts as boolean;
  }

  if (filter.over) {
    where.over = filter.over;
  }

  if (filter.banker !== undefined) {
    where.banker = filter.banker as boolean;
  }

  if (filter.tip) {
    where.tip = filter.tip;
  }

  if (filter.customStartDate || filter.customEndDate) {
    const start = filter.customStartDate
      ? new Date(`${filter.customStartDate}T00:00:00.000Z`)
      : undefined;
    const end = filter.customEndDate
      ? new Date(`${filter.customEndDate}T23:59:59.999Z`)
      : undefined;

    if (start && end) {
      where.datetime = { gte: start, lte: end };
    } else if (start) {
      where.datetime = { gte: start };
    } else if (end) {
      where.datetime = { lte: end };
    }
  }

  return where;
}

export function buildUsersWhere(
  filter: Record<string, any>
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (!filter || Object.keys(filter).length === 0) return where;

  // Search across homeTeam, awayTeam, league
  if (filter.search && typeof filter.search === "string") {
    where.OR = [
      { name: { contains: filter.search } },
      { email: { contains: filter.search } },
    ];
  }

  if (filter.role && typeof filter.role === "string") {
    where.role = filter.role;
  }

  if (filter.active !== undefined) {
    where.active = filter.active as boolean;
  }

  if (filter.subscription !== undefined) {
    where.subscriptions = {
      some: {
        isActive: filter.subscription as boolean,
      },
    };
  }

  if (filter.customStartDate || filter.customEndDate) {
    const start = filter.customStartDate
      ? new Date(`${filter.customStartDate}T00:00:00.000Z`)
      : undefined;
    const end = filter.customEndDate
      ? new Date(`${filter.customEndDate}T23:59:59.999Z`)
      : undefined;

    if (start && end) {
      where.createdAt = { gte: start, lte: end };
    } else if (start) {
      where.createdAt = { gte: start };
    } else if (end) {
      where.createdAt = { lte: end };
    }
  }

  return where;
}

export function buildSubscriptionsWhere(
  filter: Record<string, any>
): Prisma.SubscriptionWhereInput {
  const where: Prisma.SubscriptionWhereInput = {};

  if (!filter || Object.keys(filter).length === 0) return where;

  // Search across homeTeam, awayTeam, league
  if (filter.search && typeof filter.search === "string") {
    where.OR = [
      {
        User: {
          name: { contains: filter.search },
          email: { contains: filter.search },
        },
      },
    ];
  }

  if (filter.isActive !== undefined) {
    where.isActive = filter.isActive as boolean;
  }

  if (filter.isFreezed !== undefined) {
    where.isFreezed = filter.isFreezed as boolean;
  }

  if (filter.category) {
    where.subscriptionCategoryId = filter.category;
  }

  if (filter.customStartDate || filter.customEndDate) {
    const start = filter.customStartDate
      ? new Date(`${filter.customStartDate}T00:00:00.000Z`)
      : undefined;
    const end = filter.customEndDate
      ? new Date(`${filter.customEndDate}T23:59:59.999Z`)
      : undefined;

    if (start && end) {
      where.createdAt = { gte: start, lte: end };
    } else if (start) {
      where.createdAt = { gte: start };
    } else if (end) {
      where.createdAt = { lte: end };
    }
  }

  return where;
}

export function buildBlogsWhere(
  filter: Record<string, any>
): Prisma.BlogWhereInput {
  const where: Prisma.BlogWhereInput = {};

  if (!filter || Object.keys(filter).length === 0) return where;

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.search && typeof filter.search === "string") {
    where.OR = [{ title: { contains: filter.search } }];
  }

  if (filter.customStartDate || filter.customEndDate) {
    const start = filter.customStartDate
      ? new Date(`${filter.customStartDate}T00:00:00.000Z`)
      : undefined;
    const end = filter.customEndDate
      ? new Date(`${filter.customEndDate}T23:59:59.999Z`)
      : undefined;

    if (start && end) {
      where.createdAt = { gte: start, lte: end };
    } else if (start) {
      where.createdAt = { gte: start };
    } else if (end) {
      where.createdAt = { lte: end };
    }
  }

  return where;
}

export function buildCommentsWhere(
  filters: Record<string, any>,
  type: CommentType
): Prisma.CommentWhereInput {
  const where: Prisma.CommentWhereInput = {};

  if (!filters || Object.keys(filters).length === 0) return where;

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.blogId) {
    where.blogId = filters.blogId
  }

  if (type === "BLOG" && filters.search && typeof filters.search === "string") {
    where.OR = [
      { content: { contains: filters.search } },
      { blog: { title: { contains: filters.search } } },
    ];
  }

  if (
    type === "SUBSCRIPTION" &&
    filters.search &&
    typeof filters.search === "string"
  ) {
    where.OR = [
      { content: { contains: filters.search } },
      { user: { email: { contains: filters.search } } },
    ];
  }

  if (filters.customStartDate || filters.customEndDate) {
    const start = filters.customStartDate
      ? new Date(`${filters.customStartDate}T00:00:00.000Z`)
      : undefined;
    const end = filters.customEndDate
      ? new Date(`${filters.customEndDate}T23:59:59.999Z`)
      : undefined;
    if (start && end) {
      where.createdAt = { gte: start, lte: end };
    } else if (start) {
      where.createdAt = { gte: start };
    } else if (end) {
      where.createdAt = { lte: end };
    }
  }

  return where;
}
