"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import LoadingButton from "@/components/loading-button";
import {
  predictionResultSchema,
  predictionResultSchemaType,
} from "@/schema/prediction";
import { PredictionStatus, SportType } from "@/generated/prisma";

interface iComProps {
  prediction: {
    id: string;
    datetime: string;
    sport: SportType;
    league: string;
    tip: string;
    over: string;
    chance: string;
    htft: string;
    either: string;
    subscriptionCategoryId: string | null;
    createdAt: string;
    updatedAt: string;
    SubscriptionCategory: {
      id: string;
      name: string;
      minOdds: number;
      maxOdds: number;
      uniqueColor: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    odds: number;
    homeTeam: string;
    awayTeam: string;
    homescore: string | null;
    awayscore: string | null;
    status: PredictionStatus | null;
    btts: boolean;
    banker: boolean;
  };
  refetch: () => void;
}

const UpdateResultForm = ({ prediction, refetch }: iComProps) => {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.adminUpdatePredictionResult.mutationOptions()
  );

  const form = useForm<predictionResultSchemaType>({
    resolver: zodResolver(predictionResultSchema),
    defaultValues: {
      homescore: prediction.homescore!,
      awayscore: prediction.awayscore!,
      status: prediction.status!,
    },
  });

  async function onSubmit(values: z.infer<typeof predictionResultSchema>) {
    values.id = prediction.id;
    mutate(
      { ...values },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-4 p-4 flex flex-wrap justify-around items-start"
      >
        <FormField
          control={form.control}
          name="homescore"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[30%] md:w-[30%]">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Home Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="awayscore"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[30%] md:w-[30%]">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Away Team"
                  className="bg-stone-100 rounded-sm border-secondary focus-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select
                  value={field.value === "PENDING" ? undefined : field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full bg-stone-100 rounded-sm border-secondary focus-none">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="WON">Win</SelectItem>
                      <SelectItem value="LOST">Loss</SelectItem>
                      <SelectItem value="VOID">Void</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit">
          Submit Result
        </LoadingButton>
      </form>
    </Form>
  );
};

export default UpdateResultForm;
