"use client";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/lib/trpc/client";
import { Price, priceSchema } from "@/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

const PricesForm = () => {
  const trpc = useTRPC();

  const [open, setOpen] = useState(false);
  const [catId, setCatId] = useState("");

  // Fetch categories
  const { data: categories } = useQuery(
    trpc.adminGetSubscriptionCategories.queryOptions(),
  );

  // Fetch pricing settings
  const { data: prices, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "prices" }),
  );

  const { data: defaultPrice } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "defaultPrice" }),
  );

  const { mutate, isPending: updatingPrices } = useMutation(
    trpc.adminUpdateSettings.mutationOptions(),
  );

  const priceData: Price[] = prices?.value ? JSON.parse(prices.value) : [];

  /** Get ratio for selected category */
  function getCategoryPrice(id: string) {
    return (
      priceData.find((p) => p.subscriptionCategoryId === id) || {
        subscriptionCategoryId: id,
        ratio: 1,
      }
    );
  }

  /** Calculate actual display price */
  function calculatePrice(id: string) {
    const ratio = getCategoryPrice(id).ratio;
    return Number(defaultPrice?.value ?? 0) * Number(ratio);
  }

  /** Form for editing one category */
  const form = useForm<Price>({
    resolver: zodResolver(priceSchema) as Resolver<Price>,
    defaultValues: {
      subscriptionCategoryId: "",
      ratio: 1,
    },
  });

  /** Reset form when dialog opens */
  useEffect(() => {
    if (open && catId) {
      const p = getCategoryPrice(catId);
      form.reset({
        subscriptionCategoryId: catId,
        ratio: p.ratio,
      });
    }
  }, [open, catId]);

  /** Submit handler */
  async function onSubmit(data: Price) {
    const updatedPrices = priceData.some(
      (p) => p.subscriptionCategoryId === data.subscriptionCategoryId,
    )
      ? priceData.map((p) =>
          p.subscriptionCategoryId === data.subscriptionCategoryId
            ? { ...p, ratio: data.ratio }
            : p,
        )
      : [...priceData, data];

    const value = JSON.stringify(updatedPrices);

    mutate(
      { id: prices!.id, value },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            toast.success(data.message);
            refetch();
          }

          toast.error(data.message);
        },
        onError: () => {
          toast.error("Something went wrong while updating social settings.");
        },
      },
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4">
          {/* Subscription Categories Display */}
          <div className="space-y-2">
            <Label>Subscription Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories
                ?.filter((cat) => cat.name !== "free")
                .map((category) => (
                  <div key={category.id} className="p-2 border rounded">
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.minOdds} Odds - {category.maxOdds} Odds
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Price Items */}
          <div className="space-y-2">
            <Label>Subscription Prices</Label>
            <div className="grid gap-2">
              {categories
                ?.filter((cat) => cat.name !== "free")
                .map((category) => (
                  <div
                    key={category.id}
                    className="w-full flex items-center justify-between border rounded p-2"
                  >
                    <div className="p-2">
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs break-all">
                        {calculatePrice(category.id)} USD
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setCatId(category.id);
                        setOpen(true);
                      }}
                    >
                      <Edit2 className="size-4" /> Update Price
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================== Update Ratio Dialog ================== */}
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Price Ratio</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Ratio</Label>
              <input
                type="number"
                step="0.01"
                {...form.register("ratio", { valueAsNumber: true })}
                className="border rounded p-2 w-full"
              />
            </div>

            <LoadingButton
              loading={updatingPrices}
              type="submit"
              className="w-full"
            >
              Save
            </LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PricesForm;
