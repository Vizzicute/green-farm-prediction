"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Banknote,
  Bitcoin,
  Phone,
  Building2,
  Edit2,
  EyeOff,
  Eye,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ExchangeRate, fetchExchangeRates } from "@/utils/exchange-rates";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { WalletSettings } from "@/schema/settings";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UpdateWalletForm from "./update-wallet-form";

export default function PageComponent() {
  const trpc = useTRPC();

  const [lastUpdated] = useState(new Date().toLocaleString());
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [form, setForm] = useState("");
  const { data, isLoading, refetch } = useQuery(
    trpc.adminGetSettingsByCategory.queryOptions({ category: "wallet" })
  );
  const wallets: WalletSettings = useMemo(() => {
    try {
      return data?.value ? JSON.parse(data.value) : {};
    } catch {
      return {} as WalletSettings;
    }
  }, [data]);

  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error loading exchange rates:", error);
        toast.error("Failed to load exchange rates");
      }
    };

    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const exchangeRateMap = useMemo(() => {
    return Object.fromEntries(exchangeRates.map((r) => [r.currency, r.rate]));
  }, [exchangeRates]);

  const getExchangeRate = (c: string) => exchangeRateMap[c] ?? 1;

  if (isLoading || !wallets) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading wallet wallets...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </div>
        </div>

        <Tabs defaultValue="paystack" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="paystack">Paystack</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="usd">USD Transfer</TabsTrigger>
            <TabsTrigger value="momo">MTN MoMo</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>

          <TabsContent value="paystack">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paystack Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Api Keys</Label>
                      <div className="w-full flex items-center justify-between border rounded p-2">
                        <div className="p-2">
                          <p className="text-sm font-medium">
                            Public Key: {wallets.paystack?.publicKey}
                          </p>
                          <div className="text-sm text-muted-foreground flex items-center justify-center">
                            <span className="text-center">Secret Key:{" "}
                              {showKey
                                ? wallets.paystack?.secretKey
                                : "**************************************************"}
                            </span>
                            <button onClick={() => setShowKey(!showKey)}>
                              {showKey ? (
                                <EyeOff className="size-5" />
                              ) : (
                                <Eye className="size-5" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Web Hook Secret: {wallets.paystack?.webhookSecret}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setForm("paystack");
                          }}
                        >
                          <Edit2 className="size-4" /> Update
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Exchange Rates</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {exchangeRates.map((rate) => (
                          <div
                            key={rate.currency}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span>
                              {rate.name} {`(${rate.symbol})`}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              $1 = {rate.rate.toFixed(2)} {rate.currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Nigerian Bank Transfer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Bank Details</Label>
                      <div className="w-full flex items-center justify-between border rounded p-2">
                        <div className="p-2">
                          <p className="text-sm font-medium">
                            Bank: {wallets.bankAccount?.bankName}
                          </p>
                          <p className="text-sm">
                            Account Name: {wallets.bankAccount?.accountName}
                          </p>
                          <p className="text-sm">
                            Account Number: {wallets.bankAccount?.accountNumber}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setForm("bankAccount");
                          }}
                        >
                          <Edit2 className="size-4" /> Update
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Exchange Rate</Label>
                      <div className="p-2 border rounded">
                        <p className="text-sm">
                          1 USD = {getExchangeRate("NGN").toFixed(2)} NGN
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usd">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  USD Bank Transfer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Bank Details</Label>
                      <div className="w-full flex items-center justify-between border rounded p-2">
                        <div className="p-2">
                          <p className="text-sm font-medium">
                            Bank: {wallets.usdBankAccount?.bankName}
                          </p>
                          <p className="text-sm">
                            Account Name: {wallets.usdBankAccount?.accountName}
                          </p>
                          <p className="text-sm">
                            Account Number:{" "}
                            {wallets.usdBankAccount?.accountNumber}
                          </p>
                          <p className="text-sm">
                            Routing Number:{" "}
                            {wallets.usdBankAccount?.routingNumber}
                          </p>
                          <p className="text-sm">
                            SWIFT/BIC: {wallets.usdBankAccount?.swiftCode}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setForm("usdBankAccount");
                          }}
                        >
                          <Edit2 className="size-4" /> Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="momo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  MTN Mobile Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Supported Countries</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["GHA", "UGA", "CMR"].map((country) => (
                          <div key={country} className="p-2 border rounded">
                            <p className="text-sm font-medium">{country}</p>
                            <p className="text-sm text-muted-foreground">
                              1 USD ={" "}
                              {getExchangeRate(
                                country === "CMR"
                                  ? "XAF"
                                  : country === "GHA"
                                    ? "GHS"
                                    : "UGX"
                              ).toFixed(2)}{" "}
                              {country === "CMR"
                                ? "XAF"
                                : country === "GHA"
                                  ? "GHS"
                                  : "UGX"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>MTN MoMo Number</Label>
                      <div className="w-full flex items-center justify-between border rounded p-2">
                        <div className="p-2">
                          <p className="text-sm font-medium">
                            {wallets.mobileMoney?.accountNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Please include your email as reference
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setOpen(true);
                            setForm("mobileMoney");
                          }}
                        >
                          <Edit2 className="size-4" /> Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5" />
                  Cryptocurrency Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Supported Cryptocurrencies</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { name: "Bitcoin", symbol: "BTC" },
                          { name: "Ethereum", symbol: "ETH" },
                          { name: "USDT", symbol: "USDT" },
                        ].map((crypto) => (
                          <div
                            key={crypto.symbol}
                            className="p-2 border rounded"
                          >
                            <p className="text-sm font-medium">{crypto.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {crypto.symbol}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Wallet Addresses</Label>
                      <div className="grid gap-2">
                        <div className="w-full flex items-center justify-between border rounded p-2">
                          <div className="p-2">
                            <p className="text-sm font-medium">BTC Address</p>
                            <p className="text-xs break-all">
                              {wallets.crypto?.bitcoin?.address}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setForm("bitcoin");
                            }}
                          >
                            <Edit2 className="size-4" /> Update
                          </Button>
                        </div>
                        <div className="w-full flex items-center justify-between border rounded p-2">
                          <div className="p-2">
                            <p className="text-sm font-medium">ETH Address</p>
                            <p className="text-xs break-all">
                              {wallets.crypto?.ethereum?.address}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setForm("ethereum");
                            }}
                          >
                            <Edit2 className="size-4" /> Update
                          </Button>
                        </div>
                        <div className="w-full flex items-center justify-between border rounded p-2">
                          <div className="p-2">
                            <p className="text-sm font-medium">
                              USDT Address (TRC20)
                            </p>
                            <p className="text-xs break-all">
                              {wallets.crypto?.usdt?.address}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setForm("usdt");
                            }}
                          >
                            <Edit2 className="size-4" /> Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Parameters</DialogTitle>
          </DialogHeader>
          <UpdateWalletForm
            refetch={refetch}
            wallet={wallets}
            formType={form}
            id={data ? data.id : ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
