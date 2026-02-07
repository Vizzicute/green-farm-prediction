"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { fetchExchangeRates, getExchangeRate } from "@/utils/exchange-rates";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { parseDiscountData } from "@/utils/discounts";
import { useSession } from "@/hooks/use-session";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import currency from "@/data/currencies.json";
import { CurrencyDiscount, Price } from "@/schema/settings";
import { formatCurrency } from "@/utils/format-currency";
import { SubDuration } from "@/generated/prisma";
import { useRouter } from "next/navigation";

// Dynamically import PaymentDialog with SSR disabled
const PaymentDialog = dynamic(() => import("./payment"), {
  ssr: false,
});

interface Props {
  className?: string;
}

const SubscriptionCounter = ({ className }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: userSession } = useSession();
  const userId = userSession?.user.id ?? "";

  // Fetch subscriptions, categories, prices, discounts
  const { data: subscriptions } = useQuery(
    trpc.getUserSubscriptions.queryOptions({ userId, predictionFilters: {} })
  );
  const { data: subscriptionCategories, isLoading: categoriesLoading } =
    useQuery(trpc.getSubscriptionCategories.queryOptions({
      predictionFilters: {},
    }));
  const { data: prices } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "prices" })
  );
  const { data: defaultPrice } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "defaultPrice" })
  );
  const { data: discounts } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "discounts" })
  );

  const priceData: Price[] = prices?.value ? JSON.parse(prices.value) : [];
  const discountData: CurrencyDiscount[] = parseDiscountData(discounts?.value);
  const defaultPriceData: number = defaultPrice?.value
    ? Number(defaultPrice?.value)
    : 30;

  // Get category pricing
  function getCategoryPrice(id: string) {
    return (
      priceData.find((p) => p.subscriptionCategoryId === id) || {
        subscriptionCategoryId: id,
        ratio: 1,
      }
    );
  }

  // Get discount entry
  function getDiscount(code: string) {
    return (
      discountData.find((d) => d.currencyCode === code) || {
        currencyCode: code,
        D10: 1,
        D20: 1,
        D30: 1,
      }
    );
  }

  function getRealPrice(
    currency: string,
    subscriptionCategoryId: string,
    duration: string
  ) {
    const discountMap = {
      D10: getDiscount(currency).D10,
      D20: getDiscount(currency).D20,
      D30: getDiscount(currency).D30,
    };

    let discount = 1;

    switch (duration) {
      case "D10":
        discount = getDiscount(currency).D10;
        break;
      case "D20":
        discount = 2 * getDiscount(currency).D20;
        break;
      case "D30":
        discount = 3 * getDiscount(currency).D30;
        break;
    }
    const categoryRatio = getCategoryPrice(subscriptionCategoryId).ratio;
    const exchangeRate = getExchangeRate(currency);

    return defaultPriceData * categoryRatio * discount * exchangeRate;
  }

  const formSchema = z.object({
    subscriptionCategoryId: z.string(),
    duration: z.enum(SubDuration),
    currency: z.string(),
    amount: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriptionCategoryId: "",
      duration: undefined,
      currency: "",
      amount: "",
    },
  });

  // Track form values
  const selectedCategoryId = useWatch({
    control: form.control,
    name: "subscriptionCategoryId",
  });
  const selectedDuration = useWatch({
    control: form.control,
    name: "duration",
  });
  const selectedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  const [subscriptionCategory, setSubscriptionCategory] = useState<any>(null);

  useEffect(() => {
    if (!subscriptionCategories || !selectedCategoryId) {
      setSubscriptionCategory(null);
      return;
    }
    const cat = subscriptionCategories.find((c) => c.id === selectedCategoryId);
    setSubscriptionCategory(cat || null);
  }, [selectedCategoryId, subscriptionCategories]);

  useEffect(() => {
    if (userSession) {
      const expiredSub = subscriptions?.find((sub) => sub.isActive === false);
      form.reset({
        subscriptionCategoryId: expiredSub?.subscriptionCategoryId || "",
        duration: expiredSub?.duration,
        currency: "",
        amount: "",
      });
    }
  }, [userSession, subscriptions, form]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRatesLoading, setIsRatesLoading] = useState(true);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  // Load exchange rates
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsRatesLoading(true);
        await fetchExchangeRates();
      } catch (error) {
        console.error("Error loading exchange rates:", error);
        toast.error("Failed to load exchange rates");
      } finally {
        setIsRatesLoading(false);
      }
    };
    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const isAllOptionSelected = () =>
    Boolean(selectedCategoryId && selectedDuration && selectedCurrency);

  const calculateTotalPrice = () => {
    if (!isAllOptionSelected() || isRatesLoading) return 0;
    return getRealPrice(
      selectedCurrency!,
      selectedCategoryId!,
      selectedDuration!
    );
  };

  useEffect(() => {
    if (isAllOptionSelected() && !isRatesLoading) {
      form.setValue("amount", String(calculateTotalPrice()));
    }
  }, [selectedCategoryId, selectedDuration, selectedCurrency, isRatesLoading]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!userSession?.session) {
        toast.error("Please log in to subscribe.");
        router.push("/login");
      }
      setOpenPaymentDialog(true);
      setIsLoading(true);
    } catch (error) {
      console.error(error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Subscription Counter</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center justify-center gap-4 p-2">
        {isAllOptionSelected() && subscriptionCategory && (
          <div className="flex flex-col p-2 items-center justify-start">
            <h2 className="text-lg font-semibold text-start">
              Benefits of Subscription
            </h2>
            <ul className="list-disc pl-5 text-sm">
              <li>
                Access to {subscriptionCategory.minOdds} odds -{" "}
                {subscriptionCategory.maxOdds} odds for{" "}
                {selectedDuration?.replace("D", "")} days
              </li>
              <li>Winnings and returns of investment guaranteed!</li>
            </ul>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2 items-center justify-center"
          >
            <div className="w-full flex flex-row justify-around items-center">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-[45%]">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                          <SelectValue placeholder="Currency" className="truncate max-w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              Choose Your Preferred Currency
                            </SelectLabel>
                            {Object.entries(currency).map(([code, info]) => (
                              <SelectItem key={info.name} value={info.code}>
                                {info.name} ({info.symbol})
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
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-[45%] ms-1">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Duration</SelectLabel>
                            <SelectItem value="D10">10 Days Plan</SelectItem>
                            <SelectItem value="D20">20 Days Plan</SelectItem>
                            <SelectItem value="D30">30 Days Plan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subscriptionCategoryId"
              render={({ field }) => (
                <FormItem className="w-[45%] me-1">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-stone-100 p-2 rounded-full focus-none">
                        <SelectValue placeholder="Desired Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Desired Plan</SelectLabel>
                          {subscriptionCategories
                            ?.filter((category) => category.name !== "free")
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}{" "}
                                {`(${category.minOdds} odds - ${category.maxOdds} odds daily)`}
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

            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold">Total Price: </span>
              <span className={`${!isAllOptionSelected() && "text-[10px]"}`}>
                {isRatesLoading
                  ? "Calculating..."
                  : isAllOptionSelected()
                    ? formatCurrency(calculateTotalPrice(), selectedCurrency!)
                    : "Choose options to see price"}
              </span>
            </div>

            <LoadingButton
              loading={isLoading}
              type="submit"
              className="rounded-full bg-amber-600 px-10 capitalize"
              disabled={!isAllOptionSelected() || isRatesLoading}
            >
              <ShoppingCart />
              Subscribe Now
            </LoadingButton>
          </form>
        </Form>

        {openPaymentDialog && userSession && (
          <PaymentDialog
            open={openPaymentDialog}
            currency={selectedCurrency!}
            amount={form.getValues().amount}
            subscriptionCategoryId={selectedCategoryId!}
            duration={selectedDuration!}
            onClose={() => setOpenPaymentDialog(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCounter;
