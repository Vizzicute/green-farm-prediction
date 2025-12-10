"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/lib/trpc/client";
import { currencyDiscountSchema, CurrencyDiscount } from "@/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import currencyList from "@/data/currencies.json"; // your full currencies list
import { Edit2, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { parseDiscountData } from "@/utils/discounts";

const DiscountsForm = () => {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");

  const { data: stored, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "discounts" })
  );

  const { mutate, isPending: updatingDiscounts } = useMutation(
    trpc.adminUpdateSettings.mutationOptions()
  );

  const discountData: CurrencyDiscount[] = parseDiscountData(stored?.value);

  // Get discount entry or create default
  function getDiscount(code: string) {
    return (
      discountData.find((d) => d.currencyCode === code) || {
        currencyCode: code,
        D10: 0,
        D20: 0,
        D30: 0,
      }
    );
  }

  // Form
  const form = useForm<CurrencyDiscount>({
    resolver: zodResolver(currencyDiscountSchema) as Resolver<CurrencyDiscount>,
    defaultValues: {
      currencyCode: "",
      D10: 0,
      D20: 0,
      D30: 0,
    },
  });

  // Reset when modal open
  useEffect(() => {
    if (open && currencyCode) {
      const entry = getDiscount(currencyCode);
      form.reset({
        ...entry,
        D10: 100 - entry.D10 * 100,
        D20: 100 - entry.D20 * 100,
        D30: 100 - entry.D30 * 100,
      });
    }
  }, [open, currencyCode]);

  // Submit handler
  async function onSubmit(data: CurrencyDiscount) {
    data.D10 = (100 - data.D10) / 100;
    data.D20 = (100 - data.D20) / 100;
    data.D30 = (100 - data.D30) / 100;
    const updated = [
      // keep others
      ...discountData.filter((d) => d.currencyCode !== data.currencyCode),
      // overwrite current currency
      data,
    ];

    const value = JSON.stringify(updated);
    mutate(
      { id: stored!.id, value },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 200) {
            toast.success(data.message);
            refetch();
            setOpen(false);
          }

          toast.error(data.message);
        },
        onError: () => {
          toast.error("Something went wrong while updating social settings.");
        },
      }
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Currency Discounts</Label>
          <Button
            onClick={() => {
              setCurrencyCode("USD"); // default for new
              setOpen(true);
            }}
          >
            <PlusIcon className="size-4" /> Add Currency Discount
          </Button>
        </div>

        {/* Existing Discount Entries */}
        <div className="grid gap-2">
          {discountData.map((d) => (
            <div
              key={d.currencyCode}
              className="flex items-center justify-between border rounded p-2"
            >
              <div>
                <p className="font-medium">{d.currencyCode}</p>
                <p className="text-sm text-muted-foreground">
                  {100 - (d.D10 * 100)}% for 10 Days  •  {100 - (d.D20 * 100)}% for 20 Days  •  {100 - (d.D30 * 100)}
                  % for 30 Days
                </p>
              </div>

              <Button
                onClick={() => {
                  setCurrencyCode(d.currencyCode);
                  setOpen(true);
                }}
              >
                <Edit2 className="size-4" /> Update Discount
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* =============== Dialog =============== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Currency Discount</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Currency Select */}
              <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(currencyList).map(([code, info]) => (
                          <SelectItem key={code} value={info.code}>
                            {info.name} {`(${info.symbol})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DISCOUNT INPUTS */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="D10"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>10 Days Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="D20"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>20 Days Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="D30"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>30 Days Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <LoadingButton
                loading={updatingDiscounts}
                type="submit"
                className="w-full"
              >
                Save Discount
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscountsForm;
