import { PredictionStatus } from "@/generated/prisma";
import z from "zod";

export const predictionSchema = z.object({
  id: z.string().optional(),
  hometeam: z.string().nonempty("Add Hometeam."),
  awayteam: z.string().nonempty("Add Awayteam."),
  datetime: z.coerce.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date/time format.",
  }),
  sport: z.enum(["FOOTBALL", "BASKETBALL"]),
  league: z.string().nonempty("Select League."),
  tip: z.string().nonempty("Add Tip"),
  odd: z.coerce.number().gt(1, { message: "Input Valid Odd" }),
  winProb: z.number().optional(),
  over: z.string().optional(),
  chance: z.string().optional(),
  htft: z.string().optional(),
  either: z.string().optional(),
  isBanker: z.boolean(),
  isBtts: z.boolean().optional(),
  subscriptionCategoryId: z.string().nonempty("Choose Plan Type"),
});

export type predictionSchemaType = z.infer<typeof predictionSchema>;

export const predictionResultSchema = z.object({
  id: z.string().optional(),
  homescore: z.string().nonempty("Input Home Score."),
  awayscore: z.string().nonempty("Input Away Score."),
  status: z.enum(PredictionStatus),
});

export const predictionFilterSchema = z.object({
  search: z.string().optional(),
  customEndDate: z.string().optional(),
  customStartDate: z.string().optional(),
  status: z.enum(PredictionStatus).optional(),
  subscriptionCategoryId: z.string().optional(),
  btts: z.boolean().optional(),
  banker: z.boolean().optional(),
  // allow either a single value or an array of values for flexible filtering
  chance: z
    .union([
      z.enum(["1X", "12", "X2"]),
      z.array(z.string()),
      z.object({ in: z.array(z.string()) }),
    ])
    .optional(),
  either: z
    .union([
      z.enum(["HWEH", "DEH", "AWEH"]),
      z.array(z.string()),
      z.object({ in: z.array(z.string()) }),
    ])
    .optional(),
  over: z
    .union([
      z.enum([
        "OV1.5",
        "OV2.5",
        "OV3.5",
        "OV4.5",
        "UN4.5",
        "UN3.5",
        "UN2.5",
        "UN1.5",
      ]),
      z.array(z.string()),
      z.object({ in: z.array(z.string()) }),
    ])
    .optional(),
  htft: z
    .union([
      z.enum(["1/1", "1/X", "1/2", "X/1", "X/X", "X/2", "2/1", "2/X", "2/2"]),
      z.array(z.string()),
      z.object({ in: z.array(z.string()) }),
    ])
    .optional(),
  // additional fields supported by frontend filters
  tip: z
    .union([
      z.string(),
      z.array(z.string()),
      z.object({ in: z.array(z.string()) }),
    ])
    .optional(),
  sport: z.enum(["FOOTBALL", "BASKETBALL"]).optional(),
  SubscriptionCategory: z.object({ name: z.string() }).optional(),
});

export type PredictionFilter = z.infer<typeof predictionFilterSchema>;

export type predictionResultSchemaType = z.infer<typeof predictionResultSchema>;
