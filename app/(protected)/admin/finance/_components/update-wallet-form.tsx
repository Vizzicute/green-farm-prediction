"use client";

import LoadingButton from "@/components/loading-button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTRPC } from "@/lib/trpc/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { WalletSettings, walletSettingsSchema } from "@/schema/settings";
import { PasswordInput } from "@/components/password-input";

interface iComProps {
  refetch: () => void;
  wallet: WalletSettings;
  formType: string;
  id: string;
}

const UpdateWalletForm = ({ refetch, wallet, formType, id }: iComProps) => {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.adminUpdateSettings.mutationOptions()
  );

  const resolver = zodResolver(
    walletSettingsSchema
  ) as unknown as Resolver<WalletSettings>;
  const form = useForm<WalletSettings>({
    resolver,
    defaultValues: {
      paystack: {
        publicKey: "",
        secretKey: "",
      },
      bankAccount: {
        bankName: "",
        accountName: "",
        accountNumber: "",
      },
      usdBankAccount: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        swiftCode: "",
        routingNumber: "",
      },
      mobileMoney: {
        provider: "",
        accountName: "",
        accountNumber: "",
      },
      crypto: {
        bitcoin: {
          address: "",
          network: "",
        },
        ethereum: {
          address: "",
          network: "",
        },
        usdt: {
          address: "",
          network: "",
        }
      }
    },
  });

  useEffect(() => {
    if (!wallet) return;
    form.reset(wallet);
  }, [wallet]);

  async function onSubmit(data: WalletSettings) {
    const value = JSON.stringify(data);
    mutate(
      { id, value },
      {
        onSuccess: (data: { status: number; message: string }) => {
          if (data.status === 500) {
            toast.error(data.message);
          }
          toast.success(data.message);
          form.reset();
          refetch();
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
        {formType === "paystack" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="paystack.publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paystack.secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Key</FormLabel>
                  <PasswordInput {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "bankAccount" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="bankAccount.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccount.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankAccount.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "usdBankAccount" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="usdBankAccount.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usdBankAccount.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AccountName</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usdBankAccount.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usdBankAccount.swiftCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swift Code</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usdBankAccount.routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "mobileMoney" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="mobileMoney.provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileMoney.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileMoney.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "bitcoin" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="crypto.bitcoin.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crypto.bitcoin.network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "ethereum" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="crypto.ethereum.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crypto.ethereum.network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        {formType === "usdt" && (
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="crypto.usdt.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crypto.usdt.network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        )}
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
};

export default UpdateWalletForm;
