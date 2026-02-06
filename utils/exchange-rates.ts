import { toast } from "sonner";
import currency from "@/data/currencies.json";

export interface ExchangeRate {
  name: string;
  symbol: string;
  currency: string;
  rate: number;
  lastUpdated: string;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let exchangeRatesCache: ExchangeRate[] = [];
let lastFetchTime: number = 0;

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const now = Date.now();

  // Return cached rates if they're still valid
  if (exchangeRatesCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const data = await response.json();

    const currencyArray = Object.entries(currency);

    const rates: ExchangeRate[] = currencyArray.map(([code, info]) => ({
      name: info.name,
      symbol: info.symbol,
      currency: info.code,
      rate: data.rates[code] ?? 1,
      lastUpdated: new Date().toISOString(),
    }));

    // Update cache
    exchangeRatesCache = rates;
    lastFetchTime = now;

    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    toast.error("Failed to fetch exchange rates");
    return exchangeRatesCache; // Return cached rates if available
  }
}

export function getExchangeRate(currency: string): number {
  const rate = exchangeRatesCache.find((r) => r.currency === currency);
  return rate?.rate || 1;
}
