import { CurrencyDiscount } from "@/schema/settings";

export function parseDiscountData(value: any): CurrencyDiscount[] {
  try {
    if (!value || value === "") return [];
    if (Array.isArray(value)) return value;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}