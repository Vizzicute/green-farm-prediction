"use client";

import LoadingButton from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  africanCountries,
  americanCountries,
  asianCountries,
  europeanCountries,
  internationalCompetitions,
  topleagues,
  uefaClubCompetitions,
} from "@/data";
import { useTRPC } from "@/lib/trpc/client";
import { predictionSchema, predictionSchemaType } from "@/schema/prediction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";

const AddPredictionForm = () => {
  const trpc = useTRPC();
  const [sport, setSport] = useState("FOOTBALL");

  const { mutate, isPending } = useMutation(
    trpc.adminAddPrediction.mutationOptions()
  );

  const { data: subscriptionCategories, isLoading } = useQuery(
    trpc.adminGetSubscriptionCategories.queryOptions()
  );

  const resolver = zodResolver(
    predictionSchema
  ) as unknown as Resolver<predictionSchemaType>;

  const form = useForm<predictionSchemaType>({
    resolver,
    defaultValues: {
      hometeam: "",
      awayteam: "",
      datetime: "",
      sport: "FOOTBALL",
      league: "",
      tip: "",
      subscriptionCategoryId: "",
      odd: 0,
      winProb: Math.floor(Math.random() * (99 - 80 + 1)) + 80,
      over: undefined,
      chance: undefined,
      htft: undefined,
      either: undefined,
      isBanker: false,
      isBtts: false,
    },
  });

  useEffect(() => {
    if (sport === "FOOTBALL") return;
    form.setValue("over", undefined);
    form.setValue("htft", undefined);
    form.setValue("chance", undefined);
    form.setValue("either", undefined);
    form.setValue("isBtts", false);
  }, [sport]);

  async function onSubmit(data: predictionSchemaType) {
    data.datetime = new Date(data.datetime).toISOString();
    mutate(
      { ...data },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          form.reset();
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
        className="w-full gap-4 space-y-4 flex flex-wrap justify-between items-start"
      >
        <FormField
          control={form.control}
          name="hometeam"
          render={({ field }) => (
            <FormItem className="w-full md:w-[30%] md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Home Team"
                  className="focus-none border-input rounded-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full md:w-[30%] flex flex-col p-5 border border-input bg-primary/5 rounded-none gap-4 items-center justify-center">
          <div className="bg-transparent rounded-full w-fit h-fit px-2 py-1 border-primary border-1 text-primary">
            vs
          </div>

          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select
                    value={sport}
                    onValueChange={(val) => {
                      setSport(val);
                      field.onChange;
                    }}
                  >
                    <SelectTrigger className="w-full focus-none border-input rounded-none">
                      <SelectValue placeholder="Sport Type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup>
                        <SelectLabel>Sport Types</SelectLabel>
                        <SelectItem value="FOOTBALL">Football</SelectItem>
                        <SelectItem value="BASKETBALL">BasketBall</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datetime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Date And Time"
                    className="w-full text-sm placeholder:text-sm focus-none border-input rounded-none overflow-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="awayteam"
          render={({ field }) => (
            <FormItem className="w-full md:w-[30%] md:mt-2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Away Team"
                  className="focus-none border-input rounded-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="league"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="League" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-input rounded-none">
                    <SelectGroup>
                      <SelectLabel>Top Leagues</SelectLabel>
                      {topleagues.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>UEFA Club Competitions</SelectLabel>
                      {uefaClubCompetitions.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>International Competitions</SelectLabel>
                      {internationalCompetitions.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Europe</SelectLabel>
                      {europeanCountries.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Africa</SelectLabel>
                      {africanCountries.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>America</SelectLabel>
                      {americanCountries.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Asia</SelectLabel>
                      {asianCountries.map((data, index) => (
                        <SelectItem key={index} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tip"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Prediction"
                  className="focus-none border-input rounded-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="odd"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Odds"
                  className="focus-none border-input rounded-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriptionCategoryId"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[25%]">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-input rounded-none">
                    <SelectGroup>
                      <SelectLabel>Plan</SelectLabel>
                      {!isLoading &&
                        subscriptionCategories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="capitalize"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="over"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%] border-input rounded-none">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={sport === "BASKETBALL"}
                >
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="Overs/Unders" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-primary/50 rounded-none">
                    <SelectGroup>
                      <SelectLabel>Select Total Goals</SelectLabel>
                      <SelectItem value="OV1.5">Over 1.5</SelectItem>
                      <SelectItem value="OV2.5">Over 2.5</SelectItem>
                      <SelectItem value="OV3.5">Over 3.5</SelectItem>
                      <SelectItem value="OV4.5">Over 4.5</SelectItem>
                      <SelectItem value="UN4.5">Under 4.5</SelectItem>
                      <SelectItem value="UN3.5">Under 3.5</SelectItem>
                      <SelectItem value="UN2.5">Under 2.5</SelectItem>
                      <SelectItem value="UN1.5">Under 1.5</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chance"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={sport === "BASKETBALL"}
                >
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="Chance" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-input rounded-none">
                    <SelectGroup>
                      <SelectLabel>Select Double Chance</SelectLabel>
                      <SelectItem value="1X">Home Or Draw</SelectItem>
                      <SelectItem value="12">Home Or Away</SelectItem>
                      <SelectItem value="X2">Draw Or Away</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="either"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={sport === "BASKETBALL"}
                >
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="Either Halfs" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-input rounded-none">
                    <SelectGroup>
                      <SelectLabel>Plan</SelectLabel>
                      <SelectItem value="HWEH">HWEH</SelectItem>
                      <SelectItem value="AWEH">AWEH</SelectItem>
                      <SelectItem value="DEH">DEH</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="htft"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[45%] md:w-[20%]">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={sport === "BASKETBALL"}
                >
                  <SelectTrigger className="w-full focus-none border-input rounded-none">
                    <SelectValue placeholder="Halftime/FullTime" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-input rounded-none">
                    <SelectGroup>
                      <SelectLabel>Halftime/Fulltime</SelectLabel>
                      <SelectItem value="1/1">Home/Home</SelectItem>
                      <SelectItem value="1/X">Home/Draw</SelectItem>
                      <SelectItem value="1/2">Home/Away</SelectItem>
                      <SelectItem value="X/1">Draw/Home</SelectItem>
                      <SelectItem value="X/X">Draw/Draw</SelectItem>
                      <SelectItem value="X/2">Draw/Away</SelectItem>
                      <SelectItem value="2/1">Away/Home</SelectItem>
                      <SelectItem value="2/X">Away/Draw</SelectItem>
                      <SelectItem value="2/2">Away/Away</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isBtts"
          render={({ field }) => (
            <FormItem className="w-[30%] space-x-2 flex flex-nowrap items-center p-2 bg-primary/20 border border-input rounded-none">
              <FormControl>
                <div className="flex flex-nowrap w-full">
                  <Switch
                    id="isBtts"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={sport === "BASKETBALL"}
                  />
                  <Label htmlFor="airplane-mode">BTTS?</Label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isBanker"
          render={({ field }) => (
            <FormItem className="w-[30%] space-x-2 flex flex-nowrap items-center p-2 bg-primary/20 border border-input rounded-none">
              <FormControl>
                <div className="w-full flex flex-nowrap">
                  <Switch
                    id="isBanker"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="airplane-mode">Banker Bet?</Label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full flex flex-nowrap justify-center">
          <LoadingButton
            loading={isPending}
            type="submit"
            className="uppercase rounded-none"
          >
            Submit Prediction
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default AddPredictionForm;
