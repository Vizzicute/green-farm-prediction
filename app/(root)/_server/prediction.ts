import { prisma } from "@/lib/prisma";
import { PredictionFilter } from "@/schema/prediction";
import { buildPredictionsWhere } from "@/utils/where-filter";

export async function getPredictions(
  filter: PredictionFilter,
  pageSize: number,
  page: number
) {
  const where = buildPredictionsWhere(filter);

  const data = await prisma.prediction.findMany({
    orderBy: { datetime: "desc" },
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: { SubscriptionCategory: true },
  });

  return data;
}
