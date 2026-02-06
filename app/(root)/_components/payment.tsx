"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaystackButton } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { toast } from "sonner";
import { useTRPC } from "@/lib/trpc/client";
import { useSession } from "@/hooks/use-session";
import { WalletSettings } from "@/schema/settings";
import { fetchExchangeRates, getExchangeRate } from "@/utils/exchange-rates";
import { SubDuration } from "@/generated/prisma";

interface PaymentDialogProps {
  open: boolean;
  amount: string;
  currency: string;
  duration: SubDuration;
  subscriptionCategoryId: string;
  onClose: () => void;
}

type referenceObj = {
  message: string;
  reference: string;
  status: "sucess" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
};

const PaymentDialog = ({
  open,
  amount,
  currency,
  duration,
  subscriptionCategoryId,
  onClose,
}: PaymentDialogProps) => {
  const trpc = useTRPC();

  const { data: wallets, isLoading } = useQuery(
    trpc.getSettingsByCategory.queryOptions({ category: "wallet" })
  );

  const { data: subscriptionCategory } = useQuery(
    trpc.getSubscriptionCategory.queryOptions(subscriptionCategoryId)
  );

  const walletData: WalletSettings = wallets?.value
    ? JSON.parse(wallets.value)
    : {};

  const { data: userSession } = useSession();
  const user = userSession?.user;

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  // Format amount with commas and 2 decimals
  const formattedAmount = `${currency} ${Number(amount).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

  // paystack integration
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        await fetchExchangeRates();
      } catch (error) {
        console.error("Error loading exchange rates:", error);
        toast.error("Failed to load exchange rates");
      }
    };

    loadExchangeRates();
    // Refresh rates every hour
    const interval = setInterval(loadExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const currencyRate = getExchangeRate(currency);
  const NGNRate = getExchangeRate("NGN");
  const amountInNGN = (Number(amount) * (NGNRate / currencyRate)).toFixed(2);

  useEffect(() => {
    setSuccess(false);
    setRef("" + Math.floor(Math.random() * 1000000000 + 1));
  }, [success]);

  const config: PaystackProps = {
    reference: ref,
    email: user?.email ?? "",
    amount: (Number(amountInNGN) * 100) | 0,
    publicKey: walletData?.paystack?.publicKey || "",
    currency: "NGN",
  };

  const { mutate: upsertSubscription, isPending: isEditing } = useMutation(
    trpc.upsertSubscription.mutationOptions()
  );

  const { mutate: notifyNewSubscription, isPending: isNotifying } = useMutation(
    trpc.newNotification.mutationOptions()
  );

  const onSuccess = async (reference: referenceObj) => {
    setLoading(true);
    const res = await fetch(`/api/paystack/${reference.reference}`);
    const verifyData = await res.json();

    // Defensive check
    if (!verifyData || !verifyData.success) {
      toast.error("Payment verification failed: Invalid response from server.");
      return;
    }

    if (verifyData.success) {
      try {
        setSuccess(true);
        upsertSubscription(
          {
            userId: user?.id ?? "",
            subscriptionCategoryId,
            duration,
          },
          {
            onSuccess: () => {
              notifyNewSubscription({
                type: "NEW_SUBSCRIPTION",
                userId: user?.id ?? "",
                message: `${user?.email ?? ""} subscribe to our ${subscriptionCategory?.name ?? ""} for ${duration === "D10" ? "10" : duration === "D20" ? "20" : "30"} days!`,
              });
              toast.success(
                "Payment successful! Subscription updated. Go to dashboard"
              );
            },
          }
        );
      } catch (error) {
        console.error(error);
        toast.error("Payment verification failed");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Payment verification failed: Payment not successful.");
    }
  };

  const onPaystackClose = () => {
    alert("Payment cancelled.");
  };

  const paystackButtonText =
    isEditing || isNotifying || loading
      ? "Processing..."
      : `Pay ${formattedAmount || "0"}`;

  const componentProps = {
    ...config,
    text: paystackButtonText,
    // onSuccess,
    onSuccess: onSuccess,
    onClose: onPaystackClose,
  };

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 640);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
  }

  const isMobile = useIsMobile();

  // Payment content (shared by Dialog and Drawer)
  const PaymentContent = () => (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">Subscription for:</span>
        <span className="font-mono text-lg">
          {subscriptionCategory ? subscriptionCategory.name : ""} (
          {duration === "D10" ? "10" : duration === "D20" ? "20" : "30"} days)
        </span>
      </div>
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">Amount:</span>
        <span className="text-md">{formattedAmount}</span>
      </div>
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-base">User:</span>
        <span className="font-mono text-sm">{user?.email}</span>
      </div>
      {isLoading && (
        <div className="text-center py-8">Loading payment methods...</div>
      )}
      {!isLoading && walletData && (
        <div className="flex flex-col gap-4 w-full">
          {/* Paystack */}
          {walletData.paystack?.publicKey && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">
                Paystack (Card/Bank/USSD)
              </div>
              <div className="text-xs text-muted-foreground">
                Pay securely with Paystack (Nigeria, Ghana, South Africa, etc.)
              </div>
              <PaystackButton
                {...componentProps}
                disabled={isEditing || isNotifying || loading}
                className="w-full bg-[#0ba4db] mt-2 rounded-md p-2"
              />
            </div>
          )}

          {/* Bank Transfer (NGN) */}
          {walletData.bankAccount?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">Bank Transfer (NGN)</div>
              <div className="text-xs text-muted-foreground">
                Transfer to the Nigerian bank account below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {walletData.bankAccount.bankName} -{" "}
                  {walletData.bankAccount.accountNumber} -{" "}
                  {walletData.bankAccount.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(walletData.bankAccount.accountNumber)
                  }
                  className={
                    copied === walletData.bankAccount.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === walletData.bankAccount.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* USD Bank Transfer */}
          {walletData.usdBankAccount?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">USD Bank Transfer</div>
              <div className="text-xs text-muted-foreground">
                Transfer USD to the bank account below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {walletData.usdBankAccount.bankName} -{" "}
                  {walletData.usdBankAccount.accountNumber} -{" "}
                  {walletData.usdBankAccount.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(walletData.usdBankAccount.accountNumber)
                  }
                  className={
                    copied === walletData.usdBankAccount.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === walletData.usdBankAccount.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Money */}
          {walletData.mobileMoney?.accountNumber && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">MTN MoMo</div>
              <div className="text-xs text-muted-foreground">
                Send to MTN Mobile Money ({walletData.mobileMoney.provider})
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {walletData.mobileMoney.accountNumber} -{" "}
                  {walletData.mobileMoney.accountName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    handleCopy(walletData.mobileMoney.accountNumber)
                  }
                  className={
                    copied === walletData.mobileMoney.accountNumber
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === walletData.mobileMoney.accountNumber ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Crypto - Bitcoin */}
          {walletData.crypto?.bitcoin?.address && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">Crypto (BTC)</div>
              <div className="text-xs text-muted-foreground">
                Send BTC to the address below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {walletData.crypto.bitcoin.address}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(walletData.crypto.bitcoin.address)}
                  className={
                    copied === walletData.crypto.bitcoin.address
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === walletData.crypto.bitcoin.address ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Crypto - USDT */}
          {walletData.crypto?.usdt?.address && (
            <div className="w-full border rounded-lg p-4 flex flex-col gap-1 bg-secondary/80">
              <div className="font-semibold text-base">
                Crypto (USDT - {walletData.crypto.usdt.network || "TRC20"})
              </div>
              <div className="text-xs text-muted-foreground">
                Send USDT to the address below
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">
                  {walletData.crypto.usdt.address}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(walletData.crypto.usdt.address)}
                  className={
                    copied === walletData.crypto.usdt.address
                      ? "bg-green-200"
                      : ""
                  }
                >
                  {copied === walletData.crypto.usdt.address ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onClose} modal={false}>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>Payment Details</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-scroll h-full">
              <PaymentContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onClose} modal={false}>
          <DialogContent className="w-[60%] h-[70%] overflow-y-scroll p-4 rounded-sm">
            <DialogHeader className="py-5 text-center">
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <PaymentContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PaymentDialog;
