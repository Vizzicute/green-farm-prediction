import {
  format,
  subDays,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const thisMonth = {
  from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
  to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
};

export const lastMonth = {
  from: format(
    startOfMonth(subDays(startOfMonth(new Date()), 1)),
    "yyyy-MM-dd"
  ),
  to: format(endOfMonth(subDays(startOfMonth(new Date()), 1)), "yyyy-MM-dd"),
};

export function getDateRange(filter: string) {
  const now = new Date();
  switch (filter) {
    case "today":
      return { from: format(now, "yyyy-MM-dd"), to: format(now, "yyyy-MM-dd") };
    case "yesterday":
      const yest = subDays(now, 1);
      return {
        from: format(yest, "yyyy-MM-dd"),
        to: format(yest, "yyyy-MM-dd"),
      };
    case "this-week":
      return {
        from: format(startOfWeek(now), "yyyy-MM-dd"),
        to: format(endOfWeek(now), "yyyy-MM-dd"),
      };
    case "last-week":
      const lastWeekStart = startOfWeek(subDays(now, 7));
      const lastWeekEnd = endOfWeek(subDays(now, 7));
      return {
        from: format(lastWeekStart, "yyyy-MM-dd"),
        to: format(lastWeekEnd, "yyyy-MM-dd"),
      };
    case "last-7-days":
      return {
        from: format(startOfDay(subDays(now, 7)), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      };
    case "this-month":
      return {
        from: format(startOfMonth(now), "yyyy-MM-dd"),
        to: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    case "last-month":
      const lastMonth = subDays(startOfMonth(now), 1);
      return {
        from: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
        to: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
      };
    default:
      return { from: "1970-01-01", to: format(now, "yyyy-MM-dd") };
  }
}

export function getTimeFilterLabel(filter: string) {
  switch (filter) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "this-week":
      return "This Week";
    case "last-week":
      return "Last Week";
    case "last-7-days":
      return "Last 7 Days";
    case "this-month":
      return "This Month";
    case "last-month":
      return "Last Month";
    default:
      return "All Time";
  }
}
