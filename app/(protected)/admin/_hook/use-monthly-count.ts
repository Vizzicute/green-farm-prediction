import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

function getLast12MonthsRanges() {
  const months: { from: string; to: string; label: string }[] = [];

  for (let i = 0; i < 12; i++) {
    const date = subMonths(new Date(), i);

    const from = format(startOfMonth(date), "yyyy-MM-dd");
    const to = format(endOfMonth(date), "yyyy-MM-dd");
    const label = format(date, "yyyy-MM");

    months.push({ from, to, label });
  }

  return months.reverse(); // oldest → newest
}

export function useUsersMonthlyCount() {
  const trpc = useTRPC();

  const monthRanges = getLast12MonthsRanges();

  const queries = monthRanges.map((range) =>
    useQuery(
      trpc.adminGetUsersCount.queryOptions({
        filters: { customStartDate: range.from, customEndDate: range.to },
      })
    )
  );

  const monthCountArray = queries.map((query) => query.data || 0);

  return monthCountArray;
}

export function useSubscriptionsMonthlyCount() {
  const trpc = useTRPC();

  const monthRanges = getLast12MonthsRanges();

  const queries = monthRanges.map((range) =>
    useQuery(
      trpc.adminGetSubscriptionsCount.queryOptions({
        filters: { customStartDate: range.from, customEndDate: range.to },
      })
    )
  );

  const monthCountArray = queries.map((query) => query.data || 0);

  return monthCountArray;
}