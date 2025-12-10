"use client";

import LoadingButton from "@/components/loading-button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc/client";
import {
  subscriptionCategorySchema,
  SubscriptionCategoryType,
} from "@/schema/subscription";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";

interface iComProps {
    refetchCategories: () => void;
    category: {
        id: string;
        name: string;
        minOdds: number;
        maxOdds: number;
        uniqueColor: string;
        createdAt: string;
        updatedAt: string;
      };
}

const UpdateCategoryForm = ({ refetchCategories, category }: iComProps) => {
  const [uniqueColor, setUniqueColor] = useState(category.uniqueColor);
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.adminUpdateSubscriptionCategory.mutationOptions()
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCounterColorButtonClick = () => {
    inputRef.current?.click();
  };

  const handleCounterColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueColor(e.target.value);
  };

  const resolver = zodResolver(
    subscriptionCategorySchema
  ) as unknown as Resolver<SubscriptionCategoryType>;
  const form = useForm<SubscriptionCategoryType>({
    resolver,
    defaultValues: {
      name: category.name,
      minOdds: category.minOdds,
      maxOdds: category.maxOdds,
    },
  });

  async function onSubmit(data: SubscriptionCategoryType) {
    data.uniqueColor = uniqueColor;
    data.id = category.id;
    mutate(
      { ...data },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          form.reset();
          refetchCategories();
        },
        onError: (error) => {
          toast.error("Something went wrong!");
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Title</FormLabel>
              <Input {...field} disabled={category.name === "free"} />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-between">
          <FormField
            control={form.control}
            name="minOdds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Odds</FormLabel>
                <Input type="number" {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxOdds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Odds</FormLabel>
                <Input type="number" {...field} />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full space-y-2">
          <Label>Unique Color</Label>
          <div className="flex flex-row gap-2 items-center justify-center">
            <div
              style={{ backgroundColor: uniqueColor }}
              className="size-8 rounded-full"
            />
            <button
              type="button"
              onClick={handleCounterColorButtonClick}
              className="flex items-center p-2 rounded-sm border text-[12px]"
            >
              <Palette className="size-5" />
            </button>
            <input
              type="color"
              ref={inputRef}
              onChange={handleCounterColorChange}
              className="w-[1px] opacity-0"
            />

            <Input
              type="text"
              placeholder="#ffffff"
              className="flex-1"
              value={uniqueColor}
              onChange={(e) => setUniqueColor(e.target.value)}
            />
          </div>
        </div>
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Update Category
        </LoadingButton>
      </form>
    </Form>
  );
}

export default UpdateCategoryForm
