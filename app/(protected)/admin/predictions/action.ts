import { PredictionStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  predictionResultSchemaType,
  predictionSchemaType,
} from "@/schema/prediction";
import { MutationResponse } from "@/types";
import { buildPredictionsWhere } from "@/utils/where-filter";

export async function adminCreatePrediction(
  data: predictionSchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.prediction.create({
      data: {
        homeTeam: data.hometeam,
        awayTeam: data.awayteam,
        datetime: data.datetime,
        sport: data.sport,
        league: data.league,
        tip: data.tip,
        odds: data.odd,
        banker: data.isBanker,
        subscriptionCategoryId: data.subscriptionCategoryId,
        over: data.over ?? "",
        chance: data.chance ?? "",
        htft: data.htft ?? "",
        either: data.either ?? "",
        btts: data.isBtts,
      },
    });

    return {
      status: 200,
      message: "Prediction Added!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function getAdminPredictions(
  filter: {
    search?: string;
    status?: PredictionStatus;
    subscriptionCategoryId?: string;
    customStartDate?: string;
    customEndDate?: string;
  },
  pageSize: number,
  page: number
) {
  // await requireAdmin();

  const where = buildPredictionsWhere(filter);

  try {
    const data = await prisma.prediction.findMany({
      orderBy: { datetime: "desc" },
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: { SubscriptionCategory: true },
    });

    return data;
  } catch (error) {
    console.error("Error in getAdminPredictions - filter:", filter);
    console.error("Built where:", JSON.stringify(where));
    console.error(error);
    throw error;
  }
}

export async function adminGetPredictionById(id: string) {
  // await requireAdmin();

  const data = await prisma.prediction.findUnique({ where: { id } });

  return data;
}
export type getAdminPredictionsType = Awaited<
  ReturnType<typeof getAdminPredictions>
>[0];

export async function getAdminPredictionsCount(filter: {
  search?: string;
  status?: PredictionStatus;
  subscriptionCategoryId?: string;
  customStartDate?: string;
  customEndDate?: string;
}) {
  // await requireAdmin();

  const where = buildPredictionsWhere(filter);

  const count = await prisma.prediction.count({
    where,
  });

  return count;
}

export async function adminUpdatePrediction(
  data: predictionSchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.prediction.update({
      data: {
        homeTeam: data.hometeam,
        awayTeam: data.awayteam,
        datetime: data.datetime,
        sport: data.sport,
        league: data.league,
        tip: data.tip,
        odds: data.odd,
        banker: data.isBanker,
        subscriptionCategoryId: data.subscriptionCategoryId,
        over: data.over ?? "",
        chance: data.chance ?? "",
        htft: data.htft ?? "",
        either: data.either ?? "",
        btts: data.isBtts,
      },
      where: {
        id: data.id ?? "",
      },
    });

    return {
      status: 200,
      message: "Prediction Updated!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminUpdatePredictionResult(
  data: predictionResultSchemaType
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.prediction.update({
      data: {
        homescore: data.homescore,
        awayscore: data.awayscore,
        status: data.status,
      },
      where: {
        id: data.id!,
      },
    });

    return {
      status: 200,
      message: "Result Updated!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}

export async function adminDeletePrediction(
  id: string
): Promise<MutationResponse> {
  // await requireAdmin();

  try {
    await prisma.prediction.delete({
      where: {
        id,
      },
    });

    return {
      status: 200,
      message: "Prediction Deleted",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Something went wrong!",
    };
  }
}
